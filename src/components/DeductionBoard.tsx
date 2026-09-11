import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  Pin, 
  Plus, 
  Trash2, 
  Share2, 
  User, 
  FileText, 
  Flame, 
  RotateCcw,
  Tag,
  Link as LinkIcon,
  ZoomIn
} from 'lucide-react';
import { CorkNode, CorkConnection, CaseFile, Clue, Suspect } from '../types';
import { EvidenceMagnifier } from './EvidenceMagnifier';
import { soundFx } from '../lib/audio';

interface DeductionBoardProps {
  caseFile: CaseFile;
  corkNodes: CorkNode[];
  corkConnections: CorkConnection[];
  onUpdateNodes: (nodes: CorkNode[]) => void;
  onUpdateConnections: (connections: CorkConnection[]) => void;
  onOpenAccuseModal: () => void;
}

export const DeductionBoard: React.FC<DeductionBoardProps> = ({
  caseFile,
  corkNodes,
  corkConnections,
  onUpdateNodes,
  onUpdateConnections,
  onOpenAccuseModal
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [connectionLabel, setConnectionLabel] = useState('Disproves Alibi');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const hoveredNode = corkNodes.find(n => n.id === hoveredNodeId);

  // Auto-populate initial board if empty
  const handleAutoPopulate = () => {
    const newNodes: CorkNode[] = [];

    // Add Suspects
    caseFile.suspects.forEach((suspect, index) => {
      newNodes.push({
        id: `node-suspect-${suspect.id}`,
        type: 'suspect',
        title: suspect.name,
        subtitle: suspect.title,
        x: 60 + (index * 210),
        y: 60,
        color: '#e2b36f',
        refId: suspect.id
      });
    });

    // Add Discovered Clues
    const discoveredClues = caseFile.clues.filter(c => c.isDiscovered);
    discoveredClues.forEach((clue, index) => {
      newNodes.push({
        id: `node-clue-${clue.id}`,
        type: 'clue',
        title: clue.title,
        subtitle: `${clue.type.toUpperCase()} • ${clue.locationFound}`,
        x: 80 + ((index % 4) * 220),
        y: 280 + (Math.floor(index / 4) * 160),
        color: clue.type === 'physical' ? '#38bdf8' : '#a7f3d0',
        refId: clue.id
      });
    });

    onUpdateNodes(newNodes);
  };

  // Add custom player sticky note
  const handleAddCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNode: CorkNode = {
      id: `node-note-${Date.now()}`,
      type: 'note',
      title: 'Detective Theory Note',
      subtitle: newNoteText.trim(),
      x: 120 + Math.floor(Math.random() * 300),
      y: 120 + Math.floor(Math.random() * 200),
      color: '#fde047',
      isCustomNote: true,
      customText: newNoteText.trim()
    };

    onUpdateNodes([...corkNodes, newNode]);
    setNewNoteText('');
  };

  // Create red string connection between nodes
  const handleNodeClickForConnection = (nodeId: string) => {
    if (!connectSourceId) {
      setConnectSourceId(nodeId);
    } else if (connectSourceId !== nodeId) {
      const newConn: CorkConnection = {
        id: `conn-${Date.now()}`,
        fromId: connectSourceId,
        toId: nodeId,
        label: connectionLabel,
        color: '#dc2626' // red yarn string
      };
      onUpdateConnections([...corkConnections, newConn]);
      setConnectSourceId(null);
    } else {
      setConnectSourceId(null);
    }
  };

  const handleDeleteNode = (id: string) => {
    onUpdateNodes(corkNodes.filter(n => n.id !== id));
    onUpdateConnections(corkConnections.filter(c => c.fromId !== id && c.toId !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const getNodePos = (id: string) => {
    const node = corkNodes.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return { x: node.x + 90, y: node.y + 40 }; // center point of card
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0c0c0d] border border-white/10 rounded-sm p-4 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] font-bold">
            Visual Case Reconstruction
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            <Share2 className="w-5 h-5 text-amber-500" />
            DEDUCTION CORKBOARD
          </h2>
        </div>

        {/* Toolbar buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={handleAutoPopulate}
            className="px-3 py-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-[#d1d1d1] border border-white/10 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Auto-Pin Clues</span>
          </button>

          {/* Connection Mode Toggle */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-sm border border-white/10">
            <span className="text-[#777] text-[9px] uppercase font-bold px-1">Yarn String:</span>
            <select
              value={connectionLabel}
              onChange={(e) => setConnectionLabel(e.target.value)}
              className="bg-black/60 border border-white/10 text-amber-400 text-xs rounded-xs px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="Disproves Alibi">Disproves Alibi</option>
              <option value="Possesses Weapon">Possesses Weapon</option>
              <option value="Has Motive">Has Motive</option>
              <option value="Seen At Scene">Seen At Scene</option>
              <option value="Red Herring">Red Herring</option>
            </select>
            <span className="text-[10px] text-amber-500 px-2">
              {connectSourceId ? 'Click target node to tie string' : 'Click node to start string'}
            </span>
          </div>

          <button
            onClick={onOpenAccuseModal}
            className="px-3.5 py-1.5 rounded-sm bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow border border-red-500 flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-white" />
            <span>Form Indictment</span>
          </button>
        </div>
      </div>

      {/* Custom Note Add Bar */}
      <form onSubmit={handleAddCustomNote} className="flex items-center gap-2 bg-[#0c0c0d] p-3 rounded-sm border border-white/10">
        <input
          type="text"
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Type a custom theory sticky note (e.g. 'Evelyn's alibi fails between 11:20 and 11:55 PM')..."
          className="flex-1 bg-black/60 border border-white/10 rounded-sm px-3.5 py-2 text-xs text-white placeholder-[#777] focus:outline-none focus:border-amber-500 font-sans"
        />
        <button
          type="submit"
          disabled={!newNoteText.trim()}
          className="px-4 py-2 rounded-sm bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border border-red-500"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Sticky Note</span>
        </button>
      </form>

      {/* The Corkboard Canvas */}
      <div className="relative w-full h-[600px] bg-[#1a1310] border border-white/10 rounded-sm shadow-2xl overflow-hidden select-none p-4">
        {/* Corkboard Radial Dot Grid Pattern Texture */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#2d201a 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* SVG Canvas overlay for yarn strings */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {corkConnections.map(conn => {
            const p1 = getNodePos(conn.fromId);
            const p2 = getNodePos(conn.toId);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g key={conn.id}>
                {/* Red Yarn Line */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#b91c1c"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                  className="drop-shadow-md"
                />
                {/* Yarn Tag Label */}
                {conn.label && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-45"
                      y="-10"
                      width="90"
                      height="20"
                      rx="2"
                      fill="#080808"
                      stroke="#dc2626"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill="#f59e0b"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {conn.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Render Cork Nodes */}
        {corkNodes.map(node => {
          const isConnectingFrom = connectSourceId === node.id;
          const isHovered = hoveredNodeId === node.id;

          return (
            <div
              key={node.id}
              onClick={() => handleNodeClickForConnection(node.id)}
              onMouseEnter={() => {
                setHoveredNodeId(node.id);
                soundFx.playPaperRustle();
              }}
              onMouseLeave={() => setHoveredNodeId(null)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`
              }}
              className={`absolute z-20 w-44 rounded-sm p-3 shadow-2xl border transition-all cursor-pointer transform ${
                isHovered ? 'scale-105 z-30 shadow-[0_10px_25px_rgba(0,0,0,0.8)]' : 'hover:scale-[1.03]'
              } ${
                isConnectingFrom
                  ? 'ring-2 ring-red-500 border-red-500 bg-red-950 text-white'
                  : node.type === 'suspect'
                  ? 'bg-[#f2efe9] text-gray-900 border border-gray-300'
                  : node.type === 'note'
                  ? 'bg-[#fef3c7] text-gray-900 border border-amber-300 rotate-1'
                  : 'bg-white text-gray-900 border-l-4 border-l-red-600 border-y border-r border-gray-300'
              }`}
            >
              {/* Pushpin at top center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                <div className="w-4 h-4 rounded-full bg-red-600 border border-white shadow-md flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              </div>

              {/* Hover Magnifier Indicator Badge */}
              <div 
                className="absolute top-1 right-1 text-gray-400 hover:text-amber-600 opacity-60 hover:opacity-100 transition-opacity"
                title="Hover for Loupe Magnification"
              >
                <ZoomIn className="w-3 h-3 text-amber-600" />
              </div>

              {/* Card Header & Delete Button */}
              <div className="flex items-center justify-between mb-1 pt-1 pr-3">
                <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-gray-600 flex items-center gap-1">
                  {node.type === 'suspect' && <User className="w-3 h-3 text-red-600" />}
                  {node.type === 'clue' && <FileText className="w-3 h-3 text-red-600" />}
                  {node.type}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNode(node.id);
                  }}
                  className="text-gray-400 hover:text-red-600 p-0.5 cursor-pointer"
                  title="Remove from board"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Title & Subtitle */}
              <h4 className="font-bold text-xs leading-snug line-clamp-2 text-gray-900 pr-1">
                {node.title}
              </h4>

              {node.type === 'suspect' && (() => {
                const suspect = caseFile.suspects.find(s => s.id === node.refId || s.name === node.title);
                if (suspect?.imageUrl) {
                  return (
                    <div className="w-full h-16 my-1.5 bg-black rounded-xs overflow-hidden border border-gray-400/80 shadow-inner relative group">
                      <img
                        src={suspect.imageUrl}
                        alt={suspect.name}
                        className="w-full h-full object-cover filter contrast-125 grayscale"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-0 right-0 bg-black/80 text-[7px] font-mono text-amber-400 font-bold px-1 py-0.2 uppercase">
                        AI PHOTO
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {node.subtitle && (
                <p className="text-[10px] font-mono text-gray-600 mt-1 line-clamp-3 leading-tight">
                  {node.subtitle}
                </p>
              )}

              {/* Node action hint */}
              <div className="mt-2 pt-1 border-t border-gray-300/80 text-[8px] font-mono text-center text-gray-500 font-bold uppercase flex items-center justify-center gap-1">
                <ZoomIn className="w-2.5 h-2.5 text-amber-600" />
                <span>{isConnectingFrom ? 'Select Target' : 'Hover: Zoom'}</span>
              </div>
            </div>
          );
        })}

        {/* Mouse Hover Magnifier Popover */}
        <AnimatePresence>
          {hoveredNode && (
            <EvidenceMagnifier
              node={hoveredNode}
              caseFile={caseFile}
              position={{ x: hoveredNode.x, y: hoveredNode.y }}
            />
          )}
        </AnimatePresence>

        {corkNodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#777] font-mono space-y-3 pointer-events-none">
            <Pin className="w-10 h-10 text-amber-500/40 animate-bounce" />
            <p className="text-sm">The Corkboard is currently empty.</p>
            <p className="text-xs text-[#777]">Click "Auto-Pin Clues" above or pin evidence from the Investigation tab.</p>
          </div>
        )}
      </div>
    </div>
  );
};
