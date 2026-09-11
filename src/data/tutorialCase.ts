import { CaseFile } from '../types';
import { ensureSuspectPortraits } from '../lib/portraitGenerator';

export const HAND_AUTHORED_TUTORIAL_CASE: CaseFile = {
  caseId: 'tutorial-case-zero',
  title: 'Tutorial: The Silver Pocketwatch Mystery',
  theme: 'noir_1940s',
  difficulty: 'rookie',
  modifier: 'none',
  dateGenerated: '1947-10-14',
  isDailyCase: false,
  victim: {
    name: 'Sir Arthur Pendelton',
    occupation: 'Antiques Collector & Investor',
    timeOfDeath: '10:30 PM',
    causeOfDeath: 'Blunt force trauma with a brass candlestick',
    locationFound: 'Private Study, Pendelton Manor',
    briefBio: 'Sir Arthur was a wealthy collector known for his rare artifacts and strict business habits. He was found deceased in his study beside an open safe.'
  },
  incidentOverview: 'At 10:30 PM, housekeeper Martha heard a heavy thud in the study. She rushed inside to find Sir Arthur lying near his study desk. The window was unlatched and a rare silver pocketwatch was missing from the desk.',
  policeReportSummary: 'Death occurred between 10:15 PM and 10:45 PM. No signs of forced entry at the front door. The rear garden window latch was forced from the inside.',
  solution: {
    culpritId: 'suspect-1',
    culpritName: 'Julian Vance',
    weapon: 'Heavy Brass Candlestick',
    location: 'Private Study, Pendelton Manor',
    motive: 'Stealing forged debt ledgers before they could be turned over to police.',
    timeline: [
      { time: '10:15 PM', event: 'Julian entered the study claiming to deliver evening tea.' },
      { time: '10:28 PM', event: 'Argument erupted over stolen funds.' },
      { time: '10:30 PM', event: 'Julian struck Sir Arthur with the candlestick.' },
      { time: '10:35 PM', event: 'Julian forced the garden window latch from inside to simulate a break-in.' }
    ],
    summaryExplanation: 'Julian Vance struck Sir Arthur with the study candlestick during a confrontation over debt records, then unlatched the window to fake an outside burglary.'
  },
  suspects: ensureSuspectPortraits([
    {
      id: 'suspect-1',
      name: 'Julian Vance',
      title: 'Private Secretary',
      age: 34,
      relationToVictim: 'Personal Secretary for 5 years',
      publicAlibi: 'Claims he was cataloging books in the library from 10:00 PM to 11:00 PM.',
      privateSecret: 'Was embezzling funds and Sir Arthur discovered the discrepancy that morning.',
      isCulprit: true,
      personality: 'Overly polite, nervous eye twitch when pressed, meticulously neat.',
      speechPattern: 'Formal, defensive, stammers slightly when questioned about timelines.',
      knowledgeScope: ['Discovered embezzlement ledger', 'Library cataloging log', 'Study door keys'],
      avatarStyle: 'emerald',
      tensionLevel: 45,
      suspicionScore: 0
    },
    {
      id: 'suspect-2',
      name: 'Clara Sterling',
      title: 'Visiting Heiress',
      age: 28,
      relationToVictim: 'Niece & Beneficiary',
      publicAlibi: 'Claims she was writing letters in the parlor.',
      privateSecret: 'Came to ask for an advance on her inheritance.',
      isCulprit: false,
      personality: 'Outspoken, blunt, confident, speaks her mind.',
      speechPattern: 'Direct, sharp-witted, unbothered by detective authority.',
      knowledgeScope: ['Saw Julian carrying a brass tray toward the study at 10:20 PM', 'Victim\'s safe key location'],
      avatarStyle: 'crimson',
      tensionLevel: 20,
      suspicionScore: 0
    },
    {
      id: 'suspect-3',
      name: 'Inspector Thomas Haze',
      title: 'Off-Duty Constable',
      age: 48,
      relationToVictim: 'Family Friend & Security Advisor',
      publicAlibi: 'Claims he was inspecting the perimeter fence in the rain.',
      privateSecret: 'Owed money to local loan sharks.',
      isCulprit: false,
      personality: 'Gruff, stern, disciplined, cynical detective tone.',
      speechPattern: 'Short sentences, cop jargon, authoritative.',
      knowledgeScope: ['Garden footprints match size 10 boots', 'Window latch forced from interior'],
      avatarStyle: 'sapphire',
      tensionLevel: 30,
      suspicionScore: 0
    }
  ], 'noir_1940s'),
  clues: [
    {
      id: 'clue-1',
      title: 'Blood-Stained Brass Candlestick',
      description: 'Found under the leather study sofa. Traces of blood and hair on the base match the victim.',
      type: 'physical',
      locationFound: 'Private Study, Pendelton Manor',
      unlocksVia: 'Inspecting study desk and mantelpiece',
      pointsToSuspectIds: ['suspect-1'],
      isRedHerring: false,
      isDiscovered: true,
      detailedAnalysis: 'The murder weapon. Wiped hastily with silk cloth bearing Julian\'s cologne.'
    },
    {
      id: 'clue-2',
      title: 'Forced Interior Window Latch',
      description: 'The latch metal shavings fell INSIDE the windowsill, proving the window was opened from inside the room.',
      type: 'physical',
      locationFound: 'Private Study, Pendelton Manor',
      unlocksVia: 'Examining study window frame',
      pointsToSuspectIds: ['suspect-1'],
      isRedHerring: false,
      isDiscovered: false,
      detailedAnalysis: 'Disproves the outside intruder theory. The killer was inside the study when Sir Arthur died.'
    },
    {
      id: 'clue-3',
      title: 'Library Sign-In Sheet Discrepancy',
      description: 'Julian\'s library sign-in entry at 10:15 PM is written in wet ink over dry dust, indicating it was backdated.',
      type: 'testimonial',
      locationFound: 'Manor Library',
      unlocksVia: 'Searching Manor Library desk',
      pointsToSuspectIds: ['suspect-1'],
      isRedHerring: false,
      isDiscovered: false,
      detailedAnalysis: 'Disproves Julian Vance\'s public alibi of cataloging books during the time of death.'
    },
    {
      id: 'clue-4',
      title: 'Dropped Silver Monogrammed Glove',
      description: 'Found outside in the mud near the garden gate. Bears the initials C.S.',
      type: 'physical',
      locationFound: 'Garden Gate Path',
      unlocksVia: 'Searching Garden Gate',
      pointsToSuspectIds: ['suspect-2'],
      isRedHerring: true,
      isDiscovered: false,
      detailedAnalysis: 'Belongs to Clara Sterling, but she dropped it at 9:00 PM while taking tea in the garden before the murder.'
    }
  ],
  locations: [
    {
      id: 'loc-1',
      name: 'Private Study, Pendelton Manor',
      description: 'The crime scene. Rain batters the window panes. A tipped velvet chair sits near the heavy oak desk.',
      ambiance: 'Faint smell of pipe tobacco and damp rain.',
      isSearched: true,
      clueIds: ['clue-1', 'clue-2']
    },
    {
      id: 'loc-2',
      name: 'Manor Library & Reading Room',
      description: 'Towering mahogany bookshelves lining dusty leather seats and a tall grandfather clock ticking quietly.',
      ambiance: 'Quiet ticking of the clock echoes in the dimly lit room.',
      isSearched: false,
      clueIds: ['clue-3']
    },
    {
      id: 'loc-3',
      name: 'Garden Gate Path',
      description: 'A muddy cobblestone path winding past drenched rose bushes toward the outer manor iron gate.',
      ambiance: 'Heavy rain puddle ripples under flickering street lamps.',
      isSearched: false,
      clueIds: ['clue-4']
    }
  ],
  redHerringExplanations: [
    'The silver glove belongs to Clara Sterling, but she lost it during a walk at 9:00 PM, over an hour before the murder.'
  ],
  dependencyGraphDescription: 'Brass Candlestick + Interior Window Latch + Library Log Discrepancy -> Proves Julian Vance fabricated his alibi and committed the crime.'
};
