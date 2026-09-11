import React, { useState } from 'react';
import { 
  FolderPlus, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  Loader2, 
  Calendar, 
  X,
  ShieldAlert,
  BookOpen
} from 'lucide-react';
import { CasePackTheme, CaseDifficulty, CaseModifier } from '../types';
import { CASE_PACKS, CASE_MODIFIERS } from '../data/casePacks';

interface CaseSetupModalProps {
  onClose: () => void;
  onGenerateCase: (theme: CasePackTheme, difficulty: CaseDifficulty, modifier: CaseModifier, isDaily: boolean) => void;
  isGenerating: boolean;
}

export const CaseSetupModal: React.FC<CaseSetupModalProps> = ({
  onClose,
  onGenerateCase,
  isGenerating
}) => {
  const [selectedTheme, setSelectedTheme] = useState<CasePackTheme>('noir_1940s');
  const [selectedDifficulty, setSelectedDifficulty] = useState<CaseDifficulty>('detective');
  const [selectedModifier, setSelectedModifier] = useState<CaseModifier>('none');
  const [isDailyCase, setIsDailyCase] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateCase(selectedTheme, selectedDifficulty, selectedModifier, isDailyCase);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm max-w-2xl w-full p-6 shadow-2xl space-y-6 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-black/80 border border-white/20 flex items-center justify-center">
              <FolderPlus className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold">
                Procedural Case Engine
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                GENERATE MYSTERY CASE
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#777] hover:text-white p-2 font-mono text-lg font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          {/* Tutorial Quick Launch & Daily Challenge Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Hand-Authored Tutorial Case Quick Launch */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-sm p-3.5 flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Hand-Authored Tutorial</h4>
              </div>
              <p className="text-[10px] font-mono text-gray-300">Play fixed, deterministic tutorial case without AI variance to learn UI controls.</p>
              <button
                type="button"
                onClick={() => {
                  onGenerateCase('noir_1940s', 'rookie', 'none', false);
                }}
                className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xs text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Launch Tutorial Case
              </button>
            </div>

            {/* Daily Case Challenge Banner Toggle */}
            <div className="bg-black/60 border border-white/10 rounded-sm p-3.5 flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Daily Mystery Challenge</h4>
              </div>
              <p className="text-[10px] font-mono text-[#777]">Play today's shared procedural seed with global leaderboard.</p>
              <button
                type="button"
                onClick={() => setIsDailyCase(!isDailyCase)}
                className={`w-full py-1.5 rounded-xs text-[10px] font-mono font-bold cursor-pointer transition-colors border uppercase tracking-wider ${
                  isDailyCase
                    ? 'bg-red-700 text-white border-red-500'
                    : 'bg-white/5 text-[#777] border-white/10 hover:text-white'
                }`}
              >
                {isDailyCase ? '✓ DAILY SEED ACTIVE' : 'ENABLE DAILY SEED'}
              </button>
            </div>
          </div>

          {/* 1. Case Pack Theme Chooser */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold block">
              1. Select Case Pack Setting
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(CASE_PACKS).map(pack => {
                const isSelected = selectedTheme === pack.id;
                return (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => setSelectedTheme(pack.id)}
                    className={`p-3.5 rounded-sm border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-white/20 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-[#d1d1d1] hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{pack.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                    </div>
                    <p className="text-[10px] font-mono text-amber-500 mt-0.5">{pack.era}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Difficulty Tier */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold block">
              2. Difficulty Calibration
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {(['rookie', 'detective', 'master'] as CaseDifficulty[]).map(diff => {
                const isSelected = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`p-2.5 rounded-sm border text-center font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-700 text-white border-red-500'
                        : 'bg-white/5 border-white/10 text-[#777] hover:text-[#d1d1d1]'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Case Modifier */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold block">
              3. Case Modifiers (Roguelike Twist)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(CASE_MODIFIERS).map(([key, mod]) => {
                const isSelected = selectedModifier === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedModifier(key as CaseModifier)}
                    className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-white/5 border-white/10 text-[#777] hover:text-[#d1d1d1]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{mod.name}</span>
                      {mod.xpBonus > 0 && (
                        <span className="text-[10px] font-mono text-green-400">+{mod.xpBonus}% XP</span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#777] line-clamp-1 mt-0.5">{mod.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-[#d1d1d1] border border-white/10 text-xs font-mono uppercase font-bold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-sm bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider border border-red-500 shadow-xl flex items-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Gemini GM Drafting Case...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate Case File</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
