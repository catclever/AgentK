import React, { useState } from 'react';
import { DraggableNode } from '@agent-k/atoms';

export const PaperNode = ({ 
  id, 
  actions, 
  context,
  canvasProps,
  style, 
  isExpanded: initialExpanded, 
  isPinned: initialPinned, 
  title = 'Unknown Paper Title', 
  author = 'Unknown Author', 
  year = '2024', 
  citationCount = 0, 
  abstract = 'This is a mock abstract for the paper representing the expanded view of the node. In a real scenario, this would be fetched from Semantic Scholar.',
  isHidden
}: any) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded || false);
  const [isPinned, setIsPinned] = useState(initialPinned || false);

  if (isHidden) {
    return (
      <div 
        className="w-4 h-4 bg-slate-500 rounded-full border-2 border-slate-700 shadow-sm"
        style={style}
        title="Hidden Node"
      />
    );
  }

  // Pinned styling
  const borderStyle = isPinned 
    ? "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
    : "border-slate-700/50 hover:border-cyan-500/50";

  if (!isExpanded) {
    // COMPACT PILL VIEW
    return (
      <DraggableNode
        id={id}
        context={context}
        canvasProps={canvasProps}
        className={`group flex items-center gap-3 backdrop-blur-md bg-slate-800/80 rounded-full px-4 py-2 transition-shadow duration-300 border ${borderStyle}`}
        style={style}
      >
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]"></div>
        <span 
          className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 whitespace-nowrap cursor-pointer pointer-events-auto"
          onClick={(e) => {
             e.stopPropagation();
             setIsExpanded(true);
          }}
        >
          {author}, {year}
        </span>
        <div className="flex items-center gap-1 text-xs text-orange-400/80 font-mono bg-orange-400/10 px-2 py-0.5 rounded-full">
          🔥 {citationCount}
        </div>
      </DraggableNode>
    );
  }

  // EXPANDED CARD VIEW
  return (
    <DraggableNode
      id={id}
      context={context}
      canvasProps={canvasProps}
      className={`group relative backdrop-blur-md bg-slate-900/90 rounded-2xl p-6 transition-shadow duration-300 border ${borderStyle} w-[360px] flex flex-col gap-4 shadow-2xl`}
      style={style}
    >
      {/* Header Actions */}
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-lg font-bold text-slate-100 leading-snug">
          {title}
        </h3>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsPinned(!isPinned); }}
          className={`p-1.5 rounded-md transition-colors z-10 pointer-events-auto ${isPinned ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
          title="Pin / Bookmark"
        >
          <svg className="w-4 h-4" fill={isPinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-sm text-slate-400 font-mono">
        <span className="text-cyan-400/80">{author}</span>
        <span>•</span>
        <span>{year}</span>
        <span>•</span>
        <span className="text-orange-400/80">🔥 {citationCount}</span>
      </div>

      {/* Abstract */}
      <p className="text-sm text-slate-300 leading-relaxed overflow-hidden text-ellipsis line-clamp-4 cursor-text pointer-events-auto">
        {abstract}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-2 pt-4 border-t border-slate-700/50">
        <button 
          className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold py-2 rounded-lg border border-cyan-500/20 transition-colors pointer-events-auto"
          onClick={(e) => {
            e.stopPropagation();
            actions?.emit('expand_references', { sourceId: id });
          }}
        >
          Expand Citations
        </button>
        <button 
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg transition-colors border border-slate-700/50 pointer-events-auto"
          onClick={(e) => {
             e.stopPropagation();
             setIsExpanded(false);
          }}
          title="Collapse"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </DraggableNode>
  );
};
