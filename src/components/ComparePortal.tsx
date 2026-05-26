import React from 'react';
import { eFootballSquad } from '../types';
import { ShieldCheck, Award, TrendingUp, GitCompare, Coins, Flame, Laptop, X } from 'lucide-react';

interface ComparePortalProps {
  squads: eFootballSquad[];
  compareIds: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onSelectSquadToInspect: (squad: eFootballSquad) => void;
}

export default function ComparePortal({
  squads,
  compareIds,
  onRemove,
  onClear,
  onSelectSquadToInspect,
}: ComparePortalProps) {
  // Filter the squads that correspond to comparison ids
  const compareSquads = squads.filter((s) => compareIds.includes(s.id));

  if (compareIds.length === 0) {
    return (
      <div id="compare-tab-empty" className="bg-slate-950/60 border border-slate-800 border-dashed rounded-2xl p-8 text-center max-w-xl mx-auto my-6">
        <GitCompare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
        <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">
          VORZA Compare Portal
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Add up to 3 eFootball accounts from the marketplace listings to perform a side-by-side statistical audit.
        </p>
      </div>
    );
  }

  return (
    <div id="compare-tab-dashboard" className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-5 overflow-hidden">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-display font-medium text-white uppercase tracking-wider">
              VORZA Account Auditor
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare epic balances, squad attributes, and value scores side-by-side.
          </p>
        </div>
        <button
          onClick={onClear}
          className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 font-mono py-1.5 px-3 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {compareSquads.map((squad) => (
          <div
            key={squad.id}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Corner Remove Button */}
            <button
              onClick={() => onRemove(squad.id)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              title="Remove from comparison"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Basic Info */}
            <div>
              <div className="mb-3">
                <span className="text-[9px] uppercase font-bold text-amber-500 font-mono tracking-wider">
                  {squad.rarityTier} Pack
                </span>
                <h3 className="text-md font-display font-bold text-white line-clamp-1 mt-0.5">
                  {squad.title}
                </h3>
                <div className="flex gap-2 items-center text-[10px] text-slate-400 mt-1">
                  <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300 font-mono">
                    {squad.platform}
                  </span>
                  <span>Div {squad.divisionRank}</span>
                  <span>•</span>
                  <span>{squad.formation}</span>
                </div>
              </div>

              {/* Statistical Value score indicators */}
              <div className="space-y-3 py-3 border-y border-slate-800/80 my-3 font-mono text-[11px]">
                
                {/* Team Strength comparing */}
                <div>
                  <div className="flex justify-between mb-0.5 font-semibold text-slate-400">
                    <span>TEAM STRENGTH</span>
                    <span className="text-white">{squad.teamStrength}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, ((squad.teamStrength - 2400) / 900) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Rating score comparing */}
                <div>
                  <div className="flex justify-between mb-0.5 font-semibold text-slate-400">
                    <span>VORZA RATING</span>
                    <span className="text-neon-cyan font-bold">{squad.squadRating}/100</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full">
                    <div
                      className="h-full bg-neon-cyan rounded-full"
                      style={{ width: `${squad.squadRating}%` }}
                    />
                  </div>
                </div>

                {/* Coins amount list */}
                <div className="flex justify-between py-1 bg-slate-950/40 px-2 rounded">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-400" /> COINS
                  </span>
                  <span className="text-amber-400 font-bold">{squad.coinAmount.toLocaleString()} eFC</span>
                </div>

                {/* GP amount list */}
                <div className="flex justify-between py-1 bg-slate-950/40 px-2 rounded">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Award className="w-3 h-3 text-slate-400" /> GP AMOUNT
                  </span>
                  <span className="text-slate-200 font-bold">
                    {squad.gpAmount >= 1000000 
                      ? `${(squad.gpAmount / 1000000).toFixed(1)}M` 
                      : squad.gpAmount.toLocaleString()}
                  </span>
                </div>

                {/* Epic count */}
                <div className="flex justify-between py-1 bg-slate-950/40 px-2 rounded">
                  <span className="text-slate-500 flex items-center gap-1">
                    <GitCompare className="w-3 h-3 text-purple-400" /> EPIC BOOSTERS
                  </span>
                  <span className="text-purple-400 font-bold">{squad.epicCardCount} Cards</span>
                </div>

                {/* Playstyle */}
                <div className="flex justify-between py-1 bg-slate-950/40 px-2 rounded">
                  <span className="text-slate-500">PLAYSTYLE</span>
                  <span className="text-slate-300">{squad.playstyle}</span>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div>
              <div className="my-3 flex justify-between items-center">
                <span className="text-slate-500 text-xs text-left">ESTIMATED ASSET PRICE</span>
                <span className="text-xl font-display font-black text-white">${squad.price}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono">
                <button
                  onClick={() => onSelectSquadToInspect(squad)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-[10px] uppercase text-center focus:outline-none"
                >
                  Tactics Board
                </button>
                <div className="text-[10px] text-center border border-slate-800 text-slate-400 py-2 rounded-lg bg-slate-950/50 flex items-center justify-center gap-0.5">
                  🛡️ Secure Trade
                </div>
              </div>
            </div>

          </div>
        ))}

        {compareSquads.length < 3 && (
          <div className="bg-slate-900/10 border-2 border-slate-800/40 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-600">
            <GitCompare className="w-8 h-8 text-slate-800 mb-2" />
            <span className="text-xs font-mono font-medium">Spot empty ({compareSquads.length}/3)</span>
            <p className="text-[10px] text-slate-400 px-4 mt-1">
              Add another high-tier squad card to inspect parallel values instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
