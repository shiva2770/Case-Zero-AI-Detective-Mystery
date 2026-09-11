import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { CASE_PACKS } from './src/data/casePacks.js';
import { ensureSuspectPortraits } from './src/lib/portraitGenerator.js';
import type { 
  CaseFile, 
  CasePackTheme, 
  CaseDifficulty, 
  CaseModifier, 
  InterrogationMessage, 
  InterrogationTechnique, 
  AccusationInput, 
  AccusationResult,
  Suspect,
  Clue
} from './src/types';

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Lazy initialize Gemini AI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Fallback Procedural Generator (Ensures 100% playable game even without API key)
function generateFallbackCase(
  theme: CasePackTheme = 'noir_1940s', 
  difficulty: CaseDifficulty = 'detective', 
  modifier: CaseModifier = 'none',
  isDaily: boolean = false
): CaseFile {
  const pack = CASE_PACKS[theme] || CASE_PACKS.noir_1940s;
  const timestamp = new Date().toISOString().slice(0, 10);
  const caseId = `case-${theme}-${Date.now().toString(36)}`;

  const victimNames = {
    noir_1940s: 'Arthur Pendelton',
    cyberpunk_2099: 'Dr. Hiroshi Tanaka',
    locked_room_manor: 'Lord Reginald Sterling',
    cozy_coastal_village: 'Captain Barnaby Finch',
    steampunk_express: 'Baron von Klinker'
  };

  const victimName = victimNames[theme] || 'Victor Blackwood';

  const rawCase: CaseFile = {
    caseId,
    title: `The Mystery of ${victimName}`,
    theme,
    difficulty,
    modifier,
    dateGenerated: timestamp,
    isDailyCase: isDaily,
    dailySeed: isDaily ? `daily-${timestamp}` : undefined,
    victim: {
      name: victimName,
      occupation: 'Wealthy Collector & Industrialist',
      timeOfDeath: '11:45 PM',
      causeOfDeath: 'Fatal Blunt Force Trauma & Poisoning',
      locationFound: pack.sampleLocations[0],
      briefBio: `${victimName} was known throughout town for his vast fortune and secretive dealings. He recently drew up a new contract that alienated several associates.`
    },
    incidentOverview: `At 11:45 PM, a loud crash echoed from the victim's location. Patrol officers arrived within 15 minutes to find ${victimName} deceased. The doors were bolted from the interior, and bloodstains suggest a struggle occurred before death.`,
    policeReportSummary: `Initial forensic scan confirms death occurred between 11:30 PM and midnight. No sign of forced entry on exterior doors, implying the killer was invited inside or possessed a key card.`,
    solution: {
      culpritId: 'suspect-1',
      culpritName: 'Evelyn Vance',
      weapon: pack.sampleWeapons[0],
      location: pack.sampleLocations[0],
      motive: 'Financial extortion & recovering a forged promissory note.',
      timeline: [
        { time: '11:15 PM', event: 'Culprit arrived at victim\'s room claiming to return a document.' },
        { time: '11:30 PM', event: 'Argument erupted regarding unpaid debts.' },
        { time: '11:42 PM', event: 'Culprit used weapon from mantelpiece during struggle.' },
        { time: '11:50 PM', event: 'Culprit slipped out through servant balcony passage.' }
      ],
      summaryExplanation: 'Evelyn Vance struck the victim during a heated argument over blackmailed debts. She planted the torn pocket watch on Marcus to frame him.'
    },
    suspects: [
      {
        id: 'suspect-1',
        name: 'Evelyn Vance',
        title: 'Business Associate & Art Dealer',
        age: 38,
        relationToVictim: 'Business Partner with disputed contracts',
        publicAlibi: 'Claims she was sipping scotch in the hotel lounge from 11:00 PM to midnight.',
        privateSecret: 'Directly threatened the victim two hours prior over blackmailed debt notes.',
        isCulprit: true,
        personality: 'Composed, elegant, calculates every word, hides intense anger under cold smiles.',
        speechPattern: 'Measured, precise, slightly aristocratic tone.',
        knowledgeScope: ['Disputed contracts', 'Victim\'s safe combination', 'Balcony escape route'],
        avatarStyle: 'emerald',
        tensionLevel: 35,
        suspicionScore: 0
      },
      {
        id: 'suspect-2',
        name: 'Marcus Sterling',
        title: 'Estranged Nephew',
        age: 26,
        relationToVictim: 'Disinherited heir',
        publicAlibi: 'Claims he was taking a walk along the docks in the rain.',
        privateSecret: 'Has heavy gambling debts and sneaked into the grounds around 11:30 PM.',
        isCulprit: false,
        personality: 'Nervous, quick to defend himself, easily rattled.',
        speechPattern: 'Rapid-fire, stutters under pressure, uses colloquialisms.',
        knowledgeScope: ['Saw Evelyn near the balcony staircase at 11:50 PM', 'Victim\'s financial troubles'],
        avatarStyle: 'crimson',
        tensionLevel: 60,
        suspicionScore: 0
      },
      {
        id: 'suspect-3',
        name: 'Dr. Clara Thorne',
        title: 'Personal Physician',
        age: 44,
        relationToVictim: 'Doctor & Longtime confidante',
        publicAlibi: 'Claims she was preparing medical charts in her office downstairs.',
        privateSecret: 'Discovered victim was planning to replace her on the medical board.',
        isCulprit: false,
        personality: 'Analytical, clinical, observant, speaks with medical certainty.',
        speechPattern: 'Detached, uses precise medical terminology, stoic.',
        knowledgeScope: ['Victim\'s toxicological baseline', 'Saw Marcus arguing near garden at 11:20 PM'],
        avatarStyle: 'sapphire',
        tensionLevel: 25,
        suspicionScore: 0
      },
      {
        id: 'suspect-4',
        name: 'Julian Mercer',
        title: 'Private Valet / Assistant',
        age: 52,
        relationToVictim: 'Head Butler & Confidential Secretary',
        publicAlibi: 'Claims he was checking security locks in the east wing.',
        privateSecret: 'Was taking bribes from rival buyers to leak victim\'s private journal.',
        isCulprit: false,
        personality: 'Deferential, soft-spoken, observant, secretive.',
        speechPattern: 'Formal, speaks in hushed tones, overly polite.',
        knowledgeScope: ['Keys to balcony passage', 'Heard glass shattering at 11:42 PM'],
        avatarStyle: 'amber',
        tensionLevel: 40,
        suspicionScore: 0
      }
    ],
    clues: [
      {
        id: 'clue-1',
        title: 'Shattered Monogrammed Cufflink',
        description: `Found under the desk near the body. Matches ${pack.sampleWeapons[0]} gold trim and bears Evelyn's initials.`,
        type: 'physical',
        locationFound: pack.sampleLocations[0],
        unlocksVia: 'Inspecting crime scene floor',
        pointsToSuspectIds: ['suspect-1'],
        isRedHerring: false,
        isDiscovered: true,
        detailedAnalysis: 'Gold filigree cufflink with a distinct custom engraving. Matches Evelyn Vance\'s designer suit set.'
      },
      {
        id: 'clue-2',
        title: 'Torn Muddy Pocket Watch',
        description: 'Broken at 11:35 PM. Found near the garden entrance. Matches Marcus Sterling\'s family heirloom.',
        type: 'physical',
        locationFound: pack.sampleLocations[1] || 'Garden Entrance',
        unlocksVia: 'Searching garden entrance',
        pointsToSuspectIds: ['suspect-2'],
        isRedHerring: true,
        isDiscovered: false,
        detailedAnalysis: 'Classic silver pocket watch. Placed intentionally in mud to draw suspicion away from the balcony passage.'
      },
      {
        id: 'clue-3',
        title: 'Lounge Waiter\'s Log',
        description: 'Shows Evelyn Vance ordered a drink at 11:00 PM but left her table empty between 11:20 PM and 11:55 PM.',
        type: 'testimonial',
        locationFound: 'Hotel Lounge',
        unlocksVia: 'Interrogating Lounge Waiter or checking bar receipt log',
        pointsToSuspectIds: ['suspect-1'],
        isRedHerring: false,
        isDiscovered: false,
        detailedAnalysis: 'Disproves Evelyn\'s alibi of being continuously present in the lounge during the time of death.'
      },
      {
        id: 'clue-4',
        title: 'Balcony Lock Scratch Marks',
        description: 'Fresh metal shavings on the balcony latch indicating a hasty escape from inside to outside.',
        type: 'physical',
        locationFound: pack.sampleLocations[0],
        unlocksVia: 'Examining balcony window frame',
        pointsToSuspectIds: ['suspect-1', 'suspect-4'],
        isRedHerring: false,
        isDiscovered: false,
        detailedAnalysis: 'Proves the room was exited via the balcony passage, explaining how the crime occurred in a locked room.'
      }
    ],
    locations: [
      {
        id: 'loc-1',
        name: pack.sampleLocations[0],
        description: 'The main crime scene. Rain batters the stained glass windows. Papers are scattered across the mahogany desk.',
        ambiance: 'Dim brass lamps flicker. Bloodstains near the fireplace hearth.',
        isSearched: true,
        clueIds: ['clue-1', 'clue-4']
      },
      {
        id: 'loc-2',
        name: pack.sampleLocations[1] || 'Garden Balcony & Corridor',
        description: 'A stone balcony overlooking rain-drenched courtyard hedges. Wet footprints trail along the stone railing.',
        ambiance: 'Cold wind whistles through iron gates.',
        isSearched: false,
        clueIds: ['clue-2']
      },
      {
        id: 'loc-3',
        name: 'Hotel Lounge & Speakeasy Bar',
        description: 'Plush velvet armchairs, jazz piano music playing faintly, smell of cigar smoke and gin.',
        ambiance: 'Bartender meticulously polishes crystal glasses.',
        isSearched: false,
        clueIds: ['clue-3']
      }
    ],
    redHerringExplanations: [
      'The muddy pocket watch belongs to Marcus, but he dropped it while sneaking through the garden at 11:20 PM before the murder happened.'
    ],
    dependencyGraphDescription: 'Cufflink (Physical) + Lounge Waiter Log (Testimonial contradiction) -> Evelyn Vance is the sole suspect without an alibi.'
  };

  rawCase.suspects = ensureSuspectPortraits(rawCase.suspects, theme);
  return rawCase;
}

