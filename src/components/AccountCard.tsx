import React from 'react';
import { eFootballSquad } from '../types';
import { ShieldCheck, ArrowRight, Smartphone } from 'lucide-react';

interface AccountCardProps {
  key?: string | number;
  squad: eFootballSquad;
  onSelect: (squad: eFootballSquad) => void;
  onCompareToggle: (squadId: string) => void;
  isComparing: boolean;
  isWishlisted: boolean;
  onWishlistToggle: (squadId: string) => void;
}

export default function AccountCard({
  squad,
  onSelect,
  onCompareToggle,
  isComparing,
  isWishlisted,
  onWishlistToggle,
}: AccountCardProps) {
  // Glow effect mapping
  let glowOuterClass = 'glow-card-purple border-purple-500/30';
  if (squad.id === 'squad2') glowOuterClass = 'glow-card-red border-red-500/30';
  if (squad.id === 'squad3' || squad.id === 'squad4') glowOuterClass = 'glow-card-emerald border-emerald-500/30';

  return (
    <div
      id={`squad-card-${squad.id}`}
      className="relative group rounded-2xl p-[1px] bg-gradient-to-b from-slate-800 to-slate-950 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.8)]"
    >
      {/* Glow highlight behind card */}
      <div 
        className="absolute inset-x-0 top-0 h-44 opacity-20 group-hover:opacity-35 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${squad.glowColor || '#3b82f6'} 0%, transparent 70%)`
        }}
      />

      {/* Rarity Glow Border effect */}
      <div className={`absolute inset-0 rounded-2xl border ${glowOuterClass} opacity-40 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none`} />

      <div className="relative rounded-[15px] p-5 flex flex-col h-full bg-[#0d131f]/95 z-10">
        
        {/* Top Header Row with Platform & ID */}
        <div className="flex justify-between items-center mb-3.5">
          <span className="text-[10px] uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-neon-cyan" />
            {squad.platform} LINK
          </span>
        </div>

        {/* Squad Title */}
        <div className="mb-4">
          <h3 className="font-display font-black text-base text-white tracking-tight line-clamp-2 pr-2">
            {squad.title}
          </h3>
        </div>

        {/* Large, high-resolution visual proof screenshot. Visible Well! */}
        {squad.squadPreviewUrl && (
          <div 
            onClick={() => onSelect(squad)}
            className="relative w-full aspect-[16/10] mb-4.5 rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950/90 cursor-pointer group/screenshot"
          >
            <img 
              src={squad.squadPreviewUrl} 
              alt="Account Screenshot Verification Proof" 
              className="w-full h-full object-cover group-hover/screenshot:scale-[1.03] transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            {/* View Zoom Overlay Hint */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/screenshot:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs bg-black/80 text-neon-cyan font-mono border border-neon-cyan/20 px-3.5 py-1.5 rounded-xl flex items-center gap-1 uppercase tracking-wider font-bold">
                Inspect High-Res Proof
              </span>
            </div>
          </div>
        )}

        {/* Clean, authentic details block (Only verified escrow guarantees) */}
        <div className="space-y-2 mb-5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/40 text-xs font-mono">
          <div className="flex justify-between items-center text-slate-400">
            <span>Proof of ownership:</span>
            <span className="text-white font-bold text-[11px]">Screenshot Attached</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Escrow guarantee:</span>
            <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
              100% Secure
            </span>
          </div>
        </div>

        {/* Bottom Pricing & Navigation Actions row */}
        <div className="mt-auto pt-3.5 border-t border-slate-800/60 flex items-center justify-between">
          <div className="text-left">
            <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">ASKING PRICE</span>
            <span className="text-2xl font-display font-black text-white tracking-tight">
              ${squad.price}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSelect(squad)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-[11px] font-mono transition-all flex items-center gap-1 active:scale-95 shadow-md shadow-blue-900/10"
            >
              Verify Image <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onWishlistToggle(squad.id)}
              className={`py-2 px-3 rounded-xl border text-sm transition-all text-center flex items-center justify-center ${
                isWishlisted 
                  ? 'bg-red-500/10 text-red-500 border-red-500/30' 
                  : 'bg-transparent text-slate-500 border-slate-800 hover:border-slate-650 hover:text-slate-300'
              }`}
              title="Add to Wishlist"
            >
              ❤
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
