import React, { useState } from 'react';

export const SearchPanel = ({ actions, style }: any) => {
  const [query, setQuery] = useState('');
  const [space, setSpace] = useState('Transformer Research');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      actions.emit('search_submitted', { query });
    }
  };

  return (
    <div 
      className="bg-[#0f172a] border-b border-slate-800 px-6 py-3 flex items-center justify-between gap-8 z-[9999] w-full pointer-events-auto"
      style={style}
    >
      {/* Logo & Space Switcher */}
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
          Agent K<span className="font-light"> Researcher</span>
        </h2>
        
        <div className="h-6 w-px bg-slate-700"></div>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <select 
            value={space}
            onChange={(e) => setSpace(e.target.value)}
            className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer appearance-none text-sm pr-4"
            style={{ WebkitAppearance: 'none' }}
          >
            <option value="Transformer Research" className="bg-slate-800">Transformer Research</option>
            <option value="Cancer Therapy" className="bg-slate-800">Cancer Therapy</option>
            <option value="AGI Alignment" className="bg-slate-800">AGI Alignment</option>
          </select>
          <svg className="w-4 h-4 text-slate-500 -ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
        <input 
          type="text" 
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Semantic Scholar..."
          className="w-full bg-slate-800/80 border border-slate-600 rounded-full py-2 px-4 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        />
        <svg 
          className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </form>
    </div>
  );
};
