import React from 'react';
import { eFootballSquad } from '../types';
import { ShieldCheck, Award, Flame, Coins, Zap, HardDrive, Smartphone, Monitor } from 'lucide-react';

interface AccountCardProps {
  key?: string;
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
  // Determine glow class and color scheme
  let glowOuterClass = 'glow-card-amber border-amber-500/30';
  let badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  let ratingGradient = 'from-amber-500 to-yellow-300';

  if (squad.rarityTier === 'ICONIC') {
    glowOuterClass = 'glow-card-emerald border-emerald-500/30';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    ratingGradient = 'from-emerald-500 to-teal-400';
  } else if (squad.rarityTier === 'EPIC') {
    glowOuterClass = 'glow-card-purple border-purple-500/30';
    badgeColor = 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    ratingGradient = 'from-purple-500 to-indigo-400';
  } else if (squad.rarityTier === 'ELITE') {
    glowOuterClass = 'glow-card-red border-red-500/30';
    badgeColor = 'text-red-400 bg-red-500/10 border-red-500/30';
    ratingGradient = 'from-red-500 to-pink-500';
  }

  // Find top 3 players
  const topPlayers = [...squad.players]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Platform icon helper
  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'PS5':
        return <Award className="w-4 h-4 text-blue-400 inline" />;
      case 'Xbox':
        return <Zap className="w-4 h-4 text-green-400 inline" />;
      case 'PC':
        return <Monitor className="w-4 h-4 text-slate-300 inline" />;
      case 'Mobile':
        return <Smartphone className="w-4 h-4 text-purple-400 inline" />;
      default:
        return null;
    }
  };

  return (
    <div
      id={`squad-card-${squad.id}`}
      className={`relative group rounded-2xl p-[1px] bg-gradient-to-b from-slate-800/80 to-slate-950/95 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_-5px_var(--glow)]`}
      style={{ '--glow': squad.glowColor } as React.CSSProperties}
    >
      {/* Dynamic Stadium light background layer */}
      <div 
        className="absolute inset-x-0 top-0 h-40 opacity-25 group-hover:opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${squad.glowColor} 0%, transparent 70%)`
        }}
      />

      {/* Rarity Glow Border effect on hover */}
      <div className={`absolute inset-0 rounded-2xl border ${glowOuterClass} opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

      {/* Ultimate Card Content */}
      <div className="relative shimmer-bg rounded-[15px] p-4 flex flex-col h-full z-10">
        {/* Top Header Badge Row */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${badgeColor}`}>
              ⚽ {squad.rarityTier}
            </span>
            {squad.hasMatchPass && (
              <span className="text-[9px] bg-sky-500/15 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                PASS
              </span>
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            {renderPlatformIcon(squad.platform)}
            <span className="font-semibold">{squad.platform}</span>
          </div>
        </div>

        {/* Squad Title & Division Badge info */}
        <div className="mb-4">
          <h3 className="font-display font-bold text-lg text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
            {squad.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-[11px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1" />
              <span>Div {squad.divisionRank} Elite</span>
            </div>
            <span className="text-slate-600 font-mono text-xs">|</span>
            <span className="text-xs text-slate-400 font-semibold">{squad.formation} Formation</span>
          </div>
        </div>

        {/* Live Verified Game Screenshot Proof */}
        {squad.squadPreviewUrl && (
          <div className="relative w-full aspect-[16/10] mb-4 rounded-xl overflow-hidden border border-slate-850 bg-slate-950/80 group/screenshot">
            <img 
              src={squad.squadPreviewUrl} 
              alt="Official In-Game Verified Screenshot" 
              className="w-full h-full object-cover group-hover/screenshot:scale-[1.04] transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Glossy Overlay Badge */}
            <div className="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur-md border border-emerald-400/40 text-[9px] text-white font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              VERIFIED PIC
            </div>
          </div>
        )}

        {/* Card Ultimate Collectible Interface (Hex Stats & Rating Badge) */}
        <div className="grid grid-cols-12 gap-3 items-center mb-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
          {/* Circular rating wheel representation */}
          <div className="col-span-4 flex flex-col items-center justify-center border-r border-slate-800/80 pr-1">
            <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-slate-950 border-2 border-slate-800/80 shadow-inner">
              {/* Spinning active ring on hover */}
              <div 
                className="absolute inset-0 rounded-full border border-dashed animate-[spin_20s_linear_infinite] opacity-40 group-hover:opacity-80 transition-opacity"
                style={{ borderColor: squad.glowColor }}
              />
              <span className={`text-2xl font-display font-bold bg-gradient-to-r ${ratingGradient} bg-clip-text text-transparent`}>
                {squad.squadRating}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1">VORZA RATING</span>
          </div>

          {/* Key statistical parameters */}
          <div className="col-span-8 space-y-2 pl-1">
            <div>
              <div className="flex justify-between text-[11px] mb-0.5 font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-500" /> Team Strength
                </span>
                <span className="font-bold text-white text-[12px]">{squad.teamStrength}</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-neon-green transition-all duration-500"
                  style={{ width: `${Math.min(100, ((squad.teamStrength - 2400) / 900) * 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-medium">
              <div className="flex flex-col">
                <span className="text-slate-500 text-[9px] uppercase">EPICS</span>
                <span className="text-fuchsia-400 font-bold">{squad.epicCardCount} Elite</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-500 text-[9px] uppercase">LEGENDS</span>
                <span className="text-amber-400 font-bold">{squad.legendCardCount} Max</span>
              </div>
            </div>
          </div>
        </div>

        {/* Star Superstars Showcase List */}
        <div className="mb-4">
          <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500 mb-2">TOP BOOSTED PLAYERS</p>
          <div className="flex flex-col gap-1.5">
            {topPlayers.map((p) => (
              <div 
                key={p.id} 
                className="flex justify-between items-center text-xs px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/40 hover:border-slate-700/60 transition-colors"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${
                    p.category === 'Big Time' ? 'bg-red-500/20 text-red-400' :
                    p.category === 'Epic' ? 'bg-fuchsia-500/20 text-fuchsia-400' :
                    p.category === 'Showtime' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {p.position}
                  </span>
                  <span className="text-slate-200 font-medium truncate">{p.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500 text-[9px] font-mono">OVR</span>
                  <span className="font-mono font-bold text-neon-cyan">{p.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Currency & Coin Indicators */}
        <div className="grid grid-cols-2 gap-2 py-2 px-2.5 rounded-xl bg-slate-950/80 border border-slate-800/60 mb-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 leading-none">GP AMOUNT</span>
              <span className="text-white font-bold text-[11px]">
                {squad.gpAmount >= 1000000 
                  ? `${(squad.gpAmount / 1000000).toFixed(1)}M` 
                  : squad.gpAmount.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-800/80 pl-2">
            <Award className="w-3.5 h-3.5 text-neon-cyan" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 leading-none">eFC COINS</span>
              <span className="text-neon-cyan font-bold text-[11px]">
                {squad.coinAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Seller info & Interactive buttons */}
        <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img 
              src={squad.seller.avatar} 
              alt={squad.seller.name} 
              className="w-7 h-7 rounded-full object-cover border border-slate-700/80"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 font-medium text-[10px]">
              <div className="flex items-center gap-0.5 text-slate-200">
                <span className="truncate max-w-[80px]">{squad.seller.name}</span>
                {squad.seller.verified && <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
              </div>
              <span className="text-slate-500">{squad.seller.totalSales} deals</span>
            </div>
          </div>

          <div className="font-display font-black text-xl text-white tracking-tight text-right shrink-0">
            ${squad.price}
          </div>
        </div>

        {/* Interactive Action Sliders */}
        <div className="grid grid-cols-12 gap-1.5 mt-3 pt-2 text-xs font-mono">
          <button
            onClick={() => onSelect(squad)}
            className="col-span-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-1.5 rounded-lg transition-all duration-200 uppercase tracking-wider text-[10px] text-center shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20 active:scale-95"
          >
            Tactics Board
          </button>
          <button
            onClick={() => onCompareToggle(squad.id)}
            className={`col-span-4 py-2 px-1 rounded-lg border text-[9px] uppercase font-bold tracking-wider transition-all text-center leading-normal ${
              isComparing 
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/40' 
                : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
            }`}
          >
            {isComparing ? 'Comparing' : 'Compare'}
          </button>
          <button
            onClick={() => onWishlistToggle(squad.id)}
            className={`col-span-2 py-2 rounded-lg border text-xs font-bold transition-all text-center flex items-center justify-center ${
              isWishlisted 
                ? 'bg-red-500/10 text-red-500 border-red-500/30' 
                : 'bg-transparent text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300'
            }`}
            title="Add to Wishlist"
          >
            ❤
          </button>
        </div>
      </div>
    </div>
  );
}
