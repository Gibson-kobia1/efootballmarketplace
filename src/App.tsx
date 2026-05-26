import React, { useState, useEffect } from 'react';
import { INITIAL_SQUADS, MOCK_REVIEWS } from './data';
import { eFootballSquad, PlatformType, PlaystyleType } from './types';
import AccountCard from './components/AccountCard';
import TacticalPitch from './components/TacticalPitch';
import ComparePortal from './components/ComparePortal';
import SellFormModal from './components/SellFormModal';
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
  HelpCircle
} from 'lucide-react';

export default function App() {
  // Local state persistence
  const [squads, setSquads] = useState<eFootballSquad[]>(() => {
    const saved = localStorage.getItem('vorza_squads_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as eFootballSquad[];
        // Force reset cache if outdated/fake titles are present, count is mismatching, or price exceeds $25
        const hasLegacy = parsed.length !== 4 || 
                          parsed.some(s => s.price > 25) ||
                          parsed.some(s => s.title && (s.title.includes('OUTLAW') || s.title.includes('VENOM') || s.title.includes('SQUAD')));
        if (hasLegacy || parsed.some(s => s.id.startsWith('squad-custom'))) {
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
  const [showSellModal, setShowSellModal] = useState(false);
  const [showPurchaseSimulation, setShowPurchaseSimulation] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<1 | 2 | 3>(1);

  // Search, filter, and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'ALL'>('ALL');
  const [selectedStrength, setSelectedStrength] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<string>('25');
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<PlaystyleType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'RATING' | 'STRENGTH' | 'PRICE_ASC' | 'PRICE_DESC' | 'COINS'>('STRENGTH');
  const [viewOnlyWishlist, setViewOnlyWishlist] = useState(false);

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
            <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Trophy className="w-5 h-5 text-neon-green" />
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
              <TrendingUp className="w-4 h-4 text-slate-500" /> VORZA Escrow
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSellModal(true)}
              className="bg-transparent hover:bg-slate-900 text-neon-cyan hover:text-white border border-neon-cyan/40 hover:border-white font-mono font-bold text-xs py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" /> Sell Account
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
            <span className="text-[10px] font-mono font-black tracking-widest text-[#00ff87] uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              GLOBAL ESCROW GUARANTEED
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-tight leading-tight">
            Own Elite Squads.<br />
            Dominate <span className="text-neon-cyan text-glow">eFootball.</span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Acquire top strategic team accounts loaded with max-boosted Big Time legends, infinite coins, and premium Division tiers. Absolute safety verified under secure VORZA escrow protocol.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="#marketplace-section"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-display font-semibold py-3 px-8 rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] text-sm uppercase tracking-wider"
            >
              Explore Squads
            </a>
            <button
              onClick={() => setShowSellModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-display font-semibold py-3 px-8 rounded-xl transition-all text-sm uppercase tracking-wider"
            >
              Sell Account
            </button>
          </div>

          {/* Luxury UEFA Ticker values info */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-8 text-center font-mono">
            <div>
              <span className="block text-slate-500 text-[10px] uppercase font-bold">ESCROW RATE</span>
              <span className="text-white font-black text-lg">100% Safe</span>
            </div>
            <div className="border-x border-slate-900">
              <span className="block text-slate-500 text-[10px] uppercase font-bold">AVG TRANSFER</span>
              <span className="text-neon-cyan font-black text-lg">&lt; 15 mins</span>
            </div>
            <div>
              <span className="block text-slate-500 text-[10px] uppercase font-bold">FEE COMMISSION</span>
              <span className="text-emerald-400 font-black text-lg">0% Buyers</span>
            </div>
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
            <div className="lg:col-span-3 bg-slate-950/80 border border-slate-900 p-5 rounded-2xl h-fit space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                <span className="text-xs uppercase font-bold text-white tracking-widest font-mono flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-slate-500" /> Catalog Filters
                </span>
                <button
                  onClick={() => {
                    setSelectedPlatform('ALL');
                    setSelectedStrength('ALL');
                    setMaxPrice('25');
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

              {/* Playstyles filters */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest">Active Playstyle</label>
                <select
                  value={selectedPlaystyle}
                  onChange={(e) => setSelectedPlaystyle(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-neon-cyan"
                >
                  <option value="ALL">All strategies</option>
                  <option value="Quick Counter">Quick Counter</option>
                  <option value="Possession Game">Possession Game</option>
                  <option value="Long Ball Counter">Long Ball Counter</option>
                  <option value="Out Wide">Out Wide</option>
                </select>
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
                  max="25"
                  step="1"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-[9px] text-slate-600 font-mono">
                  <span>$10</span>
                  <span>$25</span>
                </div>
              </div>

              {/* Sorting trigger dropdown */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest">Catalog Sort Order</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-850 border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none"
                >
                  <option value="STRENGTH">Max Team Strength</option>
                  <option value="RATING">VORZA Rating Score</option>
                  <option value="COINS">Highest Coins reserves</option>
                  <option value="PRICE_ASC">Price: Cheap to Premium</option>
                  <option value="PRICE_DESC">Price: Premium to Cheap</option>
                </select>
              </div>

            </div>

            {/* Catalog Grid View (9 columns) */}
            <div className="lg:col-span-9 space-y-6">
              
              {sortedSquads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      setMaxPrice('25');
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
        </section>

        {/* 5. Compare auditor Portal */}
        <ComparePortal
          squads={squads}
          compareIds={compareIds}
          onRemove={handleCompareToggle}
          onClear={handleClearCompare}
          onSelectSquadToInspect={(s) => {
            setSelectedSquad(s);
            const detEl = document.getElementById('inspect-details-section');
            if (detEl) detEl.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 6. Comprehensive Squad Details Showcase Area */}
        {selectedSquad && (
          <section id="inspect-details-section" className="space-y-6 scroll-mt-20">
            <div className="pb-3 border-b border-indigo-950/40 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase bg-indigo-505 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold px-2.5 py-1 rounded-full">
                  LIVE INSPECTION PORTAL
                </span>
                <h2 className="text-2xl font-display font-medium text-white uppercase mt-2">
                  Tactics Board: <span className="text-neon-cyan leading-none">{selectedSquad.title}</span>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block font-mono">ESTIMATED PRICE</span>
                <span className="text-3xl font-display font-black text-white">${selectedSquad.price}</span>
              </div>
            </div>

            {/* Tactical Pitch Grid view */}
            <TacticalPitch squad={selectedSquad} />

            {/* Grid of extra asset properties (Inventory list, recommended, reviews) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left hand details (8 Columns) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Information cards */}
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm uppercase tracking-wide font-bold text-slate-300 font-display">
                    ACCOUNT DESCRIPTION & HISTORICAL META
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedSquad.description}
                  </p>
                  
                  {/* Integrity Verification Card */}
                  <div className="p-4 bg-slate-950/70 border border-slate-850 rounded-xl space-y-2 font-mono text-xs">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block tracking-wider">✓ VISUAL PROOF ASSURED</span>
                    <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
                      All players list, squad formation, eFC coins count, GP ratings, and boosted epic metrics are fully present in the high-res screenshot shown above. No mock database parameters are state-larped here, protecting you against unvetted claims.
                    </p>
                  </div>
                </div>

                {/* VORZA verified seller review list */}
                <div className="bg-slate-900/20 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm uppercase tracking-wide font-bold text-slate-300 font-display">
                      Moderator Vetted User Reviews
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Escrow Assured feedback</span>
                  </div>

                  <div className="space-y-4">
                    {MOCK_REVIEWS.map((rev) => (
                      <div key={rev.id} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-850 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center font-mono text-[10px]">
                          <span className="text-slate-300 font-bold">🛒 Verified Deal - {rev.user}</span>
                          <span className="text-slate-500">{rev.date}</span>
                        </div>
                        <div className="text-yellow-500 text-[10px] leading-none">
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                        </div>
                        <p className="text-slate-400 font-medium">
                          "{rev.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right hand purchase sidebar (4 columns) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Solid Checkout interface card */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-850 border-blue-600/20 p-5 rounded-2xl text-left space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-500 font-mono tracking-wider">SECURE TRANSFER PROMPT</span>
                      <h4 className="text-md font-display font-medium text-white uppercase mt-0.5 line-clamp-1">{selectedSquad.title}</h4>
                    </div>
                    {selectedSquad.sold ? (
                      <span className="text-[10px] bg-red-500/20 text-red-500 font-mono font-black border border-red-500/30 px-2 py-0.5 rounded uppercase shrink-0">
                        OFFLINE
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-black border border-emerald-500/30 px-2 py-0.5 rounded uppercase shrink-0 animate-pulse">
                        ONLINE
                      </span>
                    )}
                  </div>

                  <div className="py-3 border-y border-slate-800 font-mono text-xs space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Delivery estimation:</span>
                      <span className="text-white font-bold">&lt; 10 Minutes</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Verification factor:</span>
                      <span className="text-neon-cyan font-bold">Grade-A Sealed</span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-semibold text-slate-350">
                      <span>Asking price:</span>
                      <span className="text-white font-black text-sm">${selectedSquad.price} USD</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono font-bold">
                    {selectedSquad.sold ? (
                      <div className="w-full bg-slate-900 border border-slate-800 text-slate-500 py-3 rounded-xl text-center cursor-not-allowed">
                        SQUAD TRANSFERRED (SOLD OUT)
                      </div>
                    ) : (
                      <button
                        onClick={triggerPurchaseSimulation}
                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 text-center uppercase tracking-wider text-xs focus:outline-none"
                      >
                        Acquire Squad (${selectedSquad.price})
                      </button>
                    )}
                    <button
                      onClick={() => handleCompareToggle(selectedSquad.id)}
                      className={`w-full py-2.5 rounded-xl border text-[11px] text-center transition-colors uppercase tracking-wider font-semibold ${
                        compareIds.includes(selectedSquad.id)
                          ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                          : 'bg-transparent text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {compareIds.includes(selectedSquad.id) ? 'Selected for comparison' : 'Compare parallel'}
                    </button>
                  </div>

                  {/* Guaranteed Escrow Shield */}
                  <div className="pt-2 flex items-center gap-2.5 text-slate-500 text-[10px] font-mono">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Your money is held securely in escrow until squad account is loaded and confirmed.</span>
                  </div>
                </div>

                {/* Seller Stats Profile summary card */}
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedSquad.seller.avatar} 
                      alt={selectedSquad.seller.name} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-800"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-semibold text-white">{selectedSquad.seller.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">VORZA Escrow Agent</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 bg-slate-950/40 border border-slate-850 text-center rounded-lg font-mono text-[10px]">
                    <div>
                      <span className="text-slate-500 block">RATING</span>
                      <span className="text-amber-400 font-bold">{selectedSquad.seller.rating} ★</span>
                    </div>
                    <div className="border-x border-slate-900">
                      <span className="text-slate-500 block">TOTAL SALES</span>
                      <span className="text-white font-bold">{selectedSquad.seller.totalSales}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">SPEED</span>
                      <span className="text-neon-cyan font-bold leading-none">{selectedSquad.seller.responseTime}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </section>
        )}

      </main>

      {/* 7. Sell Form Modal Render */}
      {showSellModal && (
        <SellFormModal
          onClose={() => setShowSellModal(false)}
          onAddSquad={handleAddCustomSquad}
        />
      )}

      {/* 8. Purchase Simulation Interactive Modal overlay */}
      {showPurchaseSimulation && selectedSquad && (
        <div id="buy-simulate-overlay" className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-50 backdrop-blur-md font-mono">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 text-center">
            
            {/* Step 1: Simulated Konami ID Check */}
            {purchaseStep === 1 && (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-600/15 border border-blue-500 rounded-full flex items-center justify-center text-blue-400 mx-auto animate-pulse">
                  🛡️
                </div>
                <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">
                  ACTIVATING VORZA ESCROW
                </h3>
                <p className="text-xs text-slate-400">
                  Securing transaction tunnel for <span className="text-white font-bold">{selectedSquad.title}</span>. Fetching unique cryptographic transfer keys.
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-left text-[11px] text-slate-500 space-y-1">
                  <div>❯ Establishing secure socket link...</div>
                  <div className="text-cyan-400">❯ Locking assets worth ${selectedSquad.price} in Escrow vault...</div>
                </div>
                <button
                  onClick={advancePurchaseStep}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-widest mt-2"
                >
                  Configure payment method
                </button>
              </div>
            )}

            {/* Step 2: Configure payments */}
            {purchaseStep === 2 && (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-600/15 border border-purple-500 rounded-full flex items-center justify-center text-purple-400 mx-auto text-xl">
                  $
                </div>
                <h3 className="text-lg font-display font-black text-white uppercase tracking-wider">
                  SELECT PAYMENT WALLET
                </h3>
                <p className="text-xs text-slate-400">
                  Select payment currency to resolve escrow. Coins and squad ownership transfers instantly.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 cursor-pointer text-xs">
                    <span className="text-white font-bold flex items-center gap-1.5 font-sans">
                      🪙 Stablecoin Escrow (USDT / USDC)
                    </span>
                    <span className="text-emerald-400 font-bold">Fastest</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 cursor-pointer text-xs">
                    <span className="text-white font-bold flex items-center gap-1.5 font-sans">
                      💳 VORZA Point Balance / Masterpoints
                    </span>
                    <span className="text-slate-500">2-5 min validation</span>
                  </div>
                </div>
                <button
                  onClick={advancePurchaseStep}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-widest"
                >
                  Verify payment transfer
                </button>
              </div>
            )}

            {/* Step 3: Purchase Receipt success */}
            {purchaseStep === 3 && (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-neon-green mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">
                  OWNERSHIP TRANSFERRED
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The Konami credentials, coins and game passwords for <span className="text-white font-bold">{selectedSquad.title}</span> have been verified and released to your VORZA profile.
                </p>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-left text-xs space-y-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Transaction status:</span>
                    <span className="text-neon-green font-bold uppercase">Escrow Complete</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Transferred assets:</span>
                    <span className="text-slate-200">Starting XI + {selectedSquad.coinAmount.toLocaleString()} eFC</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Authentic Hash key:</span>
                    <span className="text-slate-400 text-[10px] select-all">VRZ-839K-LK9D-849D</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowPurchaseSimulation(false);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold py-2 px-4 rounded-xl text-xs uppercase"
                >
                  Close & return
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
              <li>VORZA Escrow signing standards</li>
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
            <span>Terms of Escrow</span>
            <span>Privacy Policy</span>
            <span>Security Audits</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
