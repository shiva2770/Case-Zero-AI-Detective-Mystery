export type CaseDifficulty = 'rookie' | 'detective' | 'master';

export type CasePackTheme = 
  | 'noir_1940s' 
  | 'cyberpunk_2099' 
  | 'locked_room_manor' 
  | 'cozy_coastal_village' 
  | 'steampunk_express';

export type CaseModifier = 
  | 'none'
  | 'unreliable_witness' 
  | 'time_pressure' 
  | 'no_fingerprints' 
  | 'rival_detective' 
  | 'blackout_storm';

export interface Solution {
  culpritId: string;
  culpritName: string;
  weapon: string;
  location: string;
  motive: string;
  timeline: { time: string; event: string }[];
  summaryExplanation: string;
}

export interface Suspect {
  id: string;
  name: string;
  title: string;
  age: number;
  relationToVictim: string;
  publicAlibi: string;
  privateSecret: string;
  isCulprit: boolean;
  personality: string;
  speechPattern: string;
  knowledgeScope: string[];
  avatarStyle: string; // Theme-appropriate color/icon/SVG style
  imageUrl?: string; // AI generated or procedurally assigned noir portrait URL
  imagePrompt?: string; // The AI prompt used to generate this portrait
  tensionLevel: number; // 0 to 100
  suspicionScore: number; // calculated or player-assigned
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  type: 'physical' | 'testimonial' | 'contradiction' | 'documentary';
  locationFound: string;
  unlocksVia: string; // e.g. "Investigated Desk", "Interrogated Suspect X"
  pointsToSuspectIds: string[];
  isRedHerring: boolean;
  isDiscovered: boolean;
  detailedAnalysis?: string;
}

export interface InvestigationLocation {
  id: string;
  name: string;
  description: string;
  ambiance: string;
  isSearched: boolean;
  clueIds: string[];
}

export interface CaseFile {
  caseId: string;
  title: string;
  theme: CasePackTheme;
  difficulty: CaseDifficulty;
  modifier: CaseModifier;
  dateGenerated: string;
  isDailyCase?: boolean;
  dailySeed?: string;

  victim: {
    name: string;
    occupation: string;
    timeOfDeath: string;
    causeOfDeath: string;
    locationFound: string;
    briefBio: string;
  };

  incidentOverview: string;
  policeReportSummary: string;

  solution: Solution; // Hidden on client except after accusation
  suspects: Suspect[];
  clues: Clue[];
  locations: InvestigationLocation[];

  redHerringExplanations: string[];
  dependencyGraphDescription: string;
  journalEntries?: JournalEntry[];
}

export interface JournalEntry {
  id: string;
  caseId: string;
  timestamp: string;
  type: 'briefing' | 'discovery' | 'interrogation' | 'location' | 'deduction' | 'note';
  title: string;
  description: string;
  categoryTag?: string;
  refId?: string;
  isCustomNote?: boolean;
  starred?: boolean;
}

export type InterrogationTechnique = 'standard' | 'pressure' | 'sympathize';

export interface InterrogationMessage {
  id: string;
  sender: 'player' | 'suspect' | 'system';
  suspectId?: string;
  text: string;
  timestamp: string;
  techniqueUsed?: InterrogationTechnique;
  presentedClueId?: string;
  tensionChange?: number;
}

export interface CorkNode {
  id: string;
  type: 'suspect' | 'clue' | 'location' | 'weapon' | 'motive' | 'note';
  title: string;
  subtitle?: string;
  x: number;
  y: number;
  color?: string;
  isCustomNote?: boolean;
  customText?: string;
  refId?: string; // ID of underlying clue or suspect
}

export interface CorkConnection {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
  color?: string;
}

export interface AccusationInput {
  culpritId: string;
  weapon: string;
  motive: string;
  citedClueIds: string[];
  playerReasoning: string;
}

export interface AccusationResult {
  isCulpritCorrect: boolean;
  isWeaponCorrect: boolean;
  isMotiveCorrect: boolean;
  reasoningScore: number; // 0 to 100
  overallAccuracy: number; // 0 to 100
  grade: 'S' | 'A' | 'B' | 'C' | 'F';
  revealNarrative: string;
  breakdown: {
    trueCulpritName: string;
    trueWeapon: string;
    trueMotive: string;
    keyEvidenceMissed: string[];
    redHerringsAvoided: string[];
  };
  xpEarned: number;
}

export interface DetectiveProfile {
  name: string;
  badgeNumber: string;
  rankTitle: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  casesSolved: number;
  casesAttempted: number;
  perfectDeductions: number;
  dailyStreak: number;
  lastStreakDate?: string;
  unlockedTechniques: InterrogationTechnique[];
  caseHistory: {
    caseId: string;
    title: string;
    date: string;
    theme: CasePackTheme;
    grade: string;
    accuracy: number;
  }[];
}
