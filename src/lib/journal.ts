import { CaseFile, JournalEntry } from '../types';

export function formatJournalTime(date: Date = new Date()): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function createInitialJournalEntries(caseFile: CaseFile): JournalEntry[] {
  const now = formatJournalTime();
  const entries: JournalEntry[] = [
    {
      id: `entry-init-1-${Date.now()}`,
      caseId: caseFile.caseId,
      timestamp: now,
      type: 'briefing',
      title: `Case File Assigned: ${caseFile.title}`,
      description: `Official assignment received. Setting: ${caseFile.theme}. Difficulty: ${caseFile.difficulty.toUpperCase()}.`,
      categoryTag: 'CASE OPENED',
      starred: true
    },
    {
      id: `entry-init-2-${Date.now() + 1}`,
      caseId: caseFile.caseId,
      timestamp: now,
      type: 'briefing',
      title: `Victim Profile: ${caseFile.victim.name}`,
      description: `${caseFile.victim.occupation}. Cause of death: ${caseFile.victim.causeOfDeath} at ${caseFile.victim.locationFound}. Time of death estimated around ${caseFile.victim.timeOfDeath}.`,
      categoryTag: 'VICTIM DOSSIER',
      starred: false
    }
  ];

  // If initial clues exist, log them
  const initialClue = caseFile.clues?.find((c) => c.isDiscovered);
  if (initialClue) {
    entries.push({
      id: `entry-init-3-${Date.now() + 2}`,
      caseId: caseFile.caseId,
      timestamp: now,
      type: 'discovery',
      title: `Initial Evidence: ${initialClue.title}`,
      description: initialClue.description,
      categoryTag: 'INITIAL CLUE',
      refId: initialClue.id,
      starred: true
    });
  }

  return entries;
}

export function appendJournalEntry(
  caseFile: CaseFile,
  entryData: {
    type: 'briefing' | 'discovery' | 'interrogation' | 'location' | 'deduction' | 'note';
    title: string;
    description: string;
    categoryTag?: string;
    refId?: string;
    isCustomNote?: boolean;
  }
): CaseFile {
  const existingEntries = caseFile.journalEntries && caseFile.journalEntries.length > 0
    ? caseFile.journalEntries
    : createInitialJournalEntries(caseFile);

  // Prevent exact duplicate log if triggered repeatedly
  const isDuplicate = existingEntries.some(
    (e) => e.title === entryData.title && e.description === entryData.description
  );
  if (isDuplicate) {
    return caseFile;
  }

  const newEntry: JournalEntry = {
    id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    caseId: caseFile.caseId,
    timestamp: formatJournalTime(),
    ...entryData
  };

  return {
    ...caseFile,
    journalEntries: [newEntry, ...existingEntries]
  };
}

export function toggleStarJournalEntry(caseFile: CaseFile, entryId: string): CaseFile {
  if (!caseFile.journalEntries) return caseFile;
  return {
    ...caseFile,
    journalEntries: caseFile.journalEntries.map((e) =>
      e.id === entryId ? { ...e, starred: !e.starred } : e
    )
  };
}

export function deleteJournalEntry(caseFile: CaseFile, entryId: string): CaseFile {
  if (!caseFile.journalEntries) return caseFile;
  return {
    ...caseFile,
    journalEntries: caseFile.journalEntries.filter((e) => e.id !== entryId)
  };
}
