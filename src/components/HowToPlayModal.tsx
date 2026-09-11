import React from 'react';
import { X, HelpCircle, Shield, Award, Sparkles, BookOpen } from 'lucide-react';
import { audioManager } from '../lib/AudioManager';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankTitle?: string;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  rankTitle = 'Rookie'
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    audioManager.playPaperRustle();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative max-w-5xl w-full bg-[#12141a] border-4 border-[#2c221a] rounded-sm p-4 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-[#ede3c8] font-serif space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#9a9280] hover:text-white p-2 rounded-xs bg-white/5 border border-white/10 cursor-pointer transition-colors z-20"
          title="Close Guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="font-mono tracking-[0.35em] text-[11px] text-[#dcac5c] uppercase font-bold flex items-center justify-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#dcac5c]" />
            <span>Detective Onboarding — File No. 000</span>
          </div>
          <h1 className="font-mono text-2xl sm:text-4xl text-[#ede3c8] tracking-tight drop-shadow-[0_0_24px_rgba(220,172,92,0.15)]">
            How to Play Case Zero
          </h1>
          <p className="font-serif italic text-[#9a9280] text-sm sm:text-base">
            "Every case starts from nothing. Every culprit is new."
          </p>
        </div>

        {/* Corkboard Container */}
        <div className="relative bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.15),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.15),transparent_60%),#3b2e22] border-8 border-[#2c221a] rounded-xs p-4 sm:p-8 shadow-[inset_0_0_60px_rgba(0,0,0,0.55),0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Corkboard pattern overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'radial-gradient(rgba(0,0,0,0.2) 1px, transparent 1.4px)',
              backgroundSize: '6px 6px'
            }}
          />

          {/* Connected Thread Path (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <path 
              d="M 140,120 C 220,160 260,80 380,130 S 500,200 620,140 S 780,80 840,130" 
              fill="none" 
              stroke="#7a2020" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
            />
            <path 
              d="M 140,360 C 220,400 260,320 380,370 S 500,430 620,380 S 780,320 840,370" 
              fill="none" 
              stroke="#7a2020" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
            />
          </svg>

          {/* Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Exhibit A */}
            <div className="bg-[#ede3c8] text-[#221a10] p-5 rounded-xs shadow-[0_10px_18px_rgba(0,0,0,0.45)] relative -rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#d6d6d6_45%,#8a8a8a_100%)] shadow-md" />
              <div className="font-mono text-[10px] tracking-widest text-[#b98b3e] uppercase border border-[#b98b3e] inline-block px-2 py-0.5 mb-2 font-bold">
                Exhibit A
              </div>
              <h3 className="font-mono text-base font-bold mb-1.5 leading-tight">Open the Case</h3>
              <p className="text-xs text-[#4a3f2c] leading-relaxed">
                Pick a difficulty — Rookie, Detective, or Master — and a theme, or hit "Surprise Me." A brand-new murder is generated behind the scenes. You'll never see the full file. That's the point.
              </p>
              <div className="absolute bottom-2 right-3 font-mono text-[9px] text-[#7a2020] border-2 border-[#7a2020] px-1.5 py-0.5 -rotate-6 opacity-60 font-bold uppercase tracking-widest">
                CONFIDENTIAL
              </div>
            </div>

            {/* Exhibit B */}
            <div className="bg-[#ede3c8] text-[#221a10] p-5 rounded-xs shadow-[0_10px_18px_rgba(0,0,0,0.45)] relative rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#d6d6d6_45%,#8a8a8a_100%)] shadow-md" />
              <div className="font-mono text-[10px] tracking-widest text-[#b98b3e] uppercase border border-[#b98b3e] inline-block px-2 py-0.5 mb-2 font-bold">
                Exhibit B
              </div>
              <h3 className="font-mono text-base font-bold mb-1.5 leading-tight">Walk the Scene</h3>
              <p className="text-xs text-[#4a3f2c] leading-relaxed">
                Explore the crime scene and examine objects. Every discovery — a torn letter, a broken watch, a footprint that shouldn't be there — logs itself into your notebook automatically.
              </p>
            </div>

            {/* Exhibit C */}
            <div className="bg-[#ede3c8] text-[#221a10] p-5 rounded-xs shadow-[0_10px_18px_rgba(0,0,0,0.45)] relative -rotate-2 hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#d6d6d6_45%,#8a8a8a_100%)] shadow-md" />
              <div className="font-mono text-[10px] tracking-widest text-[#b98b3e] uppercase border border-[#b98b3e] inline-block px-2 py-0.5 mb-2 font-bold">
                Exhibit C
              </div>
              <h3 className="font-mono text-base font-bold mb-1.5 leading-tight">Question Suspects</h3>
              <p className="text-xs text-[#4a3f2c] leading-relaxed">
                Talk to each suspect in your own words. No multiple choice. Everyone has a personality, an alibi, and something they'd rather you didn't find. Push too soft, they stay quiet. Push with proof, they crack.
              </p>
            </div>

            {/* Exhibit D */}
            <div className="bg-[#ede3c8] text-[#221a10] p-5 rounded-xs shadow-[0_10px_18px_rgba(0,0,0,0.45)] relative rotate-2 hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#d6d6d6_45%,#8a8a8a_100%)] shadow-md" />
              <div className="font-mono text-[10px] tracking-widest text-[#b98b3e] uppercase border border-[#b98b3e] inline-block px-2 py-0.5 mb-2 font-bold">
                Exhibit D
              </div>
              <h3 className="font-mono text-base font-bold mb-1.5 leading-tight">Build the Board</h3>
              <p className="text-xs text-[#4a3f2c] leading-relaxed">
                Drag clues and testimony onto the corkboard. Connect them with string. This is where the case actually gets solved — in your head, not the AI's.
              </p>
            </div>

            {/* Exhibit E */}
            <div className="bg-[#ede3c8] text-[#221a10] p-5 rounded-xs shadow-[0_10px_18px_rgba(0,0,0,0.45)] relative -rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#d6d6d6_45%,#8a8a8a_100%)] shadow-md" />
              <div className="font-mono text-[10px] tracking-widest text-[#b98b3e] uppercase border border-[#b98b3e] inline-block px-2 py-0.5 mb-2 font-bold">
                Exhibit E
              </div>
              <h3 className="font-mono text-base font-bold mb-1.5 leading-tight">Call Your Partner</h3>
              <p className="text-xs text-[#4a3f2c] leading-relaxed">
                Stuck? "Consult Your Partner" gives you a nudge — never the answer. Limited uses per case, tuned dynamically per difficulty level.
              </p>
            </div>

            {/* Exhibit F */}
            <div className="bg-[#ede3c8] text-[#221a10] p-5 rounded-xs shadow-[0_10px_18px_rgba(0,0,0,0.45)] relative rotate-1 hover:rotate-0 hover:-translate-y-1 transition-all duration-200">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#d6d6d6_45%,#8a8a8a_100%)] shadow-md" />
              <div className="font-mono text-[10px] tracking-widest text-[#b98b3e] uppercase border border-[#b98b3e] inline-block px-2 py-0.5 mb-2 font-bold">
                Exhibit F
              </div>
              <h3 className="font-mono text-base font-bold mb-1.5 leading-tight">Make Accusation</h3>
              <p className="text-xs text-[#4a3f2c] leading-relaxed">
                Name the culprit, the weapon, the motive — and cite the evidence behind each. No proof, no accusation. The board won't let you guess blind.
              </p>
            </div>

            {/* Exhibit G — Spans 2 Columns on desktop */}
            <div className="bg-[#ede3c8] text-[#221a10] p-5 rounded-xs shadow-[0_10px_18px_rgba(0,0,0,0.45)] relative -rotate-2 hover:rotate-0 hover:-translate-y-1 transition-all duration-200 sm:col-span-2">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#d6d6d6_45%,#8a8a8a_100%)] shadow-md" />
              <div className="font-mono text-[10px] tracking-widest text-[#b98b3e] uppercase border border-[#b98b3e] inline-block px-2 py-0.5 mb-2 font-bold">
                Exhibit G — Final
              </div>
              <h3 className="font-mono text-base font-bold mb-1.5 leading-tight">Case Closed</h3>
              <p className="text-xs text-[#4a3f2c] leading-relaxed">
                The truth is revealed as a full narrative. Every clue you cited gets scored — correct, irrelevant, or a red herring you fell for. Earn rank, then check tomorrow's Daily Case: same seed, same city, everyone racing the same mystery.
              </p>
              <div className="absolute bottom-2 right-3 font-mono text-[9px] text-[#7a2020] border-2 border-[#7a2020] px-1.5 py-0.5 -rotate-6 opacity-60 font-bold uppercase tracking-widest">
                CASE CLOSED
              </div>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts Banner for Power Users */}
        <div className="bg-black/40 border border-white/10 rounded-xs p-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#dcac5c]">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-amber-400">Power User Shortcuts:</span>
            <span className="text-[#9a9280] hidden sm:inline">Navigate your bureau without touching the mouse</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <kbd className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl+B: Briefing</kbd>
            <kbd className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl+I: Scene</kbd>
            <kbd className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl+Q: Suspects</kbd>
            <kbd className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl+D: Deduction</kbd>
            <kbd className="bg-white/10 border border-white/20 px-1.5 py-0.5 rounded text-[10px] text-white">Ctrl+K: Journal</kbd>
            <kbd className="bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 rounded text-[10px] text-amber-300">?: All Keys</kbd>
          </div>
        </div>

        {/* Footer Rank & Close CTA */}
        <div className="text-center space-y-4 pt-2">
          <div className="inline-block font-mono text-lg sm:text-xl text-[#dcac5c] border-2 border-double border-[#dcac5c] px-6 py-2.5 -rotate-1 uppercase tracking-widest font-bold shadow-lg">
            Detective Rank: {rankTitle}
          </div>
          <p className="italic text-[#9a9280] text-xs sm:text-sm">
            Your first case is waiting. The board doesn't lie — but everyone on it might.
          </p>

          <button
            onClick={handleClose}
            className="mt-3 px-8 py-3 bg-[#b98b3e] hover:bg-[#dcac5c] text-[#12141a] font-mono text-xs font-bold uppercase tracking-widest rounded-xs shadow-xl transition-all cursor-pointer"
          >
            Acknowledge & Begin Investigation
          </button>
        </div>
      </div>
    </div>
  );
};