// Helper to execute Gemini AI calls with retry and model fallback (e.g., if 503 high demand occurs)
async function generateGeminiContentWithRetryAndFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    preferredModel?: string;
  }
) {
  const modelsToTry = [
    params.preferredModel || 'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-2.5-flash'
  ];

  // Remove duplicates while preserving preferred ordering
  const uniqueModels = Array.from(new Set(modelsToTry));

  let lastError: any = null;

  for (const model of uniqueModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config
        });
        if (response && response.text) {
          return { response, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
        
        // Detect 503 high demand / service unavailable
        const is503OrUnavailable = 
          err?.status === 503 ||
          err?.code === 503 ||
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('temporarily unavailable');

        if (is503OrUnavailable) {
          console.info(`Model ${model} is experiencing high demand (503). Switching immediately to next fallback model...`);
          // Don't wait or repeat attempt on an overloaded model, immediately try next model
          break;
        } else {
          console.warn(`Gemini API call (model: ${model}, attempt: ${attempt}) note: ${errMsg}`);
          await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
        }
      }
    }
  }

  throw lastError || new Error('All Gemini model fallbacks exhausted.');
}

// Safely parse JSON returned from Gemini AI, handling markdown code blocks
function safeParseJson(text: string) {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const jsonSub = cleaned.slice(firstBrace, lastBrace + 1);
      return JSON.parse(jsonSub);
    }
    throw e;
  }
}

