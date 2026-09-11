import React from 'react';
import { motion } from 'motion/react';
import { 
  ZoomIn, 
  Search, 
  MapPin, 
  User, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  Crosshair,
  Sparkles,
  Tag
} from 'lucide-react';
import { CorkNode, Clue, Suspect, CaseFile } from '../types';

interface EvidenceMagnifierProps {
  node: CorkNode;
  caseFile: CaseFile;
  position: { x: number; y: number };
}

// Fallback high-res macro evidence images based on evidence type/title
function getEvidenceMacroImage(clue?: Clue, nodeType?: string): string {
  if (!clue) {
    if (nodeType === 'suspect') {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop';
  }

  const titleLower = clue.title.toLowerCase();
  const descLower = clue.description.toLowerCase();

  if (titleLower.includes('key') || titleLower.includes('lock') || titleLower.includes('safe')) {
    return 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=600&auto=format&fit=crop';
  }
  if (titleLower.includes('letter') || titleLower.includes('telegram') || titleLower.includes('note') || clue.type === 'documentary') {
    return 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop';
  }
  if (titleLower.includes('poison') || titleLower.includes('vial') || titleLower.includes('glass') || titleLower.includes('chemical')) {
    return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop';
  }
  if (titleLower.includes('gun') || titleLower.includes('bullet') || titleLower.includes('knife') || titleLower.includes('weapon')) {
    return 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?q=80&w=600&auto=format&fit=crop';
  }
  if (titleLower.includes('fingerprint') || titleLower.includes('smudge') || titleLower.includes('glove')) {
    return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop';
  }

  return 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop';
}

export const EvidenceMagnifier: React.FC<EvidenceMagnifierProps> = ({
  node,
  caseFile,
  position
}) => {
  // Locate full data
  const clue: Clue | undefined = node.type === 'clue'
    ? caseFile.clues.find(c => c.id === node.refId || c.title === node.title)
    : undefined;

  const suspect: Suspect | undefined = node.type === 'suspect'
    ? caseFile.suspects.find(s => s.id === node.refId || s.name === node.title)
    : undefined;

  const macroImage = (suspect && suspect.imageUrl) 
    ? suspect.imageUrl 
    : getEvidenceMacroImage(clue, node.type);

  // Calculate smart anchor placement so magnifier popover stays on screen
  // If node is on right half of canvas, offset to the left; otherwise to the right
  const isRightSide = position.x > 500;
  const isBottomSide = position.y > 320;

  const leftPos = isRightSide ? Math.max(10, position.x - 340) : position.x + 190;
  const topPos = isBottomSide ? Math.max(10, position.y - 280) : Math.max(10, position.y - 20);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 5 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      style={{ left: `${leftPos}px`, top: `${topPos}px` }}
      className="absolute z-50 w-80 bg-[#09090b] border-2 border-amber-500/80 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden pointer-events-none"
    >
      {/* Loupe Header Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-black to-amber-950 border-b border-amber-500/40 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] font-bold tracking-wider uppercase">
          <ZoomIn className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>MAGNIFIED INSPECTION LENS [2.5x]</span>
        </div>
        <span className="text-[9px] font-mono text-amber-500/60 bg-amber-500/10 px-1.5 py-0.5 rounded-xs border border-amber-500/30">
          HD LOUPE
        </span>
      </div>

      {/* Loupe Viewport / Image Magnifier Frame */}
      <div className="relative w-full h-36 bg-black overflow-hidden border-b border-white/10 group">
        <img
          src={macroImage}
          alt={node.title}
          className="w-full h-full object-cover filter brightness-90 contrast-125 transform scale-125 transition-transform duration-700 group-hover:scale-150"
          referrerPolicy="no-referrer"
        />

        {/* Viewfinder Crosshair Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Circular loupe lens border */}
          <div className="w-24 h-24 rounded-full border border-amber-500/40 bg-amber-500/5 backdrop-contrast-125 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            <Crosshair className="w-8 h-8 text-amber-500/60" />
            <div className="absolute top-1 text-[8px] font-mono text-amber-400 font-bold tracking-tighter">
              SCALE: 250%
            </div>
          </div>
        </div>

        {/* Viewfinder Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-500" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-500" />

        {/* Evidence Category Badge */}
        <div className="absolute bottom-2 left-2 z-10 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-xs border border-white/20 text-[9px] font-mono uppercase text-amber-400 font-bold">
          {node.type === 'clue' ? (clue?.type || 'EVIDENCE') : node.type.toUpperCase()}
        </div>
      </div>

      {/* Zoomed-In Details Body */}
      <div className="p-3.5 space-y-2.5 font-sans">
        {/* Title & Ref */}
        <div>
          <h3 className="text-sm font-bold text-white leading-tight tracking-tight flex items-center gap-1.5">
            {node.title}
          </h3>
          {clue && (
            <span className="text-[10px] font-mono text-[#888] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-amber-500" />
              Found at: <strong className="text-gray-300">{clue.locationFound}</strong>
            </span>
          )}
        </div>

        {/* Detailed Description */}
        <div className="bg-black/80 border border-white/10 rounded-sm p-2.5 space-y-1.5 text-xs text-[#d1d1d1] leading-relaxed">
          <p className="font-sans">
            {clue ? clue.description : (node.customText || node.subtitle || 'No detailed text recorded.')}
          </p>

          {/* Forensic Lab Analysis (if available) */}
          {clue?.detailedAnalysis && (
            <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-amber-300/90 font-mono space-y-0.5">
              <span className="text-[9px] font-bold text-amber-500 uppercase block tracking-wider">
                🔬 Forensics Breakdown:
              </span>
              <p>{clue.detailedAnalysis}</p>
            </div>
          )}
        </div>

        {/* Suspect Pointer Tags */}
        {clue && clue.pointsToSuspectIds && clue.pointsToSuspectIds.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xs p-2 text-[10px] font-mono text-amber-300 flex items-start gap-1.5">
            <Tag className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400 uppercase block">Implicates Suspects:</span>
              <span>
                {clue.pointsToSuspectIds
                  .map(id => caseFile.suspects.find(s => s.id === id)?.name || id)
                  .join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* Suspect Specific Info (if hovered node is suspect) */}
        {suspect && (
          <div className="bg-white/5 border border-white/10 rounded-xs p-2 space-y-1 text-[10px] font-mono text-gray-300">
            <div className="flex justify-between">
              <span className="text-[#888]">Role:</span>
              <span className="font-bold text-amber-400">{suspect.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888]">Relation:</span>
              <span>{suspect.relationToVictim}</span>
            </div>
            <div className="pt-1 border-t border-white/10 text-xs text-gray-200">
              <strong className="text-amber-500 block text-[9px] uppercase">Public Alibi:</strong>
              <p className="italic font-sans text-xs">{suspect.publicAlibi}</p>
            </div>
          </div>
        )}

        {/* Loupe footer tip */}
        <div className="text-[8px] font-mono text-center text-[#666] uppercase tracking-wider pt-1">
          ✦ Hover away to close loupe inspection ✦
        </div>
      </div>
    </motion.div>
  );
};
