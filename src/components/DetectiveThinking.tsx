import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, Sparkles, Fingerprint, FileText, Clock, AlertCircle } from 'lucide-react';

interface InvestigationThinkingProps {
  locationName: string;
}

const INVESTIGATION_THOUGHTS = [
  'Dusting surfaces and fixtures for latent fingerprints...',
  'Inspecting corners for disturbed dust and misplaced items...',
  'Checking floorboards and baseboards for drag marks or scrapes...',
  'Reconstructing line of sight and potential points of entry...',
  'Documenting physical evidence into official case register...',
  'Checking for concealed compartments or hidden ledgers...'
];

export const InvestigationThinkingSkeleton: React.FC<InvestigationThinkingProps> = ({ locationName }) => {
  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtIndex(prev => (prev + 1) % INVESTIGATION_THOUGHTS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Detective Monologue & Radar Banner */}
      <div className="bg-[#12141a] border border-amber-500/30 rounded-sm p-4 relative overflow-hidden shadow-lg">
        {/* Shimmer sweep effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-500/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-sm bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Search className="w-5 h-5 animate-pulse text-amber-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Forensic Search in Progress
                </span>
                <span className="text-[10px] font-mono text-[#777]">• {locationName}</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#ede3c8] italic mt-0.5 flex items-center gap-2 min-h-[1.5rem]">
                <span className="inline-block w-1.5 h-3.5 bg-amber-500/80 animate-pulse" />
                <span>"{INVESTIGATION_THOUGHTS[thoughtIndex]}"</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400/80 bg-black/50 px-2.5 py-1 rounded-xs border border-white/5 self-start sm:self-auto">
            <Fingerprint className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>ANALYZING SCENE RESIDUE</span>
          </div>
        </div>
      </div>

      {/* Narrative Discovery Skeleton Card */}
      <div className="bg-white/5 border border-white/10 rounded-sm p-4 space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500/20 animate-pulse" />
            <div className="h-3 w-36 bg-amber-500/20 rounded-xs animate-pulse" />
          </div>
          <div className="h-2.5 w-16 bg-white/10 rounded-xs animate-pulse" />
        </div>

        <div className="space-y-2 pt-1">
          <div className="h-3 w-full bg-white/10 rounded-xs animate-pulse" />
          <div className="h-3 w-11/12 bg-white/10 rounded-xs animate-pulse" />
          <div className="h-3 w-4/5 bg-white/10 rounded-xs animate-pulse" />
        </div>
      </div>

      {/* Clue Discovery Skeleton Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold">
            Evidence Detection Sensor
          </span>
          <span className="text-[9px] font-mono text-amber-500/80 uppercase">Triangulating Objects...</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-black/40 border border-white/10 rounded-sm p-3.5 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-amber-500/20 rounded-xs border border-amber-500/30 animate-pulse" />
                <div className="h-3 w-12 bg-white/10 rounded-xs animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 w-3/4 bg-white/20 rounded-xs animate-pulse" />
                <div className="h-2.5 w-full bg-white/10 rounded-xs animate-pulse" />
                <div className="h-2.5 w-4/5 bg-white/10 rounded-xs animate-pulse" />
              </div>
              <div className="pt-1 flex items-center justify-between">
                <div className="h-2.5 w-24 bg-white/10 rounded-xs animate-pulse" />
                <div className="h-4 w-12 bg-white/10 rounded-xs animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface InterrogationThinkingProps {
  suspectName: string;
  technique?: string;
}

const INTERROGATION_OBSERVATIONS = [
  'Observing eye contact and sudden throat clearing...',
  'Watching micro-reactions and defensive shoulder posturing...',
  'Cross-referencing timeline statement with crime scene chronology...',
  'Listening closely to the hesitation before the reply...',
  'Analyzing vocal inflection for deceptive stress markers...',
  'Suspect is calculating how much proof has been accumulated...'
];

export const InterrogationThinkingSkeleton: React.FC<InterrogationThinkingProps> = ({
  suspectName,
  technique = 'standard'
}) => {
  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtIndex(prev => (prev + 1) % INTERROGATION_OBSERVATIONS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start space-y-2 animate-fade-in w-full max-w-xl">
      {/* Header Stamp */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-amber-500">
        <span className="font-bold">{suspectName}</span>
        <span>•</span>
        <span className="uppercase text-[#777]">Deliberating Statement</span>
        {technique && technique !== 'standard' && (
          <span className="text-[9px] uppercase font-bold text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded-xs border border-red-800/40">
            {technique}
          </span>
        )}
      </div>

      {/* Skeleton Chat Bubble with Monologue */}
      <div className="w-full bg-[#12141a]/95 border border-amber-500/30 rounded-sm p-4 text-[#d1d1d1] shadow-lg relative overflow-hidden space-y-3">
        {/* Shimmer sweep effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-500/5 to-transparent pointer-events-none" />

        {/* Psychological Observation Bar */}
        <div className="flex items-center justify-between text-[10px] font-mono pb-2 border-b border-white/5 text-[#777]">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Eye className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>DETECTIVE OBSERVATION:</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[9px] text-[#999]">HEURISTIC RADAR</span>
          </div>
        </div>

        {/* Observation Monologue */}
        <div className="text-xs font-mono text-[#ede3c8] italic flex items-center gap-2 min-h-[1.25rem]">
          <span className="inline-block w-1.5 h-3 bg-amber-500/80 animate-pulse" />
          <span>"{INTERROGATION_OBSERVATIONS[thoughtIndex]}"</span>
        </div>

        {/* Skeleton Response Lines */}
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full bg-white/10 rounded-xs animate-pulse" />
          <div className="h-3 w-4/5 bg-white/10 rounded-xs animate-pulse" />
          <div className="h-3 w-2/3 bg-white/10 rounded-xs animate-pulse" />
        </div>

        {/* Typing Dots / Transcript Indicator */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#777]">
            <span>STENO TRANSCRIPT RECORDING</span>
            <span className="inline-flex gap-1">
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>

          <span className="text-[9px] font-mono text-amber-500/60 uppercase border border-amber-500/20 px-1.5 py-0.5 rounded-xs">
            PENDING REPLY
          </span>
        </div>
      </div>
    </div>
  );
};

interface FloatingDetectiveThinkingProps {
  isVisible: boolean;
  context: 'investigation' | 'interrogation';
  targetName?: string;
}

const INVESTIGATION_SUB_THOUGHTS = [
  'Reconstructing crime scene timeline...',
  'Analyzing forensic trace & friction ridges...',
  'Checking for hidden compartments...',
  'Formulating preliminary case deduction...'
];

const INTERROGATION_SUB_THOUGHTS = [
  'Cross-referencing alibi with evidence...',
  'Evaluating psychological defense mechanisms...',
  'Probing for narrative inconsistency...',
  'Detecting micro-expressions and stress shifts...'
];

export const FloatingDetectiveThinking: React.FC<FloatingDetectiveThinkingProps> = ({
  isVisible,
  context,
  targetName
}) => {
  const [thoughtIndex, setThoughtIndex] = useState(0);

  const thoughts = context === 'investigation' ? INVESTIGATION_SUB_THOUGHTS : INTERROGATION_SUB_THOUGHTS;

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      setThoughtIndex(prev => (prev + 1) % thoughts.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [isVisible, thoughts.length]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full"
        >
          <motion.div
            animate={{ 
              y: [0, -3, 0],
              boxShadow: [
                '0 4px 15px rgba(0, 0, 0, 0.5)',
                '0 8px 25px rgba(245, 158, 11, 0.15)',
                '0 4px 15px rgba(0, 0, 0, 0.5)'
              ]
            }}
            transition={{
              y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
              boxShadow: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
            }}
            className="bg-[#0e1017]/95 border border-amber-500/50 rounded-sm p-3 shadow-xl flex flex-wrap items-center justify-between gap-3 relative overflow-hidden backdrop-blur-md"
          >
            {/* Subtle background shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-amber-500/10 to-transparent pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-xs bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                <Search className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-80" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <motion.span 
                    animate={{ opacity: [0.75, 1, 0.75] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400"
                  >
                    Detective is thinking...
                  </motion.span>
                  <span className="text-[10px] font-mono text-[#888] hidden sm:inline">
                    {context === 'investigation' ? (
                      targetName ? `[Examining: ${targetName}]` : '[Forensic Scene Sweep]'
                    ) : (
                      targetName ? `[Cross-Examining: ${targetName}]` : '[Interrogation Dialogue]'
                    )}
                  </span>
                </div>

                <motion.p
                  key={thoughtIndex}
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-mono text-[#d1c7b7] italic line-clamp-1 mt-0.5"
                >
                  "{thoughts[thoughtIndex]}"
                </motion.p>
              </div>
            </div>

            {/* Pulsing Status Pill */}
            <div className="flex items-center gap-2 bg-black/60 border border-amber-500/30 px-2.5 py-1 rounded-xs relative z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[9px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                Gemini AI Reasoning
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
