import React, { useState, useEffect } from 'react';
import { MOCK_ACTIVITIES, SQUAD_CATEGORIES } from '../data';
import { ShieldCheck, Flame, Coins, Trophy, Calendar, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { LiveActivity } from '../types';

export default function MarketTracker() {
  const [activities, setActivities] = useState<LiveActivity[]>(MOCK_ACTIVITIES);

  // Live Simulation: periodically push an extra mock ticker transaction
  useEffect(() => {
    const handleSimulateTick = () => {
      const usersList = ['Kofi_eF', 'Sandro99', 'UtsavPrime', 'GamerFC', 'GiggsBooster', 'Tactician_Z'];
      const squadsNames = ['SQUAD VENOM', 'TOKYO BOOSTER', 'ROMA LEGENDS', 'SQUAD ZERO GRAVITY', 'GALACTICOS X'];
      const valuesList = ['$65', '$120', '$220', '$350', '$145'];
      const actionTypes = ['sale', 'listing', 'offer'] as const;

      const randomUser = usersList[Math.floor(Math.random() * usersList.length)];
      const randomSquad = squadsNames[Math.floor(Math.random() * squadsNames.length)];
      const randomValue = valuesList[Math.floor(Math.random() * valuesList.length)];
      const randomAction = actionTypes[Math.floor(Math.random() * actionTypes.length)];

      const newAct: LiveActivity = {
        id: `act-dyn-${Date.now()}`,
        timestamp: 'Just now',
        type: randomAction,
        user: randomUser,
        squadName: randomSquad,
        value: randomAction === 'listing' ? randomValue : `${randomValue} Accepted`
      };

      setActivities(prev => [newAct, ...prev.slice(0, 5)]);
    };

    const intervalId = setInterval(handleSimulateTick, 9000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div id="stats-and-trust-section" className="space-y-6">
      
      {/* 4. Marketplace Statistics Grid Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute right-2 bottom-2 font-black font-display text-4xl text-slate-800/20 group-hover:text-slate-800/30 transition-colors select-none">
            SQD
          </div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold">TOTAL VETTED SQUADS</p>
          <p className="text-3xl font-display font-black text-white mt-1">1,410</p>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5 mt-1.5 font-bold">
            ⚡ +18 active today
          </span>
        </div>

        {/* Stat 2 */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute right-2 bottom-2 font-black font-display text-4xl text-slate-800/20 group-hover:text-slate-800/30 transition-colors select-none">
            BYR
          </div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold">ACTIVE PLATFORM BUYERS</p>
          <p className="text-3xl font-display font-black text-white mt-1">9,842</p>
          <span className="text-[10px] text-neon-cyan font-mono flex items-center gap-0.5 mt-1.5 font-bold">
            ⚡ 2,410 online now
          </span>
        </div>

        {/* Stat 3 */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute right-2 bottom-2 font-black font-display text-4xl text-slate-800/20 group-hover:text-slate-800/30 transition-colors select-none">
            COIN
          </div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold">eFC COINS TRADED</p>
          <p className="text-3xl font-display font-black text-amber-400 mt-1">84.2M</p>
          <span className="text-[10px] text-amber-400 font-mono flex items-center gap-0.5 mt-1.5 font-bold">
            ⚡ 340,000 avg deal
          </span>
        </div>

        {/* Stat 4 */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="absolute right-2 bottom-2 font-black font-display text-4xl text-slate-800/20 group-hover:text-slate-800/30 transition-colors select-none">
            ESC
          </div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold">SECURED VOLUMES</p>
          <p className="text-3xl font-display font-black text-white mt-1">$428K</p>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5 mt-1.5 font-bold">
            ✓ 100% Escrow Delivery
          </span>
        </div>
      </div>

      {/* 3. Trending Marketplace Activity Feed */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-red-500 animate-pulse" />
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
            VORZA Real-Time Transmission Log
          </h3>
          <span className="text-[10px] font-mono bg-red-500/15 text-red-400 border border-red-500/20 rounded px-2 font-bold ml-auto uppercase tracking-widest">
            LIVE TRANSACTIONS
          </span>
        </div>

        {/* Scrollable feed list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="px-3.5 py-2 rounded-xl bg-slate-900/50 border border-slate-850 border-slate-800/60 font-mono text-xs flex justify-between items-center transition-all duration-300 hover:bg-slate-900"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 font-bold truncate">
                  🕵️ {act.user}
                </span>
                <span className="font-semibold text-[11px] text-slate-200 truncate mt-0.5">
                  {act.squadName}
                </span>
              </div>
              <div className="text-right shrink-0 ml-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  act.type === 'sale' ? 'bg-emerald-500/10 text-emerald-400' :
                  act.type === 'listing' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-400/10 text-amber-300'
                }`}>
                  {act.type}
                </span>
                <p className="text-[11px] font-bold text-white mt-1">{act.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Trust, Escrow & Secured Payment Section */}
      <div className="bg-radial-stadium border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-mono tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full px-3 py-1 font-bold">
            AUTHENTIFIED ESCROW GUARANTEE
          </span>
          <h3 className="text-2xl font-display font-black text-white uppercase tracking-wider leading-tight">
            WORLD CLASS eFOOTBALL ESCROW SIGNING
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            No risks. VORZA manages account validations and ensures immediate transfer of the PlayStation, Xbox, Steam or eFootball Konami ID.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Security Factor 1 */}
          <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl text-left space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-neon-cyan flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <h4 className="text-sm font-display font-bold text-white uppercase">VETTED eFOOTBALL PORTAL</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Every seller account listed undergoes verified profile checking to confirm total GP, Coin quantities, and active Booster Player levels. Safe and transparent.
            </p>
          </div>

          {/* Security Factor 2 */}
          <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl text-left space-y-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-fuchsia-400 flex items-center justify-center text-xl font-bold">
              🪙
            </div>
            <h4 className="text-sm font-display font-bold text-white uppercase">CRYPTO CRYPTOGRAPHIC ESCROW</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              We accept instantaneous stablecoins (USDT, USDC) and Ethereum alongside credit/debit card points. Funds remain safe in escrow until verification is sealed.
            </p>
          </div>

          {/* Security Factor 3 */}
          <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl text-left space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-neon-green flex items-center justify-center text-xl font-bold">
              🛡️
            </div>
            <h4 className="text-sm font-display font-bold text-white uppercase">VORZA ESCROW ASSURANCE</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Our 24/7 dedicated game moderators check ownership transfers directly within 10 minutes. 100% moneyback scam protection guaranteed.
            </p>
          </div>
        </div>

        {/* Crypto Logos and Badge Tickers */}
        <div className="pt-4 border-t border-slate-900 flex flex-wrap justify-center items-center gap-6 text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">
          <span>🛡️ Verified eFootball Partner</span>
          <span>•</span>
          <span>💳 Escrow Assured</span>
          <span>•</span>
          <span>₿ USDT / BTC Support</span>
          <span>•</span>
          <span>⚡ Instant delivery</span>
        </div>
      </div>

    </div>
  );
}
