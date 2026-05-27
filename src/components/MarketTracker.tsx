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
      const valuesList = ['$15', '$20', '$22', '$25', '$18'];
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



    </div>
  );
}
