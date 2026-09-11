import React, { useState } from 'react';
import { 
  Award, 
  Shield, 
  CheckCircle2, 
  Flame, 
  UserCheck, 
  BookOpen, 
  Zap, 
  HeartHandshake, 
  Edit2, 
  Check
} from 'lucide-react';
import { DetectiveProfile } from '../types';
import { saveProfile, RANKS } from '../lib/storage';

interface DetectiveCareerProps {
  profile: DetectiveProfile;
  onUpdateProfile: (updated: DetectiveProfile) => void;
}

export const DetectiveCareer: React.FC<DetectiveCareerProps> = ({
  profile,
  onUpdateProfile
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const xpPercentage = Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100));
  const accuracyRate = profile.casesAttempted > 0
    ? Math.round((profile.casesSolved / profile.casesAttempted) * 100)
    : 100;

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const updated = { ...profile, name: nameInput.trim() };
    saveProfile(updated);
    onUpdateProfile(updated);
    setIsEditingName(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Top Detective Badge Banner */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-6 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-sm bg-black/80 border border-amber-500/50 flex items-center justify-center shrink-0">
            <Shield className="w-10 h-10 text-amber-500" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold">
                Police Bureau ID: {profile.badgeNumber}
              </span>
            </div>

            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-black/60 border border-amber-500 rounded-sm px-3 py-1 text-lg font-bold text-white focus:outline-none"
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 rounded-sm bg-amber-500 hover:bg-amber-400 text-black font-bold cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {profile.name}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-[#777] hover:text-amber-500 p-1 cursor-pointer"
                  title="Edit Detective Name"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-xs text-amber-500 font-mono font-bold uppercase tracking-wider">
              {profile.rankTitle} • Bureau Level {profile.level}
            </p>
          </div>
        </div>

        {/* Level XP Meter */}
        <div className="bg-black/60 border border-white/10 rounded-sm p-4 min-w-[220px] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#777]">Level {profile.level} Progress</span>
            <span className="text-amber-500 font-bold">{profile.xp} / {profile.nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-xs overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-xs transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <span className="text-[10px] text-[#777] font-mono block text-right">
            {profile.nextLevelXp - profile.xp} XP to next Rank
          </span>
        </div>
      </div>

      {/* Career Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-[#0c0c0d] border border-amber-500/30 bg-amber-500/5 rounded-sm p-4 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Daily Streak
          </span>
          <p className="text-2xl font-bold text-amber-400">{profile.dailyStreak || 1} Days</p>
        </div>

        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-4 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#777] font-bold">Cases Solved</span>
          <p className="text-2xl font-bold text-amber-500">{profile.casesSolved}</p>
        </div>

        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-4 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#777] font-bold">Total Attempted</span>
          <p className="text-2xl font-bold text-white">{profile.casesAttempted}</p>
        </div>

        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-4 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#777] font-bold">Success Rate</span>
          <p className="text-2xl font-bold text-green-400">{accuracyRate}%</p>
        </div>

        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-4 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#777] font-bold">Perfect Deductions</span>
          <p className="text-2xl font-bold text-sky-400">{profile.perfectDeductions}</p>
        </div>
      </div>

      {/* Unlocked Interrogation Techniques */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold border-b border-white/10 pb-2">
          Unlocked Interrogation Arsenal
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-black/60 border border-white/10 rounded-sm p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Standard Questioning
              </span>
              <span className="text-[8px] font-mono px-2 py-0.5 rounded-xs bg-green-900/40 text-green-400 border border-green-800/60 font-bold uppercase">UNLOCKED</span>
            </div>
            <p className="text-xs text-[#777]">Balanced questioning to gather baseline facts without alarming the suspect.</p>
          </div>

          <div className={`bg-black/60 border rounded-sm p-3.5 space-y-1.5 ${profile.unlockedTechniques.includes('pressure') ? 'border-red-800/60' : 'border-white/10 opacity-50'}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-red-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-red-400" /> Pressure & Cross-Exam
              </span>
              {profile.unlockedTechniques.includes('pressure') ? (
                <span className="text-[8px] font-mono px-2 py-0.5 rounded-xs bg-green-900/40 text-green-400 border border-green-800/60 font-bold uppercase">UNLOCKED</span>
              ) : (
                <span className="text-[9px] font-mono text-[#777]">Unlocks at Lvl 2</span>
              )}
            </div>
            <p className="text-xs text-[#777]">High-intensity grilling. Raises suspect tension significantly, forcing slip-ups.</p>
          </div>

          <div className={`bg-black/60 border rounded-sm p-3.5 space-y-1.5 ${profile.unlockedTechniques.includes('sympathize') ? 'border-green-800/60' : 'border-white/10 opacity-50'}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-green-400 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-green-400" /> Sympathetic Probe
              </span>
              {profile.unlockedTechniques.includes('sympathize') ? (
                <span className="text-[8px] font-mono px-2 py-0.5 rounded-xs bg-green-900/40 text-green-400 border border-green-800/60 font-bold uppercase">UNLOCKED</span>
              ) : (
                <span className="text-[9px] font-mono text-[#777]">Unlocks at Lvl 3</span>
              )}
            </div>
            <p className="text-xs text-[#777]">Empathetic stance. Lowers suspect defensiveness and encourages private confessions.</p>
          </div>
        </div>
      </div>

      {/* Case Archive Table */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold border-b border-white/10 pb-2">
          Archived Case Files ({profile.caseHistory.length})
        </h3>

        {profile.caseHistory.length === 0 ? (
          <p className="text-xs text-[#777] font-mono italic text-center py-6">
            No archived cases yet. Complete your first mystery to populate your career record!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-black/60 text-[#777] font-mono text-[10px] uppercase border-b border-white/10">
                <tr>
                  <th className="p-3">Case Title</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Theme</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {profile.caseHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-white">{item.title}</td>
                    <td className="p-3 font-mono text-[#777]">{item.date}</td>
                    <td className="p-3 font-mono text-amber-500">{item.theme}</td>
                    <td className="p-3 font-bold text-amber-500">{item.grade}</td>
                    <td className="p-3 font-mono text-green-400">{item.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
