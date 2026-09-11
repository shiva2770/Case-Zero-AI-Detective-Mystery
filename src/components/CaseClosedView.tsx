import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  FileText,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CaseFile, AccusationResult } from '../types';

interface CaseClosedViewProps {
  caseFile: CaseFile;
  result: AccusationResult;
  onStartNewCase: () => void;
  onViewCareer: () => void;
}

export const CaseClosedView: React.FC<CaseClosedViewProps> = ({
  caseFile,
  result,
  onStartNewCase,
  onViewCareer
}) => {
  const getGradeStyle = (grade: string) => {
    switch (grade) {
      case 'S':
        return 'text-amber-400 border-amber-500 bg-black/80 shadow-amber-500/20';
      case 'A':
        return 'text-green-400 border-green-500 bg-black/80 shadow-green-500/20';
      case 'B':
        return 'text-sky-400 border-sky-500 bg-black/80 shadow-sky-500/20';
      case 'C':
        return 'text-yellow-400 border-yellow-500 bg-black/80 shadow-yellow-500/20';
      default:
        return 'text-red-400 border-red-500 bg-black/80 shadow-red-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8 animate-fade-in">
      {/* Top Noir Result Header */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-6 shadow-2xl relative overflow-hidden text-center space-y-4">
        <div className="absolute top-4 right-4">
          <div className={`w-16 h-16 rounded-sm border-2 flex items-center justify-center text-2xl font-black shadow-xl transform rotate-6 ${getGradeStyle(result.grade)}`}>
            {result.grade}
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold block">
          Case Closed • Final Police Bureau Report
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {result.isCulpritCorrect ? 'CASE SOLVED SUCCESSFULLY!' : 'MISTRIAL & MISDIRECTION'}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
          <span className="px-3 py-1 rounded-sm bg-black/60 border border-white/10 text-[#d1d1d1]">
            Deduction Accuracy: <strong className="text-amber-500">{result.overallAccuracy}%</strong>
          </span>
          <span className="px-3 py-1 rounded-sm bg-black/60 border border-white/10 text-[#d1d1d1]">
            XP Earned: <strong className="text-green-400">+{result.xpEarned} XP</strong>
          </span>
        </div>
      </div>

      {/* Dramatic Reveal Narrative */}
      <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-6 shadow-xl space-y-3">
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold flex items-center gap-2 border-b border-white/10 pb-2">
          <FileText className="w-4 h-4 text-amber-500" />
          The Grand Reveal & Truth
        </h3>

        <div className="text-xs sm:text-sm text-[#d1d1d1] font-sans leading-relaxed whitespace-pre-line bg-black/60 p-5 rounded-sm border border-white/10">
          {result.revealNarrative}
        </div>
      </div>

      {/* Accuracy & Breakdown Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Checklist */}
        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold border-b border-white/10 pb-2">
            Adjudication Verification
          </h3>

          <div className="space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-sm bg-black/60 border border-white/10">
              <span className="text-[#d1d1d1] font-bold">Accused Culprit</span>
              {result.isCulpritCorrect ? (
                <span className="text-green-400 font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> MATCHED ({result.breakdown.trueCulpritName})
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-1 font-mono">
                  <XCircle className="w-4 h-4" /> MISSED (Real: {result.breakdown.trueCulpritName})
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-sm bg-black/60 border border-white/10">
              <span className="text-[#d1d1d1] font-bold">Murder Weapon</span>
              {result.isWeaponCorrect ? (
                <span className="text-green-400 font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> VERIFIED
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1 font-mono">
                  Actual: {result.breakdown.trueWeapon}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-sm bg-black/60 border border-white/10">
              <span className="text-[#d1d1d1] font-bold">Motive Consistency</span>
              {result.isMotiveCorrect ? (
                <span className="text-green-400 font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> VALIDATED
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-1 font-mono">
                  INACCURATE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Clue Breakdown */}
        <div className="bg-[#0c0c0d] border border-white/10 rounded-sm p-5 shadow-xl space-y-4">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold border-b border-white/10 pb-2">
            Investigation Efficiency
          </h3>

          <div className="space-y-3 font-sans text-xs">
            {result.breakdown.keyEvidenceMissed.length > 0 ? (
              <div>
                <span className="text-amber-500 font-mono uppercase block mb-1">Key Clues Missed:</span>
                <ul className="list-disc list-inside text-[#777] space-y-1">
                  {result.breakdown.keyEvidenceMissed.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-green-400 font-mono">
                ✓ Perfect thoroughness! You uncovered every key piece of evidence.
              </p>
            )}

            {result.breakdown.redHerringsAvoided.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <span className="text-green-400 font-mono uppercase block mb-1">Red Herrings Avoided:</span>
                <ul className="list-disc list-inside text-[#777] space-y-1">
                  {result.breakdown.redHerringsAvoided.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Case Actions */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onViewCareer}
          className="px-5 py-2.5 rounded-sm bg-white/5 hover:bg-white/10 text-[#d1d1d1] border border-white/10 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>View Detective Career</span>
        </button>

        <button
          onClick={onStartNewCase}
          className="px-6 py-3 rounded-sm bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider border border-red-500 shadow-xl flex items-center gap-2 cursor-pointer transition-all"
        >
          <span>Start Next Mystery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