// 1. API: Generate Case
app.post('/api/case/generate', async (req, res) => {
  try {
    const { theme = 'noir_1940s', difficulty = 'detective', modifier = 'none', isDaily = false } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      console.log('No Gemini API key detected. Serving procedural fallback case.');
      const fallbackCase = generateFallbackCase(theme as CasePackTheme, difficulty as CaseDifficulty, modifier as CaseModifier, isDaily);
      return res.json({ success: true, caseFile: fallbackCase, generatedBy: 'procedural-engine' });
    }

    const pack = CASE_PACKS[theme as CasePackTheme] || CASE_PACKS.noir_1940s;

    const prompt = `
You are the Game Master for a fair-play murder mystery game titled "Case File: AI Detective Mystery".
Theme: ${pack.title} (${pack.era})
Description: ${pack.description}
Difficulty: ${difficulty} (rookie = 3 suspects, 3 clues; detective = 4 suspects, 4-5 clues; master = 5 suspects, 6-7 clues, tricky red herrings)
Modifier: ${modifier}

Generate a complete, fair-play mystery case file where the player can solve the case purely through logic and evidence.
IMPORTANT FAIR-PLAY RULES:
1. The culprit MUST be one of the suspects.
2. The culprit MUST have a clear timeline flaw, physical evidence, or testimonial contradiction.
3. At least 1 red herring clue MUST point to an innocent suspect, but be logically disprovable by another clue or alibi check.
4. Each suspect MUST have a distinct personality, speech pattern, public alibi, and private secret.

Return the response in valid JSON matching this schema:
{
  "title": "Case Title",
  "victim": {
    "name": "Victim Full Name",
    "occupation": "Occupation",
    "timeOfDeath": "Time e.g. 11:30 PM",
    "causeOfDeath": "Cause of death",
    "locationFound": "Location name",
    "briefBio": "2 sentence background"
  },
  "incidentOverview": "Detailed 3 sentence summary of the crime discovery.",
  "policeReportSummary": "Forensic & initial police log notes.",
  "solution": {
    "culpritId": "suspect-1",
    "culpritName": "Culprit Name",
    "weapon": "Specific Murder Weapon",
    "location": "Location where crime occurred",
    "motive": "Clear compelling motive",
    "timeline": [
      {"time": "11:00 PM", "event": "Event summary"}
    ],
    "summaryExplanation": "How the crime was executed and how evidence proves it."
  },
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Full Name",
      "title": "Title/Role",
      "age": 35,
      "relationToVictim": "Relationship",
      "publicAlibi": "Their claimed alibi",
      "privateSecret": "Their secret or hidden motive",
      "isCulprit": true,
      "personality": "Personality description",
      "speechPattern": "Speech style",
      "knowledgeScope": ["Key fact 1", "Key fact 2"],
      "avatarStyle": "emerald",
      "tensionLevel": 30
    }
  ],
  "clues": [
    {
      "id": "clue-1",
      "title": "Clue Title",
      "description": "Clue physical/testimonial description",
      "type": "physical",
      "locationFound": "Location Name",
      "unlocksVia": "How to find it",
      "pointsToSuspectIds": ["suspect-1"],
      "isRedHerring": false,
      "isDiscovered": true,
      "detailedAnalysis": "Analytical detail"
    }
  ],
  "locations": [
    {
      "id": "loc-1",
      "name": "Location Name",
      "description": "Atmospheric description",
      "ambiance": "Sensory details",
      "isSearched": true,
      "clueIds": ["clue-1"]
    }
  ],
  "redHerringExplanations": ["Why the red herring is misleading"],
  "dependencyGraphDescription": "Clue dependency sequence"
}
`;

    try {
      const { response, modelUsed } = await generateGeminiContentWithRetryAndFallback(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.9
        }
      });

      const parsedCase = safeParseJson(response.text || '');
      if (parsedCase && parsedCase.title && parsedCase.suspects) {
        const caseId = `case-${theme}-${Date.now().toString(36)}`;
        const fullCaseFile: CaseFile = {
          caseId,
          theme: theme as CasePackTheme,
          difficulty: difficulty as CaseDifficulty,
          modifier: modifier as CaseModifier,
          dateGenerated: new Date().toISOString().slice(0, 10),
          isDailyCase: isDaily,
          dailySeed: isDaily ? `daily-${new Date().toISOString().slice(0, 10)}` : undefined,
          ...parsedCase
        };

        if (fullCaseFile.clues && fullCaseFile.clues.length > 0) {
          fullCaseFile.clues[0].isDiscovered = true;
        }

        if (fullCaseFile.suspects) {
          fullCaseFile.suspects = ensureSuspectPortraits(fullCaseFile.suspects, theme as CasePackTheme);
        }

        return res.json({ success: true, caseFile: fullCaseFile, generatedBy: modelUsed });
      }
    } catch (genError: any) {
      console.warn('Gemini generation unavailable or invalid JSON, using procedural fallback:', genError?.message || genError);
    }

    const fallbackCase = generateFallbackCase(theme as CasePackTheme, difficulty as CaseDifficulty, modifier as CaseModifier, isDaily);
    return res.json({ success: true, caseFile: fallbackCase, generatedBy: 'procedural-fallback' });
  } catch (err: any) {
    console.warn('Case generation handler warning:', err?.message || err);
    const fallbackCase = generateFallbackCase(
      req.body.theme || 'noir_1940s', 
      req.body.difficulty || 'detective', 
      req.body.modifier || 'none',
      req.body.isDaily || false
    );
    return res.json({ success: true, caseFile: fallbackCase, generatedBy: 'procedural-fallback' });
  }
});

