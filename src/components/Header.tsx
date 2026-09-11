import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  MessageSquare, 
  Share2, 
  Award, 
  FolderPlus, 
  AlertTriangle, 
  Briefcase,
  Flame,
  Calendar,
  BookOpen,
  Volume2,
  VolumeX,
  CloudRain,
  HelpCircle,
  Keyboard
} from 'lucide-react';
import { DetectiveProfile, CaseFile } from '../types';
import { CASE_PACKS, CASE_MODIFIERS } from '../data/casePacks';
import { audioManager } from '../lib/AudioManager';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: DetectiveProfile;
  caseFile: CaseFile | null;
  onOpenNewCaseModal: () => void;
  onOpenAccuseModal: () => void;
  onOpenHowToPlayModal: () => void;
  onOpenShortcutsModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  profile,
  caseFile,
  onOpenNewCaseModal,
  onOpenAccuseModal,
  onOpenHowToPlayModal,
  onOpenShortcutsModal
}) => {
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const [isRainActive, setIsRainActive] = useState<boolean>(false);

  const currentPack = caseFile ? CASE_PACKS[caseFile.theme] : null;
  const currentModifier = caseFile ? CASE_MODIFIERS[caseFile.modifier] : null;

  const xpPercentage = Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100));

  const handleToggleSound = () => {
    const updated = audioManager.toggleSound();
    setIsSoundOn(updated);
    if (!updated) setIsRainActive(false);
  };

  const handleToggleRain = () => {
    const active = audioManager.toggleAmbientNoir();
    setIsRainActive(active);
    if (active) setIsSoundOn(true);
  };

  const handleTabClick = (tab: string) => {
    audioManager.playTabTransition(tab);
    setActiveTab(tab);
  };

  return (
    <header className="bg-[#0c0c0d] border-b border-white/10 text-[#d1d1d1] sticky top-0 z-40 shadow-2xl backdrop-blur-md">
      {/* Top Banner / Case Title & Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Case Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/15 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#777] font-mono flex items-center gap-2">
              <span>Case Archive / No. {caseFile ? caseFile.caseId.slice(-6).toUpperCase() : '---'}</span>
              {caseFile?.isDailyCase && (
                <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-xs bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono font-bold">
                  <Calendar className="w-2.5 h-2.5" /> DAILY CASE
                </span>
              )}
            </div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shrink-0"></span>
              {caseFile ? caseFile.title.toUpperCase() : 'AI DETECTIVE MYSTERY'}
            </h1>
          </div>
        </div>

        {/* Center Case Meta Info */}
        {caseFile && (
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
            <span 
              className="px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-amber-400 font-medium"
            >
              Setting: {currentPack?.title}
            </span>
            <span className="px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-[#999] uppercase font-semibold">
              Difficulty: {caseFile.difficulty}
            </span>
            {caseFile.modifier !== 'none' && currentModifier && (
              <span className="px-2.5 py-1 rounded-sm bg-red-950/40 border border-red-800/60 text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                {currentModifier.name}
              </span>
            )}
          </div>
        )}

        {/* Right Detective Profile & Main Action */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Daily Streak Counter Badge */}
          <div 
            className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1.5 rounded-sm text-amber-400 font-mono text-xs font-bold shadow-sm"
            title="Daily Investigation Streak - Return daily to keep your detective streak active!"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 animate-pulse shrink-0" />
            <span className="tracking-wider">{profile.dailyStreak || 1}d Streak</span>
          </div>

          {/* Detective Level & XP */}
          <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-sm">
            <div className="text-right">
              <div className="text-[10px] uppercase text-[#777] font-mono">Detective Rank</div>
              <div className="font-mono text-amber-500 text-xs font-bold">
                {profile.rankTitle} (Lvl {profile.level})
              </div>
            </div>
            <div className="w-16 bg-white/10 h-1.5 rounded-xs overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-xs transition-all duration-500" 
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>

          {/* Accuse Button */}
          {caseFile && (
            <button
              onClick={onOpenAccuseModal}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-sm text-xs font-bold tracking-widest shadow-lg border border-red-500 flex items-center gap-2 transition-all cursor-pointer uppercase"
            >
              <Flame className="w-4 h-4 text-white animate-pulse" />
              <span>Ready to Accuse</span>
            </button>
          )}

          {/* Rain Atmosphere Toggle */}
          <button
            onClick={handleToggleRain}
            className={`px-2.5 py-2 rounded-sm border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isRainActive
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-[#777] border-white/10'
            }`}
            title="Toggle Noir Ambient Rain Sound"
          >
            <CloudRain className={`w-4 h-4 ${isRainActive ? 'text-sky-400 animate-pulse' : 'text-[#777]'}`} />
            <span className="hidden md:inline">Rain</span>
          </button>

          {/* Sound FX Mute Toggle */}
          <button
            onClick={handleToggleSound}
            className={`px-2.5 py-2 rounded-sm border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              isSoundOn
                ? 'bg-white/5 hover:bg-white/10 text-[#d1d1d1] border-white/10'
                : 'bg-red-950/40 text-red-400 border-red-800/60'
            }`}
            title={isSoundOn ? 'Mute Noir Sound Effects' : 'Unmute Sound Effects'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-amber-500" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          {/* How to Play Guide Button */}
          <button
            onClick={onOpenHowToPlayModal}
            className="px-3 py-2 rounded-sm bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer font-bold"
            title="How to Play Case Zero — Detective Onboarding Guide"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">How to Play</span>
          </button>

          {/* Keyboard Shortcuts Button */}
          {onOpenShortcutsModal && (
            <button
              onClick={onOpenShortcutsModal}
              className="px-2.5 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-[#d1d1d1] border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              title="Keyboard Shortcuts Reference (Press ? or Ctrl+/)"
            >
              <Keyboard className="w-4 h-4 text-amber-500" />
              <span className="hidden lg:inline">Keys</span>
              <kbd className="hidden sm:inline-block text-[9px] bg-white/10 px-1 py-0.2 rounded-xs border border-white/20 text-amber-400 font-bold">?</kbd>
            </button>
          )}

          {/* New Case Button */}
          <button
            onClick={onOpenNewCaseModal}
            className="px-3 py-2 rounded-sm bg-white/5 hover:bg-white/10 text-[#d1d1d1] border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Generate New Case / Case Packs"
          >
            <FolderPlus className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">New Case</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="bg-[#080808] border-t border-white/10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
          <button
            onClick={() => handleTabClick('briefing')}
            title="Case Briefing (Ctrl+B / ⌘B)"
            className={`px-3 py-2 rounded-sm flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'briefing'
                ? 'bg-white/10 text-white border border-white/20 font-bold'
                : 'text-[#777] hover:text-[#d1d1d1] hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-500" />
            <span>1. Case Briefing</span>
            <kbd className="hidden md:inline text-[9px] text-amber-400/80 bg-white/5 px-1 py-0.2 rounded-xs border border-white/10 ml-1">^B</kbd>
          </button>

          <button
            onClick={() => handleTabClick('investigation')}
            title="Scene Investigation (Ctrl+I / ⌘I)"
            className={`px-3 py-2 rounded-sm flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'investigation'
                ? 'bg-white/10 text-white border border-white/20 font-bold'
                : 'text-[#777] hover:text-[#d1d1d1] hover:bg-white/5'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span>2. Scene Investigation</span>
            <kbd className="hidden md:inline text-[9px] text-amber-400/80 bg-white/5 px-1 py-0.2 rounded-xs border border-white/10 ml-1">^I</kbd>
          </button>

          <button
            onClick={() => handleTabClick('interrogation')}
            title="Interrogation Room (Ctrl+Q / ⌘Q)"
            className={`px-3 py-2 rounded-sm flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'interrogation'
                ? 'bg-white/10 text-white border border-white/20 font-bold'
                : 'text-[#777] hover:text-[#d1d1d1] hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
            <span>3. Interrogation Room</span>
            <kbd className="hidden md:inline text-[9px] text-amber-400/80 bg-white/5 px-1 py-0.2 rounded-xs border border-white/10 ml-1">^Q</kbd>
          </button>

          <button
            onClick={() => handleTabClick('deduction')}
            title="Deduction Corkboard (Ctrl+D / ⌘D)"
            className={`px-3 py-2 rounded-sm flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'deduction'
                ? 'bg-white/10 text-white border border-white/20 font-bold'
                : 'text-[#777] hover:text-[#d1d1d1] hover:bg-white/5'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-amber-500" />
            <span>4. Deduction Corkboard</span>
            <kbd className="hidden md:inline text-[9px] text-amber-400/80 bg-white/5 px-1 py-0.2 rounded-xs border border-white/10 ml-1">^D</kbd>
          </button>

          <button
            onClick={() => handleTabClick('journal')}
            title="Case Journal & Notes (Ctrl+K / ⌘K)"
            className={`px-3 py-2 rounded-sm flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'journal'
                ? 'bg-white/10 text-white border border-white/20 font-bold'
                : 'text-[#777] hover:text-[#d1d1d1] hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>5. Case Journal</span>
            <kbd className="hidden md:inline text-[9px] text-amber-400/80 bg-white/5 px-1 py-0.2 rounded-xs border border-white/10 ml-1">^K</kbd>
          </button>

          <button
            onClick={() => handleTabClick('career')}
            title="Detective Bureau Career (Ctrl+U / ⌘U)"
            className={`px-3 py-2 rounded-sm flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'career'
                ? 'bg-white/10 text-white border border-white/20 font-bold'
                : 'text-[#777] hover:text-[#d1d1d1] hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Detective Bureau</span>
            <kbd className="hidden md:inline text-[9px] text-amber-400/80 bg-white/5 px-1 py-0.2 rounded-xs border border-white/10 ml-1">^U</kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
