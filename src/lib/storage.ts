import { DetectiveProfile, CaseFile } from '../types';

const STORAGE_KEY = 'case_file_detective_profile_v1';
const ACTIVE_CASE_KEY = 'case_file_active_case_v1';

export const INITIAL_PROFILE: DetectiveProfile = {
  name: 'Detective Cooper',
  badgeNumber: '#4092-B',
  rankTitle: 'Rookie Gumshoe',
  level: 1,
  xp: 0,
  nextLevelXp: 200,
  casesSolved: 0,
  casesAttempted: 0,
  perfectDeductions: 0,
  dailyStreak: 1,
  lastStreakDate: new Date().toISOString().slice(0, 10),
  unlockedTechniques: ['standard'],
  caseHistory: []
};

export const RANKS = [
  { minLevel: 1, title: 'Rookie Gumshoe' },
  { minLevel: 2, title: 'Beat Investigator' },
  { minLevel: 3, title: 'Senior Sleuth' },
  { minLevel: 4, title: 'Master Detective' },
  { minLevel: 5, title: 'Bureau Chief Inspector' }
];

export function checkAndUpdateStreak(profile: DetectiveProfile): DetectiveProfile {
  const today = new Date().toISOString().slice(0, 10);
  if (!profile.lastStreakDate) {
    return {
      ...profile,
      dailyStreak: profile.dailyStreak || 1,
      lastStreakDate: today
    };
  }

  const lastDate = new Date(profile.lastStreakDate);
  const currentDate = new Date(today);
  const diffTime = currentDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

  if (diffDays > 1) {
    const updated = {
      ...profile,
      dailyStreak: 0
    };
    saveProfile(updated);
    return updated;
  }
  return profile;
}

export function recordDailyStreakActivity(profile: DetectiveProfile): DetectiveProfile {
  const today = new Date().toISOString().slice(0, 10);
  if (profile.lastStreakDate === today && profile.dailyStreak > 0) {
    return profile;
  }

  const lastDate = profile.lastStreakDate ? new Date(profile.lastStreakDate) : null;
  const currentDate = new Date(today);
  let newStreak = 1;

  if (lastDate) {
    const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      newStreak = (profile.dailyStreak || 0) + 1;
    } else if (diffDays === 0) {
      newStreak = Math.max(1, profile.dailyStreak || 1);
    }
  }

  const updated: DetectiveProfile = {
    ...profile,
    dailyStreak: newStreak,
    lastStreakDate: today
  };
  saveProfile(updated);
  return updated;
}

export function getProfile(): DetectiveProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const withDefaults: DetectiveProfile = {
        ...INITIAL_PROFILE,
        ...parsed,
        dailyStreak: parsed.dailyStreak !== undefined ? parsed.dailyStreak : 1,
      };
      return checkAndUpdateStreak(withDefaults);
    }
  } catch (e) {
    console.error('Failed to load detective profile from localStorage', e);
  }
  return INITIAL_PROFILE;
}

export function saveProfile(profile: DetectiveProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save detective profile to localStorage', e);
  }
}

export function addXpToProfile(profile: DetectiveProfile, xpGained: number, isSolved: boolean, isPerfect: boolean, caseItem: { caseId: string; title: string; theme: any; grade: string; accuracy: number }): DetectiveProfile {
  let newXp = profile.xp + xpGained;
  let newLevel = profile.level;
  let nextXp = profile.nextLevelXp;

  while (newXp >= nextXp) {
    newLevel += 1;
    nextXp = Math.round(nextXp * 1.8);
  }

  // Update Rank
  let newRank = profile.rankTitle;
  for (const r of RANKS) {
    if (newLevel >= r.minLevel) {
      newRank = r.title;
    }
  }

  // Unlock techniques based on level
  const unlockedTechniques = [...profile.unlockedTechniques];
  if (newLevel >= 2 && !unlockedTechniques.includes('pressure')) {
    unlockedTechniques.push('pressure');
  }
  if (newLevel >= 3 && !unlockedTechniques.includes('sympathize')) {
    unlockedTechniques.push('sympathize');
  }

  const profileWithStreak = recordDailyStreakActivity(profile);

  const updated: DetectiveProfile = {
    ...profileWithStreak,
    level: newLevel,
    xp: newXp,
    nextLevelXp: nextXp,
    rankTitle: newRank,
    casesSolved: isSolved ? profile.casesSolved + 1 : profile.casesSolved,
    casesAttempted: profile.casesAttempted + 1,
    perfectDeductions: isPerfect ? profile.perfectDeductions + 1 : profile.perfectDeductions,
    unlockedTechniques,
    caseHistory: [
      {
        caseId: caseItem.caseId,
        title: caseItem.title,
        date: new Date().toLocaleDateString(),
        theme: caseItem.theme,
        grade: caseItem.grade,
        accuracy: caseItem.accuracy
      },
      ...profile.caseHistory.slice(0, 19)
    ]
  };

  saveProfile(updated);
  return updated;
}

export function saveActiveCase(caseFile: CaseFile): void {
  try {
    localStorage.setItem(ACTIVE_CASE_KEY, JSON.stringify(caseFile));
  } catch (e) {
    console.error('Failed to save active case', e);
  }
}

export function getActiveCase(): CaseFile | null {
  try {
    const data = localStorage.getItem(ACTIVE_CASE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load active case', e);
  }
  return null;
}