// 2. API: Interrogate Suspect
app.post('/api/interrogate', async (req, res) => {
  try {
    const { caseFile, suspectId, playerMessage, chatHistory = [], technique = 'standard', presentedClueId } = req.body;

    if (!caseFile || !suspectId || !playerMessage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const suspect: Suspect = caseFile.suspects?.find((s: Suspect) => s.id === suspectId);
    if (!suspect) {
      return res.status(404).json({ error: 'Suspect not found' });
    }

    let presentedClueText = '';
    if (presentedClueId) {
      const clue: Clue = caseFile.clues?.find((c: Clue) => c.id === presentedClueId);
      if (clue) {
        presentedClueText = `The detective is presenting physical evidence: "${clue.title} - ${clue.description}".`;
      }
    }

    const ai = getGenAIClient();

    if (ai) {
      try {
        const systemInstruction = `
You are roleplaying as a suspect in a noir detective murder mystery game.
SUSPECT PROFILE:
Name: ${suspect.name} (${suspect.title}, Age ${suspect.age})
Relationship to victim: ${suspect.relationToVictim}
Public Alibi: ${suspect.publicAlibi}
Private Secret: ${suspect.privateSecret}
Personality: ${suspect.personality}
Speech Pattern: ${suspect.speechPattern}
Is Culprit?: ${suspect.isCulprit ? 'YES (You are guilty. You are trying to evade conviction without panicking prematurely unless presented with irrefutable proof).' : 'NO (You are innocent of murder, though you may have a private secret you are reluctant to share).' }
Knowledge Scope: ${JSON.stringify(suspect.knowledgeScope)}

INTERROGATION TECHNIQUE USED BY DETECTIVE: ${technique.toUpperCase()}
- "standard": Normal questioning.
- "pressure": High-intensity interrogation pressing on flaws.
- "sympathize": Empathetic questioning encouraging confidences.

STRICT ANTI-SPOILING GUARDRAILS:
1. Stay strictly in-character as ${suspect.name}.
2. NEVER break character to speak as an AI or Game Master.
3. NEVER state the culprit's name outright if you are innocent, unless you personally witnessed them at the crime scene.
4. If you are guilty, DO NOT confess simply because asked. Only show cracks or slip-ups if presented with contradicting physical evidence or heavy pressure.
5. Keep your response spoken dialogue under 4 sentences. Speak directly to the Detective.
`;

        const formattedHistory = chatHistory.slice(-6).map((m: InterrogationMessage) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
        const prompt = `
Recent Conversation:
${formattedHistory}

Detective says (${technique} mode): "${playerMessage}"
${presentedClueText}

Respond as ${suspect.name} in 2-4 sentences:
`;

        const { response, modelUsed } = await generateGeminiContentWithRetryAndFallback(ai, {
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.8
          }
        });

        let replyText = response.text || `"${playerMessage}? I have nothing further to add, Detective."`;

        // Anti-Spoiling & Prompt-Injection Defense Filter Pass
        const isInjectionAttempt = playerMessage.toLowerCase().includes('ignore previous') ||
          playerMessage.toLowerCase().includes('system instruction') ||
          playerMessage.toLowerCase().includes('json') ||
          playerMessage.toLowerCase().includes('who is the killer') ||
          playerMessage.toLowerCase().includes('tell me the culprit');

        if (replyText.includes('{') && replyText.includes('}') && replyText.includes('culprit')) {
          replyText = `"Detective, I don't know what strange jargon you're babbling about. Ask me a real question regarding the crime."`;
        } else if (replyText.toLowerCase().includes('as an ai') || replyText.toLowerCase().includes('language model')) {
          replyText = `"Are you feeling alright, Detective? I am standing right here in front of you."`;
        } else if (isInjectionAttempt && !suspect.isCulprit) {
          replyText = `"You're trying to trick me into accusing someone without evidence. I only speak to what I witnessed."`;
        }

        return res.json({
          success: true,
          suspectId,
          message: replyText.trim(),
          tensionChange: technique === 'pressure' ? 12 : technique === 'sympathize' ? -8 : 3,
          generatedBy: modelUsed
        });
      } catch (aiErr: any) {
        console.warn('Gemini interrogation dialogue fallback active:', aiErr?.message || aiErr);
      }
    }

    let responseText = `"${playerMessage}? I've told you everything I know, Detective."`;
    if (presentedClueId) {
      if (suspect.isCulprit) {
        responseText = `(Stiffens noticeably) "Where... where did you get that? That proves nothing! I left that behind hours earlier!"`;
      } else {
        responseText = `"That's an interesting find, but it has nothing to do with me. Check the other suspects."`;
      }
    } else if (technique === 'pressure') {
      responseText = suspect.isCulprit 
        ? `"Don't raise your voice with me, Detective! I know my rights. Ask your questions politely."`
        : `"Look, I'm stressed too! But backing me into a corner won't make me guilty."`;
    } else if (technique === 'sympathize') {
      responseText = `"I appreciate your understanding, Detective. It's been a nightmare ever since the incident happened."`;
    }

    return res.json({
      success: true,
      suspectId,
      message: responseText,
      tensionChange: suspect.isCulprit ? 10 : -5,
      generatedBy: 'procedural-dialogue'
    });
  } catch (err: any) {
    console.warn('Interrogation Error:', err?.message || err);
    return res.json({
      success: true,
      suspectId: req.body.suspectId,
      message: `"Detective, I think we've talked enough for one session."`,
      tensionChange: 0
    });
  }
});

// 3. API: Investigate Location
app.post('/api/investigate-location', async (req, res) => {
  try {
    const { caseFile, locationId } = req.body;
    const location = caseFile?.locations?.find((l: any) => l.id === locationId);

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const unlockedClueIds: string[] = location.clueIds || [];
    let detailNarrative = `You thoroughly search ${location.name}. ${location.description} ${location.ambiance}`;

    const ai = getGenAIClient();
    if (ai) {
      try {
        const prompt = `
Write a short 3-sentence immersive noir detective narration describing the search of location "${location.name}" in a case titled "${caseFile.title}".
Sensory elements: ${location.ambiance}
Newly uncovered evidence clues: ${unlockedClueIds.join(', ')}
Keep it atmospheric, concise, and focused on forensic detail.
`;
        const { response } = await generateGeminiContentWithRetryAndFallback(ai, {
          contents: prompt
        });
        if (response.text) detailNarrative = response.text;
      } catch (e: any) {
        console.warn('Location investigation AI narration fallback:', e?.message || e);
      }
    }

    return res.json({
      success: true,
      locationId,
      unlockedClueIds,
      narration: detailNarrative
    });
  } catch (err: any) {
    console.warn('Investigate Location Error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to search location' });
  }
});

