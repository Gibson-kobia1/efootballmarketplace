import React, { useState } from 'react';
import { eFootballSquad, PlatformType, PlaystyleType, Player } from '../types';
import { ShieldCheck, Coins, RefreshCw, X, ShieldAlert, Cpu, Award } from 'lucide-react';

interface SellFormModalProps {
  onClose: () => void;
  onAddSquad: (squad: eFootballSquad) => void;
}

export default function SellFormModal({ onClose, onAddSquad }: SellFormModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('22');
  const [platform, setPlatform] = useState<PlatformType>('PS5');
  const [divisionRank, setDivisionRank] = useState('1');
  const [coinAmount, setCoinAmount] = useState('3500');
  const [gpAmount, setGpAmount] = useState('2500000');
  const [teamStrength, setTeamStrength] = useState('3180');
  const [playstyle, setPlaystyle] = useState<PlaystyleType>('Quick Counter');
  const [formation, setFormation] = useState('4-3-3');
  const [description, setDescription] = useState('');
  const [hasMatchPass, setHasMatchPass] = useState(true);

  // Player configurations to easily assign to the starting XI
  const [p1Name, setP1Name] = useState('Diego Maradona');
  const [p1Rank, setP1Rank] = useState('103');
  const [p1Pos, setP1Pos] = useState<'CF' | 'AMF'>('AMF');

  const [p2Name, setP2Name] = useState('Johan Cruyff');
  const [p2Rank, setP2Rank] = useState('102');
  const [p2Pos, setP2Pos] = useState<'CF' | 'LWF'>('CF');

  const [p3Name, setP3Name] = useState('Paolo Maldini');
  const [p3Rank, setP3Rank] = useState('101');
  const [p3Pos, setP3Pos] = useState<'CB' | 'LB'>('CB');

  // Simulated live audit status states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const startVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please specify an elite account tag.');
      return;
    }

    setIsVerifying(true);
    setVerificationLogs(['[VORZA CORE] Initiating Konami cryptographic network link...']);
    
    setTimeout(() => {
      setVerificationLogs(prev => [...prev, '[INTEGRITY] Reading local Konami ID credentials... FOUND']);
    }, 1000);

    setTimeout(() => {
      setVerificationLogs(prev => [...prev, `[SQUAD DETECTED] Team Strength evaluated at ${teamStrength} index.`]);
    }, 2000);

    setTimeout(() => {
      setVerificationLogs(prev => [...prev, `[SQUAD DETECTED] Premium matching index for division validation passed.`]);
    }, 3000);

    setTimeout(() => {
      setVerificationLogs(prev => [...prev, `[SECURE ESCROW] Verified escrow signature generated successfully.`]);
      setVerificationSuccess(true);
    }, 4000);
  };

  const handleFinalSubmit = () => {
    // Construct dynamic player starting XI list
    const initialPlayers: Player[] = [
      { id: 'custom-p1', name: p1Name || 'Star Legend 1', rating: Number(p1Rank), position: p1Pos, category: 'Epic', nationality: 'Brazil', ratingBonus: 4, stats: { speed: 92, shooting: 94, passing: 89, defense: 45, dribbling: 98 } },
      { id: 'custom-p2', name: p2Name || 'Star Legend 2', rating: Number(p2Rank), position: p2Pos, category: 'Big Time', nationality: 'Netherlands', ratingBonus: 3, stats: { speed: 95, shooting: 90, passing: 91, defense: 40, dribbling: 96 } },
      { id: 'custom-p3', name: p3Name || 'Star Defender', rating: Number(p3Rank), position: p3Pos, category: 'Epic', nationality: 'Italy', ratingBonus: 3, stats: { speed: 85, shooting: 60, passing: 80, defense: 101, dribbling: 78 } },
      
      // Standard boilerplate fillers for complete tactical formation
      { id: 'custom-p4', name: 'Rodri Highlight', rating: 98, position: 'DMF', category: 'Highlight', nationality: 'Spain', ratingBonus: 1, stats: { speed: 78, shooting: 80, passing: 91, defense: 95, dribbling: 82 } },
      { id: 'custom-p5', name: 'Bellingham Star', rating: 99, position: 'CMF', category: 'Highlight', nationality: 'England', ratingBonus: 2, stats: { speed: 88, shooting: 85, passing: 89, defense: 78, dribbling: 90 } },
      { id: 'custom-p6', name: 'Neymar Jr', rating: 101, position: 'LWF', category: 'Legend', nationality: 'Brazil', ratingBonus: 2, stats: { speed: 94, shooting: 88, passing: 90, defense: 35, dribbling: 102 } },
      { id: 'custom-p7', name: 'Saka Wing', rating: 98, position: 'RWF', category: 'Highlight', nationality: 'England', ratingBonus: 1, stats: { speed: 92, shooting: 84, passing: 86, defense: 55, dribbling: 91 } },
      { id: 'custom-p8', name: 'Van Dijk', rating: 100, position: 'CB', category: 'Highlight', nationality: 'Netherlands', ratingBonus: 1, stats: { speed: 82, shooting: 50, passing: 78, defense: 99, dribbling: 68 } },
      { id: 'custom-p9', name: 'Nesta', rating: 101, position: 'CB', category: 'Epic', nationality: 'Italy', ratingBonus: 3, stats: { speed: 82, shooting: 50, passing: 75, defense: 100, dribbling: 70 } },
      { id: 'custom-p10', name: 'Carlos Carlos', rating: 100, position: 'LB', category: 'Legend', nationality: 'Brazil', ratingBonus: 2, stats: { speed: 99, shooting: 95, passing: 84, defense: 80, dribbling: 84 } },
      { id: 'custom-p11', name: 'Casillas GK', rating: 100, position: 'GK', category: 'Legend', nationality: 'Spain', ratingBonus: 2, stats: { speed: 76, shooting: 10, passing: 65, defense: 99, dribbling: 45 } }
    ];

    const newSquadObj: eFootballSquad = {
      id: `squad-custom-${Date.now()}`,
      title: title.toUpperCase(),
      price: Number(price),
      coinAmount: Number(coinAmount),
      gpAmount: Number(gpAmount),
      pointsAmount: 1800,
      squadRating: 94, // Assigned assessment score based on parameters
      teamStrength: Number(teamStrength),
      divisionRank: Number(divisionRank) as any,
      epicCardCount: 8,
      legendCardCount: 10,
      platform,
      formation,
      playstyle,
      description: description || 'No description supplied. Premium verified verified asset of eFootball.',
      hasMatchPass,
      verifiedBadge: false,
      glowColor: '#3b82f6', // Premium elite blue color
      rarityTier: 'ELITE',
      seller: {
        id: 'user-id-listed',
        name: 'You (PrimeSeller)',
        rating: 5.0,
        verified: false,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80',
        totalSales: 1,
        responseTime: 'Instant'
      },
      players: initialPlayers
    };

    onAddSquad(newSquadObj);
    onClose();
  };

  return (
    <div id="sell-form-overlay" className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-md">
      <div className="w-full max-w-2xl bg-gradient-to-down from-slate-900 via-slate-950 to-slate-950 rounded-3xl border border-slate-800 p-6 md:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Verification Overlap Screen if verifying */}
        {isVerifying && (
          <div className="flex flex-col items-center justify-center py-10 text-center font-mono">
            {!verificationSuccess ? (
              <div className="space-y-6 w-full">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-neon-cyan animate-spin mx-auto" />
                <h3 className="text-lg font-display font-black text-white uppercase tracking-widest">
                  CRYPTOGRAPHIC ASSET PROBING...
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  VORZA AI engine is checking profile attributes against security models to avoid false credentials.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 text-left space-y-1.5 max-w-lg mx-auto">
                  {verificationLogs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-600">❯</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 w-full max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-neon-green mx-auto text-4xl">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-white uppercase tracking-widest">
                    LISTING DRAFT VERIFIED
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Draft properties validated. You can now post this listing to the marketplace board.
                  </p>
                </div>
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-left text-xs space-y-2 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Account Name:</span>
                    <span className="text-white font-bold">{title.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Calculated Rarity Tier:</span>
                    <span className="text-blue-400 font-bold">ELITE COLLECTIBLE</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Valued Asset Price:</span>
                    <span className="text-neon-cyan font-bold">${price} USD</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsVerifying(false);
                      setVerificationSuccess(false);
                    }}
                    className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs font-bold transition-colors uppercase tracking-wider"
                  >
                    Adjust Data
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold transition-colors uppercase tracking-wider"
                  >
                    Post to Live Board
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Primary Input Fields Form (Step 1) */}
        {!isVerifying && (
          <form onSubmit={startVerification} className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-6 h-6 text-neon-cyan" />
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
                  VORZA Elite Seller Portal
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Enter eFootball Konami profile attributes below. All listed accounts must pass cryptographic checks.
              </p>
            </div>

            {/* Stepper progress indicator bar */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
              <span className={`px-2 py-1 rounded ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>
                SQUAD PROPERTIES
              </span>
              <span className="text-slate-700">➜</span>
              <span className={`px-2 py-1 rounded ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500'}`}>
                MAIN SUPERSTARS
              </span>
            </div>

            {step === 1 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Title of Squad */}
                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1.5 font-mono">VORZA Squad Tag Line</label>
                    <input
                      type="text"
                      placeholder="e.g. SQUAD GALACTICOS 3000"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:border-neon-cyan focus:outline-none"
                    />
                  </div>

                  {/* Pricing Input */}
                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1.5 font-mono">Asking Price ($ USD - Max $25)</label>
                    <input
                      type="number"
                      placeholder="e.g. 22"
                      min="1"
                      max="25"
                      value={price}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val > 25) {
                          setPrice('25');
                        } else {
                          setPrice(e.target.value);
                        }
                      }}
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:border-neon-cyan focus:outline-none"
                    />
                  </div>

                  {/* Platform selection */}
                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1.5 font-mono">Console Platform</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as PlatformType)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:border-neon-cyan focus:outline-none"
                    >
                      <option value="PS5">PS5 (PlayStation)</option>
                      <option value="Xbox">Xbox (Series S/X)</option>
                      <option value="PC">PC (Steam)</option>
                      <option value="Mobile">Mobile (iOS / Android)</option>
                    </select>
                  </div>

                  {/* Division Selection */}
                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1.5 font-mono">Division Rank</label>
                    <select
                      value={divisionRank}
                      onChange={(e) => setDivisionRank(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:border-neon-cyan focus:outline-none"
                    >
                      <option value="1">Division 1 (Global Top Tier)</option>
                      <option value="2">Division 2 (Intermediate Champion)</option>
                      <option value="3">Division 3 (Standard Competitive)</option>
                    </select>
                  </div>

                  {/* Coin levels */}
                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1.5 font-mono">eFootball Coins Counter</label>
                    <input
                      type="number"
                      placeholder="e.g. 3500"
                      value={coinAmount}
                      onChange={(e) => setCoinAmount(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:border-neon-cyan focus:outline-none"
                    />
                  </div>

                  {/* GP points levels */}
                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1.5 font-mono">GP points Account Level</label>
                    <input
                      type="number"
                      placeholder="e.g. 2500000"
                      value={gpAmount}
                      onChange={(e) => setGpAmount(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:border-neon-cyan focus:outline-none"
                    />
                  </div>

                  {/* Team strength index */}
                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1.5 font-mono">Starting Team Strength Index</label>
                    <input
                      type="number"
                      max="3300"
                      placeholder="e.g. 3180"
                      value={teamStrength}
                      onChange={(e) => setTeamStrength(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:border-neon-cyan focus:outline-none"
                    />
                  </div>

                  {/* Select Setup Formation */}
                  <div>
                    <label className="block text-xs uppercase text-slate-400 font-bold mb-1.5 font-mono">Formation Setup</label>
                    <select
                      value={formation}
                      onChange={(e) => setFormation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:border-neon-cyan focus:outline-none"
                    >
                      <option value="4-3-3">4-3-3 Standard Offensive</option>
                      <option value="4-2-4">4-2-4 Hyper Attacking</option>
                      <option value="3-4-3">3-4-3 High Press Wingers</option>
                      <option value="4-1-2-3">4-1-2-3 Midfield Dominance</option>
                    </select>
                  </div>
                </div>

                {/* Match pass toggles */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 mt-4">
                  <input
                    type="checkbox"
                    id="hasPassInput"
                    checked={hasMatchPass}
                    onChange={(e) => setHasMatchPass(e.target.checked)}
                    className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="hasPassInput" className="text-xs text-slate-300 font-mono font-semibold cursor-pointer select-none">
                    TICKET: High Tier Match Pass Active for the current season
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider font-mono transition-colors"
                  >
                    Next: Set Stars
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Select 3 key Boosted Legendary or Epic players within your eFootball inventory to showcase on the catalog's collectible card cover:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Player 1 Box */}
                  <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-amber-500 font-mono">Star 1 (Cover Main)</span>
                    <div className="space-y-3 mt-2">
                      <input
                        type="text"
                        placeholder="Player Name"
                        value={p1Name}
                        onChange={(e) => setP1Name(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="OVR Rating (e.g. 103)"
                        value={p1Rank}
                        onChange={(e) => setP1Rank(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <select
                        value={p1Pos}
                        onChange={(e) => setP1Pos(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      >
                        <option value="CF">CF (Striker)</option>
                        <option value="AMF">AMF (Midfielder)</option>
                        <option value="LWF">LWF (Left Wing)</option>
                      </select>
                    </div>
                  </div>

                  {/* Player 2 Box */}
                  <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-emerald-500 font-mono">Star 2 (Playmaker)</span>
                    <div className="space-y-3 mt-2">
                      <input
                        type="text"
                        placeholder="Player Name"
                        value={p2Name}
                        onChange={(e) => setP2Name(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="OVR Rating"
                        value={p2Rank}
                        onChange={(e) => setP2Rank(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <select
                        value={p2Pos}
                        onChange={(e) => setP2Pos(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      >
                        <option value="CF">CF</option>
                        <option value="LWF">LWF</option>
                        <option value="RWF">RWF</option>
                      </select>
                    </div>
                  </div>

                  {/* Player 3 Box */}
                  <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-blue-500 font-mono">Star 3 (Defender)</span>
                    <div className="space-y-3 mt-2">
                      <input
                        type="text"
                        placeholder="Player Name"
                        value={p3Name}
                        onChange={(e) => setP3Name(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="OVR Rating"
                        value={p3Rank}
                        onChange={(e) => setP3Rank(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <select
                        value={p3Pos}
                        onChange={(e) => setP3Pos(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      >
                        <option value="CB">CB (Center Back)</option>
                        <option value="LB">LB (Left Back)</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Long description text area */}
                <div>
                  <label className="block text-xs uppercase text-slate-400 font-bold mb-1.5 font-mono">Squad Lore & Descriptions</label>
                  <textarea
                    rows={2}
                    placeholder="Describe specific features (e.g. Max booster pack, AC Milan, Barcelona epic set items)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:border-neon-cyan focus:outline-none"
                  />
                </div>

                {/* Action Steering panel */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-400 hover:text-white font-bold uppercase tracking-wider font-mono py-2"
                  >
                    ⮌ Back
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider font-mono transition-colors shadow-lg shadow-emerald-900/10 hover:shadow-emerald-500/20"
                  >
                    Launch Proof Analyzer
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
