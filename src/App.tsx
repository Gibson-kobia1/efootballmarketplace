import React, { useState, useEffect } from 'react';
import { INITIAL_SQUADS, MOCK_REVIEWS } from './data';
import { eFootballSquad, PlatformType, PlaystyleType } from './types';
import AccountCard from './components/AccountCard';
import ComparePortal from './components/ComparePortal';
import MarketTracker from './components/MarketTracker';
import { 
  Trophy, 
  Coins, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Hash, 
  Sparkles, 
  Award, 
  Compass, 
  Layers, 
  TrendingUp, 
  Tv, 
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Gavel
} from 'lucide-react';

export default function App() {
  // Local state persistence
  const [squads, setSquads] = useState<eFootballSquad[]>(() => {
    const saved = localStorage.getItem('vorza_squads_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as eFootballSquad[];
        // Force reset cache if outdated details, prices, or count is mismatching
        const priceMismatch = parsed.some((s, idx) => INITIAL_SQUADS[idx] && s.price !== INITIAL_SQUADS[idx].price);
        const titleMismatch = parsed.some((s, idx) => INITIAL_SQUADS[idx] && s.title !== INITIAL_SQUADS[idx].title);
        const screenshotMismatch = parsed.some((s, idx) => INITIAL_SQUADS[idx] && (s.squadScreenshots?.length !== INITIAL_SQUADS[idx].squadScreenshots?.length));
        const hasLegacy = parsed.length !== INITIAL_SQUADS.length || 
                          parsed.some(s => s.title && (s.title.includes('OUTLAW') || s.title.includes('VENOM') || s.title.includes('LEGACY')));
        if (hasLegacy || priceMismatch || titleMismatch || screenshotMismatch || parsed.some(s => s.id.startsWith('squad-custom'))) {
          localStorage.setItem('vorza_squads_catalog', JSON.stringify(INITIAL_SQUADS));
          return INITIAL_SQUADS;
        }
        return parsed;
      } catch {
        return INITIAL_SQUADS;
      }
    }
    return INITIAL_SQUADS;
  });

  // User session state (wishlist, comparison list, selected squad for close-up inspection)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('vorza_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [selectedSquad, setSelectedSquad] = useState<eFootballSquad | null>(INITIAL_SQUADS[0]);
  
  // Modal toggle states
  const [showPurchaseSimulation, setShowPurchaseSimulation] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<1 | 2 | 3>(1);

  // Search, filter, and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'ALL'>('ALL');
  const [selectedStrength, setSelectedStrength] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<string>('120');
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<PlaystyleType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'RATING' | 'STRENGTH' | 'PRICE_ASC' | 'PRICE_DESC' | 'COINS'>('STRENGTH');
  const [viewOnlyWishlist, setViewOnlyWishlist] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true);

  // Save states back to local storage
  useEffect(() => {
    localStorage.setItem('vorza_squads_catalog', JSON.stringify(squads));
  }, [squads]);

  useEffect(() => {
    localStorage.setItem('vorza_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Wishlist handler toggle
  const handleWishlistToggle = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Compare toggling (limits to maximum 3 items)
  const handleCompareToggle = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 elite squads parallel.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // Add new list of custom squad posted by seller
  const handleAddCustomSquad = (newSquad: eFootballSquad) => {
    setSquads(prev => [newSquad, ...prev]);
    setSelectedSquad(newSquad);
    // Smooth scroll down to details
    setTimeout(() => {
      const detailsEl = document.getElementById('inspect-details-section');
      if (detailsEl) {
        detailsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  // Clear comparison list helper
  const handleClearCompare = () => setCompareIds([]);

  // Filtration computation
  const filteredSquads = squads.filter((squad) => {
    const matchesSearch = squad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          squad.players.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          squad.playstyle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'ALL' || squad.platform === selectedPlatform;
    const matchesStrength = selectedStrength === 'ALL' || squad.teamStrength >= Number(selectedStrength);
    const matchesPrice = squad.price <= Number(maxPrice);
    const matchesPlaystyle = selectedPlaystyle === 'ALL' || squad.playstyle === selectedPlaystyle;
    const matchesWishlist = !viewOnlyWishlist || wishlist.includes(squad.id);

    return matchesSearch && matchesPlatform && matchesStrength && matchesPrice && matchesPlaystyle && matchesWishlist;
  });

  // Sorting calculation
  const sortedSquads = [...filteredSquads].sort((a, b) => {
    if (sortBy === 'STRENGTH') return b.teamStrength - a.teamStrength;
    if (sortBy === 'RATING') return b.squadRating - a.squadRating;
    if (sortBy === 'PRICE_ASC') return a.price - b.price;
    if (sortBy === 'PRICE_DESC') return b.price - a.price;
    if (sortBy === 'COINS') return b.coinAmount - a.coinAmount;
    return 0;
  });

  // Purchase flow simulator
  const triggerPurchaseSimulation = () => {
    setShowPurchaseSimulation(true);
    setPurchaseStep(1);
  };

  const advancePurchaseStep = () => {
    if (purchaseStep === 1) {
      setTimeout(() => setPurchaseStep(2), 1500);
    } else if (purchaseStep === 2) {
      setTimeout(() => {
        setPurchaseStep(3);
        // Mark selected squad as sold!
        if (selectedSquad) {
          setSquads(prev => prev.map(s => s.id === selectedSquad.id ? { ...s, sold: true } : s));
          setSelectedSquad(prev => prev ? { ...prev, sold: true } : null);
        }
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 font-sans pb-16 selection:bg-neon-cyan selection:text-slate-950">
      
      {/* Top Champions League Glow Ribbon */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 w-full" />

      {/* Futuristic Elite Header Navbar */}
      <header className="sticky top-0 z-40 bg-[#020408]/90 backdrop-blur-md border-b border-slate-900 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Immersive Brand Logo */}
            <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] overflow-hidden">
              <img src="https://ik.imagekit.io/0iaahkrcv/images%20(2).png" alt="eFootball Brand" className="w-7 h-7 object-contain" referrerPolicy="no-referrer" />
              <div className="absolute -inset-1 border border-neon-cyan/30 rounded-xl animate-pulse pointer-events-none" />
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-tighter text-white inline-block">
                VOR<span className="text-neon-cyan">ZA</span>
              </span>
              <span className="text-[8px] bg-indigo-500/10 text-indigo-400 font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded ml-1.5 border border-indigo-500/20">
                PRO PORTAL
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-mono font-bold tracking-widest uppercase">
            <a href="#marketplace-section" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-slate-500" /> Marketplace
            </a>
            <a href="#stats-and-trust-section" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-slate-500" /> VORZA Guarantee
            </a>
            <button 
              onClick={() => {
                const cmpEl = document.getElementById('compare-tab-dashboard') || document.getElementById('compare-tab-empty');
                if (cmpEl) cmpEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-400 hover:text-white transition-colors relative flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-slate-500" /> Auditor 
              {compareIds.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[9px] absolute -top-2 -right-3">
                  {compareIds.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 1. Cinematic Stadium Hero Section */}
      <section className="relative overflow-hidden bg-radial-stadium py-12 md:py-20 border-b border-slate-900 px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,#020408_100%)] pointer-events-none" />
        
        {/* Animated Stadium Spotlight effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-full px-4 mb-2 shadow-inner">
            <span className="text-[10px] font-mono font-black tracking-widest text-[#00ff87] uppercase flex items-center gap-2">
              <img src="https://ik.imagekit.io/0iaahkrcv/images%20(1).png" alt="eFootball Verified" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
              GLOBAL SECURE GUARANTEE
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tight leading-tight">
            Own Elite Squads.<br />
            Dominate <span className="text-neon-cyan text-glow">eFootball.</span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Acquire top strategic team accounts loaded with max-boosted Big Time legends, infinite coins, and premium Division tiers. Absolute safety verified under secure VORZA secure transfer protocol.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="#marketplace-section"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-display font-semibold py-3 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] text-sm uppercase tracking-wider"
            >
              Explore Squads
            </a>
          </div>


        </div>
      </section>

      {/* Main Layout Containers */}
      <main className="max-w-7xl mx-auto px-4 gap-8 space-y-12 py-8">

        {/* 2. Netflix-Style Featured Squads Horizontal Carousel */}
        <section id="featured-carousel-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-display font-medium text-white uppercase tracking-wider">
                Elite Booster Accounts of the Week
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono font-bold uppercase">{squads.length} Premium Verified Listings</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x style-scroll-none scroll-smooth">
            {squads.slice(0, 4).map((squad) => (
              <div key={squad.id} className="min-w-[310px] md:min-w-[365px] max-w-[380px] snap-start">
                <AccountCard
                  squad={squad}
                  onSelect={(s) => {
                    setSelectedSquad(s);
                    const detEl = document.getElementById('inspect-details-section');
                    if (detEl) detEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onCompareToggle={handleCompareToggle}
                  isComparing={compareIds.includes(squad.id)}
                  isWishlisted={wishlist.includes(squad.id)}
                  onWishlistToggle={handleWishlistToggle}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 3. VORZA Live market stats log and trust guarantee banner */}
        <MarketTracker />

        {/* 4. Complete Catalog & Advanced Filtering Board */}
        <section id="marketplace-section" className="space-y-6 pt-6">
          <div className="pb-4 border-b border-slate-900 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-neon-cyan" />
                <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">
                  VORZA Interactive Marketplace
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Pinpoint accounts using professional filters. Sort parameters directly to locate cheap coin packages.
              </p>
            </div>

            {/* General filters controller */}
            <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => setIsFiltersCollapsed(prev => !prev)}
                className={`py-2 px-3.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                  !isFiltersCollapsed 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> 
                {isFiltersCollapsed ? 'Show Filters' : 'Hide Filters'}
              </button>

              <button
                type="button"
                onClick={() => setViewOnlyWishlist(prev => !prev)}
                className={`py-2 px-3.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
                  viewOnlyWishlist 
                    ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ❤ Favorites Only ({wishlist.length})
              </button>
            </div>
          </div>

          {/* Filtering Widgets Sidebar + Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Filter Actions Sidebar (3 columns) */}
            {!isFiltersCollapsed && (
              <div className="lg:col-span-3 bg-slate-950/80 border border-slate-900 p-5 rounded-2xl h-fit space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                  <span className="text-xs uppercase font-bold text-white tracking-widest font-mono flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-slate-500" /> Catalog Filters
                  </span>
                  <button
                    onClick={() => {
                      setSelectedPlatform('ALL');
                      setSelectedStrength('ALL');
                      setMaxPrice('120');
                      setSelectedPlaystyle('ALL');
                      setSearchQuery('');
                    }}
                    className="text-[10px] text-slate-500 hover:text-white font-mono uppercase"
                  >
                    Reset
                  </button>
                </div>

                {/* Text Search element */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest">Search Catalog</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search player, style, tag..."
                      className="w-full bg-slate-900 text-xs border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 focus:border-neon-cyan focus:outline-none"
                    />
                  </div>
                </div>

                {/* Console filter segment */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest">Platform console</label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    {['ALL', 'PS5', 'Xbox', 'PC', 'Mobile'].map((plat) => (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setSelectedPlatform(plat as any)}
                        className={`py-1.5 px-2 rounded-lg text-center transition-colors border ${
                          selectedPlatform === plat 
                            ? 'bg-blue-600 border-blue-500 text-white font-bold' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Team Strength Segment */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest font-semibold">Team Strength</label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                    {[
                      { val: 'ALL', label: 'All Strengths' },
                      { val: '3000', label: 'strength > 3,000' },
                      { val: '3100', label: 'strength > 3,100' },
                      { val: '3200', label: 'strength > 3,200' }
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setSelectedStrength(item.val)}
                        className={`py-1.5 px-2 rounded-lg text-center transition-colors border ${
                          selectedStrength === item.val
                            ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range meter slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest">
                    <span>MAX ASSET PRICE</span>
                    <span className="text-white">${maxPrice} USD</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="1"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-[9px] text-slate-600 font-mono">
                    <span>$10</span>
                    <span>$120</span>
                  </div>
                </div>

              </div>
            )}

            {/* Catalog Grid View (Conditionally 9 or 12 columns) */}
            <div className={`${isFiltersCollapsed ? 'lg:col-span-12' : 'lg:col-span-9'} space-y-6`}>
              
              {sortedSquads.length > 0 ? (
                <div className={`grid grid-cols-1 md:grid-cols-2 ${isFiltersCollapsed ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
                  {sortedSquads.map((squad) => (
                    <AccountCard
                      key={squad.id}
                      squad={squad}
                      onSelect={(s) => {
                        setSelectedSquad(s);
                        const detEl = document.getElementById('inspect-details-section');
                        if (detEl) detEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      onCompareToggle={handleCompareToggle}
                      isComparing={compareIds.includes(squad.id)}
                      isWishlisted={wishlist.includes(squad.id)}
                      onWishlistToggle={handleWishlistToggle}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/10 border border-slate-800 border-dashed rounded-3xl p-12 text-center text-slate-400">
                  <SlidersHorizontal className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <p className="font-semibold text-white">No eFootball asset matched your constraints.</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Try adjusting platform selections, resetting pricing caps or searching simpler terms.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedPlatform('ALL');
                      setSelectedStrength('ALL');
                      setMaxPrice('80');
                      setViewOnlyWishlist(false);
                      setSearchQuery('');
                    }}
                    className="mt-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-mono font-bold py-2 px-4 rounded-xl"
                  >
                    Clear Filter Locks
                  </button>
                </div>
              )}

            </div>
          </div>
        </section>        {/* 5. Compare auditor Portal */}
        <ComparePortal
          squads={squads}
          compareIds={compareIds}
          onRemove={handleCompareToggle}
          onClear={handleClearCompare}
          onSelectSquadToInspect={(s) => {
            setSelectedSquad(s);
            setPurchaseStep(1);
            setShowPurchaseSimulation(true);
          }}
        />

      </main>

      {/* Immersive Crypto-Escrow Purchase & Account Handover Modal */}
      {showPurchaseSimulation && selectedSquad && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in z-50">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 w-full max-w-xl shadow-[0_0_50px_rgba(37,99,235,0.25)] space-y-5 text-left relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#00ff87] bg-[#00ff87]/15 border border-[#00ff87]/25 px-2.5 py-0.5 rounded uppercase">
                  VORZA Escrow Terminal v2.6
                </span>
                <h3 className="text-xl font-display font-black text-white mt-1.5 uppercase tracking-wide">
                  Secure Trade Protocol
                </h3>
              </div>
              <button 
                onClick={() => setShowPurchaseSimulation(false)}
                className="text-slate-400 hover:text-white font-mono text-xs border border-slate-800 hover:border-slate-700 bg-slate-900/60 p-1.5 px-3 rounded-lg"
              >
                ✕ Close
              </button>
            </div>

            {/* Selected Squad basic status bar */}
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-850 flex items-center justify-between text-xs font-mono">
              <div className="truncate pr-2">
                <span className="text-slate-500 block uppercase text-[8px]">SQUAD CODE</span>
                <span className="text-white font-bold">{selectedSquad.title}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-slate-500 block uppercase text-[8px]">ASKING VALUE</span>
                <span className="text-neon-cyan font-black">${selectedSquad.price} USD</span>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="grid grid-cols-3 gap-2 font-mono text-[9px] uppercase tracking-wider">
              <div className={`p-2.5 rounded-lg border text-center transition-all ${
                purchaseStep === 1 
                  ? 'bg-blue-900/30 text-blue-300 border-blue-500/50' 
                  : purchaseStep > 1 
                    ? 'bg-emerald-950/20 text-emerald-405 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-900/20 text-slate-600 border-slate-900'
              }`}>
                Step 1: Audit
              </div>
              <div className={`p-2.5 rounded-lg border text-center transition-all ${
                purchaseStep === 2 
                  ? 'bg-blue-900/30 text-blue-300 border-blue-500/50' 
                  : purchaseStep > 2 
                    ? 'bg-emerald-950/20 text-emerald-405 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-900/20 text-slate-600 border-slate-900'
              }`}>
                Step 2: Sign
              </div>
              <div className={`p-2.5 rounded-lg border text-center transition-all ${
                purchaseStep === 3 
                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-505 border-emerald-500/50' 
                  : 'bg-slate-900/20 text-slate-600 border-slate-900'
              }`}>
                Step 3: Access
              </div>
            </div>

            {/* Stage specific content */}
            {purchaseStep === 1 && (
              <div className="space-y-4 font-sans">
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Automated Asset Verify Check:</strong> Under security rules, the VORZA platform has audited this account and confirmed all listed specifications match the high-resolution game proof slide frames:
                  </p>
                  <ul className="grid grid-cols-2 gap-2 font-mono text-[10.5px] bg-slate-950/80 p-3.5 rounded-lg border border-slate-900 text-slate-400">
                    <li>🪙 Coins: <strong className="text-white">{selectedSquad.coinAmount} eFC</strong></li>
                    <li>💵 GP: <strong className="text-white">{selectedSquad.gpAmount.toLocaleString()} GP</strong></li>
                    <li>🔥 Strength: <strong className="text-white">{selectedSquad.teamStrength}</strong></li>
                    <li>✨ Epics: <strong className="text-white">{selectedSquad.epicCardCount} Cards</strong></li>
                    <li>🎮 Platform: <strong className="text-white">{selectedSquad.platform}</strong></li>
                    <li>🛡️ Status: <strong className="text-emerald-400">Verified Proof</strong></li>
                  </ul>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                    {selectedSquad.description}
                  </p>
                </div>
                
                <button
                  onClick={advancePurchaseStep}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 uppercase tracking-wider"
                >
                  Verify Assets & Proceed
                </button>
              </div>
            )}

            {purchaseStep === 2 && (
              <div className="space-y-4 font-sans">
                <div className="space-y-2 text-xs">
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Secure Contract Signing:</strong> Accept terms to lock funds in VORZA's protected custody escrow. We only disburse payment after you successfully sign in and verify ownership on your own device.
                  </p>
                  
                  {/* Seller info card */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex items-center gap-3">
                    <img src={selectedSquad.seller.avatar} alt={selectedSquad.seller.name} className="w-9 h-9 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-semibold text-white text-xs">{selectedSquad.seller.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">Escrow Agent • {selectedSquad.seller.totalSales} Sales ({selectedSquad.seller.rating} ★)</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg">
                    🛡️ Refund Guarantee: If account details or squad screens do not match the handover payload, you receive an instantaneous full refund.
                  </p>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setPurchaseStep(1)}
                    className="w-1/3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 font-mono text-xs py-3 rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={advancePurchaseStep}
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1 uppercase tracking-wider"
                  >
                    Confirm & Buy Out
                  </button>
                </div>
              </div>
            )}

            {purchaseStep === 3 && (
              <div className="space-y-4 text-center py-2 animate-fade-in font-sans">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-display font-medium text-white uppercase tracking-wider">
                  Exchange Initiated!
                </h4>
                <div className="space-y-2.5 text-xs max-w-sm mx-auto">
                  <p className="text-slate-400 leading-relaxed">
                    The requested profile has been locked under your account, and credentials have been forwarded securely to your email (<strong>{selectedSquad.seller.responseTime === '< 3 Mins' ? 'instantly' : 'in under 5 minutes'}</strong>). 
                  </p>
                  <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-lg text-left font-mono text-[10.5px] space-y-1">
                    <div className="text-slate-500 uppercase text-[8px] tracking-widest">Your Private Secure Key</div>
                    <div className="text-cyan-400 font-bold truncate">VORZA_SECURE_KEY_HASH_{Math.floor(Math.random() * 900000 + 100000)}_OK</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowPurchaseSimulation(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs py-2.5 rounded-xl border border-slate-800 mt-2 transition-all uppercase tracking-wider"
                >
                  Return to Market
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Modern Esports Footer */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950 py-12 px-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl text-white tracking-wide">
                VOR<span className="text-neon-cyan">ZA</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              The premier futuristic eFootball collectible marketplace. High-fidelity squad exchanges validated under cryptographic proof models.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] uppercase text-slate-300 font-bold mb-3">CONSOLES Supported</h4>
            <ul className="space-y-2 text-[11px]">
              <li>PlayStation 5 tournament edition</li>
              <li>Xbox Series S/X esports config</li>
              <li>PC (Steam Network accounts)</li>
              <li>iOS & Android mobile links</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase text-slate-300 font-bold mb-3">SECURITY POLICIES</h4>
            <ul className="space-y-2 text-[11px]">
              <li>VORZA Trade signing standards</li>
              <li>Cryptographic profile validation</li>
              <li>Anti-scam secure delivery limits</li>
              <li>24/7 moderator review system</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase text-slate-300 font-bold mb-3">GLOBAL NETWORKS</h4>
            <ul className="space-y-2 text-[11px]">
              <li>Ultimate team collectors guild</li>
              <li>eFootball Championship updates</li>
              <li>Champions League esports desk</li>
              <li>Community Discord portal</li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900/60 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px]">
          <span>© 2026 VORZA Labs Inc. eFootball is trademark of Konami Digital Entertainment.</span>
          <div className="flex gap-4">
            <span>Terms of Trade</span>
            <span>Privacy Policy</span>
            <span>Security Audits</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