// 3.5. API: Consult Detective Partner (Nudge/Hint System)
app.post('/api/consult-partner', async (req, res) => {
  try {
    const { caseFile, discoveredClues = [], searchedLocations = [] } = req.body;
    if (!caseFile) {
      return res.status(400).json({ error: 'Missing caseFile' });
    }

    const ai = getGenAIClient();
    let hintText = "Partner Vance whispers: 'Look closely at the timeline contradictions. Compare claimed public alibis with physical evidence found at the crime scene.'";

    if (ai) {
      try {
        const prompt = `
You are Detective Vance, an experienced senior partner guiding a rookie detective in a murder mystery game titled "${caseFile.title}".
HIDDEN CASE SOLUTION (DO NOT SPOIL DIRECTLY):
- Culprit: ${caseFile.solution?.culpritName}
- Weapon: ${caseFile.solution?.weapon}
- Timeline flaw: ${caseFile.solution?.timeline?.[0]?.event || 'Timeline mismatch'}

CURRENT PLAYER PROGRESS:
- Discovered Clues: ${JSON.stringify(discoveredClues)}
- Searched Locations: ${JSON.stringify(searchedLocations)}

Give a subtle, atmospheric 2-sentence nudge or hint that steers the player in the right direction WITHOUT giving away the culprit's name or solving the case directly.
Example: "Check the hotel lounge receipts again—someone's alibi has a 30-minute gap."
`;

        const { response } = await generateGeminiContentWithRetryAndFallback(ai, {
          contents: prompt
        });

        if (response.text) {
          hintText = response.text.trim();
        }
      } catch (e: any) {
        console.warn('Consult partner AI fallback:', e?.message || e);
      }
    }

    return res.json({ success: true, partnerNudge: hintText });
  } catch (err: any) {
    console.warn('Consult Partner Error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to generate partner consultation' });
  }
});

