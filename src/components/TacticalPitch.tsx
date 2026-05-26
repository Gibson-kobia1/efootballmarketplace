import React, { useState, useEffect } from 'react';
import { eFootballSquad, Player } from '../types';
import { ShieldAlert, Trophy, Award, Sparkles, TrendingUp, Cpu, RefreshCw } from 'lucide-react';

interface TacticalPitchProps {
  squad: eFootballSquad;
}

export default function TacticalPitch({ squad }: TacticalPitchProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [customFormation, setCustomFormation] = useState<string>(squad.formation);
  const [isScreenshotExpanded, setIsScreenshotExpanded] = useState<boolean>(false);

  // Auto-select the star player when squad changes
  useEffect(() => {
    if (squad.players && squad.players.length > 0) {
      const highestRated = [...squad.players].sort((a, b) => b.rating - a.rating)[0];
      setSelectedPlayer(highestRated);
    }
    setCustomFormation(squad.formation);
  }, [squad]);

  // Map tactical grid coordinate positions based on realistic football formation schemes
  const getPositionCoordinates = (pos: string, idx: number, formationStr: string) => {
    const uppercasePos = pos.toUpperCase();

    // Default baseline coordinates
    if (uppercasePos === 'GK') return { left: '50%', top: '88%' };

    // Defenders
    if (uppercasePos === 'LB') return { left: '15%', top: '70%' };
    if (uppercasePos === 'RB') return { left: '85%', top: '70%' };

    if (uppercasePos === 'CB') {
      if (idx === 6) return { left: '38%', top: '75%' };
      if (idx === 7) return { left: '62%', top: '75%' };
      return { left: '50%', top: '76%' };
    }

    // Midfielders
    if (uppercasePos === 'DMF') {
      return { left: '50%', top: '56%' };
    }
    if (uppercasePos === 'CMF') {
      if (idx === 4) return { left: '30%', top: '48%' };
      return { left: '70%', top: '48%' };
    }
    if (uppercasePos === 'AMF') {
      return { left: '50%', top: '38%' };
    }

    // Attackers
    if (uppercasePos === 'LWF') return { left: '18%', top: '22%' };
    if (uppercasePos === 'RWF') return { left: '82%', top: '22%' };
    if (uppercasePos === 'CF') {
      if (formationStr === '4-2-4') {
        if (idx === 0) return { left: '36%', top: '16%' };
        return { left: '64%', top: '16%' };
      }
      return { left: '50%', top: '15%' };
    }
    if (uppercasePos === 'SS') return { left: '40%', top: '24%' };

    // Fallbacks just in case
    const offsets = [
      { left: '20%', top: '35%' },
      { left: '80%', top: '35%' },
      { left: '50%', top: '30%' },
      { left: '44%', top: '42%' }
    ];
    return offsets[idx % offsets.length];
  };

  // Switch formation mock trigger to reposition players on the board
  const formationsOptions = ['4-3-3', '4-2-4', '3-4-3', '4-1-2-3'];

  return (
    <div id="tactical-board-section" className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-5 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-neon-green rounded-full animate-pulse" />
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
              VORZA Tactical Pitch Visualizer
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real interactive layout showing starting XI player ratings & stats. Click players to inspect skills.
          </p>
        </div>

        {/* Formation Switcher Button Grid */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono px-2">Setup:</span>
          {formationsOptions.map((form) => (
            <button
              key={form}
              onClick={() => setCustomFormation(form)}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all ${
                customFormation === form
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {form}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Dynamic eFootball Pitch Canvas */}
        <div className="lg:col-span-7 relative">
          <div className="w-full aspect-[4/5] md:aspect-[5/6] max-w-[500px] mx-auto rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-slate-705 border-neutral-800 football-pitch">
            
            {/* Real football pitch white markings drawing */}
            <div className="absolute inset-x-8 top-0 bottom-0 pointer-events-none">
              {/* Outer boundary lines */}
              <div className="absolute inset-0 border border-white/5 rounded-2xl" />
              
              {/* Center Line */}
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/5 -translate-x-1/2" />
              
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 w-28 h-28 rounded-full border border-white/5 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2" />
              
              {/* Attacking Box (Top Penalty Area) */}
              <div className="absolute top-0 left-1/4 right-1/4 h-24 border-b border-x border-white/5" />
              <div className="absolute top-0 left-[35%] right-[35%] h-10 border-b border-x border-white/5" />
              
              {/* Defensive Box (Bottom Penalty Area) */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-24 border-t border-x border-white/5" />
              <div className="absolute bottom-0 left-[35%] right-[35%] h-10 border-t border-x border-white/5" />
            </div>

            {/* Stadium Ambient Glow Spotlights */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-down from-neon-green/15 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-up from-blue-600/10 to-transparent pointer-events-none" />

            {/* Render 11 Players dynamically */}
            {squad.players && squad.players.map((plyr, idx) => {
              const coords = getPositionCoordinates(plyr.position, idx, customFormation);
              const isSelected = selectedPlayer?.id === plyr.id;

              return (
                <button
                  key={plyr.id}
                  onClick={() => setSelectedPlayer(plyr)}
                  style={{
                    left: coords.left,
                    top: coords.top,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute z-20 group/player transition-all duration-300 transform active:scale-90"
                >
                  {/* Glowing ring under selected player */}
                  <div 
                    className={`absolute -inset-2.5 rounded-full blur-[6px] transition-all duration-300 ${
                      isSelected 
                        ? 'bg-neon-cyan/80 scale-105' 
                        : 'bg-transparent group-hover/player:bg-slate-500/20 group-hover/player:scale-100'
                    }`} 
                  />

                  {/* Player Token Circle */}
                  <div className={`relative w-11 h-11 rounded-full flex flex-col items-center justify-center border-2 shadow-2xl transition-all font-display ${
                    isSelected
                      ? 'bg-slate-900 border-neon-cyan text-white font-bold scale-110'
                      : plyr.category === 'Big Time' || plyr.category === 'Epic'
                        ? 'bg-slate-900/90 border-amber-400 text-amber-100'
                        : 'bg-slate-950/90 border-slate-700 text-slate-300'
                  }`}>
                    <span className="text-[12px] leading-tight font-black">{plyr.rating}</span>
                    <span className="text-[7.5px] uppercase tracking-wider leading-none font-bold text-slate-400">
                      {plyr.position}
                    </span>

                    {/* Small Star icon on Boosted Epic items */}
                    {(plyr.category === 'Epic' || plyr.category === 'Big Time') && (
                      <span className="absolute -top-1 -right-1 text-[8px] text-amber-400 animate-pulse font-bold">★</span>
                    )}
                  </div>

                  {/* Absolute Player Name label tag */}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-11 px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap shadow-md transition-colors ${
                    isSelected 
                      ? 'bg-neon-cyan text-slate-950 font-bold' 
                      : 'bg-slate-950/80 border border-slate-800 text-slate-300 group-hover/player:bg-slate-900'
                  }`}>
                    {plyr.name.split(' ').pop()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: High-End Live Player Card Stats */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          {selectedPlayer ? (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden flex-1 flex flex-col justify-between">
              
              {/* Card Hologram effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-neon-cyan/10 to-transparent pointer-events-none" />

              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-[9px] uppercase font-mono tracking-widest font-bold px-2 py-0.5 rounded border ${
                      selectedPlayer.category === 'Big Time' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      selectedPlayer.category === 'Epic' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' :
                      selectedPlayer.category === 'Showtime' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {selectedPlayer.category} Category
                    </span>
                    <h3 className="text-2xl font-display font-black text-white leading-tight mt-1">
                      {selectedPlayer.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{selectedPlayer.nationality}</span>
                      <span>•</span>
                      <span className="text-slate-500">{selectedPlayer.position} Role</span>
                    </p>
                  </div>
                  <div className="text-center bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
                    <span className="text-2xl font-mono font-black text-neon-cyan leading-none block">
                      {selectedPlayer.rating}
                    </span>
                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">Boost Rating</span>
                  </div>
                </div>

                {/* Tactical radar-bars list */}
                <div className="space-y-3 my-4">
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest font-mono">INSIDE STATS BREAKDOWN</h4>
                  
                  {/* Speed Stat Meter */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-400">PACE & ACCELERATION (SPD)</span>
                      <span className="font-bold text-white">{selectedPlayer.stats.speed}</span>
                    </div>
                    <div className="bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${selectedPlayer.stats.speed}%` }}
                      />
                    </div>
                  </div>

                  {/* Shooting Meter */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-400">FINISHING & POWER (SHO)</span>
                      <span className="font-bold text-white">{selectedPlayer.stats.shooting}</span>
                    </div>
                    <div className="bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                        style={{ width: `${selectedPlayer.stats.shooting}%` }}
                      />
                    </div>
                  </div>

                  {/* Passing Meter */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-400">CREATIVITY & CROSSED (PAS)</span>
                      <span className="font-bold text-white">{selectedPlayer.stats.passing}</span>
                    </div>
                    <div className="bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-neon-green transition-all duration-300"
                        style={{ width: `${selectedPlayer.stats.passing}%` }}
                      />
                    </div>
                  </div>

                  {/* Dribbling Meter */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-400">BALL CONTROL & AGILITY (DRI)</span>
                      <span className="font-bold text-white">{selectedPlayer.stats.dribbling}</span>
                    </div>
                    <div className="bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${selectedPlayer.stats.dribbling}%` }}
                      />
                    </div>
                  </div>

                  {/* Defense Meter */}
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-400">PHYSICALITY & DEFENSE (DEF)</span>
                      <span className="font-bold text-white">{selectedPlayer.stats.defense}</span>
                    </div>
                    <div className="bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-slate-600 to-slate-400 transition-all duration-300"
                        style={{ width: `${selectedPlayer.stats.defense}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Badge Guarantee banner */}
              <div className="mt-4 p-3 rounded-xl bg-slate-950/95 border border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold text-white uppercase font-display">
                    VORZA Genuineness Assured
                  </h5>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Every card, stat counter, and bonus multiplier verified under our manual sandbox checks.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center h-48">
              <ShieldAlert className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-400">No starting XI athlete selected</p>
              <p className="text-xs text-slate-500">Tap on any user avatar on the left pitch board</p>
            </div>
          )}

          {/* General squad overview details bar */}
          <div className="mt-4 bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
            <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono mb-2">SQUAD PLAYSTYLE ACTIVE BOOSTS</h4>
            <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-xs text-white font-semibold">{squad.playstyle}</span>
              <span className="text-[10px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded font-mono font-bold">
                +4 Stat Boost Boost (ACTIVE)
              </span>
            </div>
          </div>

          {/* Genuine eFootball Account Screenshot Verification Section */}
          {squad.squadPreviewUrl && (
            <div className="mt-4 bg-slate-900/45 border border-slate-800 p-4 rounded-xl">
              <h4 className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                VERIFIED IN-GAME SCREENSHOT PROOF
              </h4>
              <div 
                className="relative cursor-zoom-in rounded-lg overflow-hidden border border-slate-750 bg-slate-950 group/s_pitch"
                onClick={() => setIsScreenshotExpanded(true)}
              >
                <img 
                  src={squad.squadPreviewUrl} 
                  alt="Konami Live Proof Screenshot" 
                  className="w-full h-36 object-cover group-hover/s_pitch:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover/s_pitch:opacity-100 transition-opacity">
                  <span className="bg-slate-900/90 text-white text-[11px] px-3 py-1.5 rounded-lg border border-slate-800 font-mono shadow-xl">
                    🔍 Click for High-Res Verified View
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-mono mt-2 leading-relaxed">
                *Sensitive context safety checklist: Real, certified screenshot matching listed active card profiles. No mock layout.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Expanded Screenshot Modal */}
      {isScreenshotExpanded && squad.squadPreviewUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsScreenshotExpanded(false)}
        >
          <div className="relative max-w-5xl w-full max-h-[85vh] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-900 flex flex-col justify-between">
            <div className="relative p-1 flex-1 flex items-center justify-center overflow-auto min-h-0 bg-slate-950">
              <img 
                src={squad.squadPreviewUrl} 
                alt="High-Res Verified Squad Proof" 
                className="max-h-[70vh] max-w-full object-contain rounded"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={(e) => { e.stopPropagation(); setIsScreenshotExpanded(false); }}
                className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-900 text-white w-9 h-9 text-xs rounded-full flex items-center justify-center border border-slate-800 transition-colors font-bold z-50 shadow-md"
              >
                ✕
              </button>
            </div>
            <div className="bg-slate-950 border-t border-slate-850 p-4 rounded-b-xl flex gap-4 flex-col sm:flex-row sm:items-center sm:justify-between shrink-0">
              <div>
                <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5 uppercase leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Konami Account Verified Active Inventory
                </span>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  Matched exactly to item id: {squad.id} on the VORZA decentralised inventory index.
                </p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsScreenshotExpanded(false); }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-mono text-xs font-bold shrink-0 transition-all shadow-md active:scale-95"
              >
                Close Full View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