// 4. API: Accuse & Adjudicate
app.post('/api/accuse', async (req, res) => {
  try {
    const { caseFile, accusation }: { caseFile: CaseFile; accusation: AccusationInput } = req.body;

    if (!caseFile || !accusation) {
      return res.status(400).json({ error: 'Missing caseFile or accusation' });
    }

    const { culpritId, weapon, motive, citedClueIds, playerReasoning } = accusation;
    const solution = caseFile.solution;

    const isCulpritCorrect = culpritId === solution.culpritId;
    const isWeaponCorrect = weapon.toLowerCase().includes(solution.weapon.toLowerCase()) || solution.weapon.toLowerCase().includes(weapon.toLowerCase());
    const isMotiveCorrect = motive.length > 5;

    let baseScore = 0;
    if (isCulpritCorrect) baseScore += 50;
    if (isWeaponCorrect) baseScore += 20;
    if (isMotiveCorrect) baseScore += 15;

    const validCluesCited = (citedClueIds || []).filter(id => caseFile.clues?.some(c => c.id === id && !c.isRedHerring));
    const reasoningScore = Math.min(100, Math.round(baseScore + (validCluesCited.length * 5)));

    let grade: 'S' | 'A' | 'B' | 'C' | 'F' = 'F';
    if (reasoningScore >= 90) grade = 'S';
    else if (reasoningScore >= 75) grade = 'A';
    else if (reasoningScore >= 60) grade = 'B';
    else if (reasoningScore >= 40) grade = 'C';

    let revealNarrative = isCulpritCorrect
      ? `CASE SOLVED! Your indictment held water. ${solution.culpritName} crumbled when confronted with your evidence. ${solution.summaryExplanation}`
      : `MISDIRECTION! Your accusation was flawed. The real killer was ${solution.culpritName}, who used ${solution.weapon}. ${solution.summaryExplanation}`;

    const ai = getGenAIClient();
    if (ai) {
      try {
        const prompt = `
You are the Game Master adjudicating the final indictment in a murder mystery game.
CASE TITLE: ${caseFile.title}
TRUE SOLUTION:
- Culprit: ${solution.culpritName}
- Weapon: ${solution.weapon}
- Motive: ${solution.motive}
- Summary: ${solution.summaryExplanation}

PLAYER'S ACCUSATION:
- Accused Culprit ID: ${culpritId} (Correct? ${isCulpritCorrect})
- Accused Weapon: ${weapon} (Correct? ${isWeaponCorrect})
- Player Motive Statement: "${motive}"
- Player Reasoning Statement: "${playerReasoning}"

Write a dramatic, atmospheric 2-paragraph noir ending narrative.
Paragraph 1: Describe the dramatic courtroom or chief's office confrontation when the indictment is read.
Paragraph 2: The grand reveal explaining the truth, whether the player was right or wrong, ensuring the failure or success feels fair and clued.
`;

        const { response } = await generateGeminiContentWithRetryAndFallback(ai, {
          contents: prompt
        });

        if (response.text) {
          revealNarrative = response.text;
        }
      } catch (e: any) {
        console.warn('Gemini Adjudication Narrative Warning:', e?.message || e);
      }
    }

    const xpEarned = Math.round(reasoningScore * 2.5);

    const result: AccusationResult = {
      isCulpritCorrect,
      isWeaponCorrect,
      isMotiveCorrect,
      reasoningScore,
      overallAccuracy: reasoningScore,
      grade,
      revealNarrative,
      breakdown: {
        trueCulpritName: solution.culpritName,
        trueWeapon: solution.weapon,
        trueMotive: solution.motive,
        keyEvidenceMissed: (caseFile.clues || []).filter(c => !c.isDiscovered && !c.isRedHerring).map(c => c.title),
        redHerringsAvoided: (caseFile.clues || []).filter(c => c.isRedHerring && !(citedClueIds || []).includes(c.id)).map(c => c.title)
      },
      xpEarned
    };

    return res.json({ success: true, result });
  } catch (err: any) {
    console.warn('Accusation Error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to adjudicate accusation' });
  }
});

// 5. API: Daily Seed
app.get('/api/daily-seed', (req, res) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  return res.json({
    seed: `daily-${todayStr}`,
    date: todayStr,
    featuredTheme: 'noir_1940s',
    featuredModifier: 'unreliable_witness'
  });
});

// Vite Middleware for Development / Static serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🕵️ Case File: AI Detective Mystery running on http://localhost:${PORT}`);
  });
}

startServer();
