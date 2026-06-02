import React, { useState, useEffect } from 'react';
import { eFootballSquad } from '../types';
import { ShieldCheck, ArrowRight, Smartphone, ChevronLeft, ChevronRight, Flame } from 'lucide-react';

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
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const screenshots = squad.squadScreenshots || (squad.squadPreviewUrl ? [squad.squadPreviewUrl] : []);

  // Micro-carousel auto rotation logic inside each individual AccountCard
  useEffect(() => {
    if (screenshots.length <= 1 || showLightbox) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % screenshots.length);
    }, 4000); // Transitions nicely every 4 seconds
    return () => clearInterval(interval);
  }, [screenshots.length, showLightbox]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % screenshots.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  // Glow effect mapping
  let glowOuterClass = 'glow-card-purple border-purple-500/30';
  if (squad.id === 'squad2') glowOuterClass = 'glow-card-red border-red-500/30';
  if (squad.id === 'squad3' || squad.id === 'squad4') glowOuterClass = 'glow-card-emerald border-emerald-500/30';
  if (squad.id === 'squad_prime') glowOuterClass = 'glow-card-amber border-amber-500/50';

  const isPrime = squad.id === 'squad_prime';

  return (
    <div
      id={`squad-card-${squad.id}`}
      className={`relative group rounded-2xl overflow-hidden transition-all duration-300 ${
        isPrime
          ? 'p-[3.5px] bg-gradient-to-b from-amber-400 via-orange-500 to-yellow-300 shadow-[0_12px_45px_rgba(245,158,11,0.30)] hover:-translate-y-1.5'
          : 'p-[1px] bg-gradient-to-b from-slate-800 to-slate-950 hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-10px_rgba(0,0,0,0.8)]'
      }`}
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

      <div className={`relative rounded-[15px] flex flex-col h-full bg-[#0d131f]/95 z-10 transition-all ${isPrime ? 'p-6 md:p-6.5' : 'p-5'}`}>
        
        {/* Top Header Row with Platform & ID */}
        <div className="flex justify-between items-center mb-3.5 gap-2">
          <span className="text-[10px] uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-neon-cyan" />
            {squad.platform} LINK
          </span>
          {isPrime && (
            <span className="text-[9px] uppercase tracking-wider font-mono font-black px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-400 flex items-center gap-1 shadow-sm">
              ★ TOP STAR DEAL
            </span>
          )}
        </div>

        {/* Squad Title */}
        <div className="mb-4">
          <h3 className="font-display font-black text-base text-white tracking-tight line-clamp-2 pr-2">
            {squad.title}
          </h3>
        </div>

        {/* Large, auto-scrolling multi-screenshot preview container */}
        {screenshots.length > 0 && (
          <div 
            onClick={() => {
              setLightboxIndex(currentImgIndex);
              setShowLightbox(true);
            }}
            className="relative w-full aspect-[16/10] mb-4.5 rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950/90 cursor-pointer group/screenshot"
          >
            {/* Sliding Container wrapper */}
            <div 
              className="w-full h-full flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
            >
              {screenshots.map((imgUrl, index) => (
                <div key={index} className="w-full h-full shrink-0 relative flex items-center justify-center bg-slate-950">
                  <img 
                    src={imgUrl} 
                    alt={`Screenshot proof ${index + 1}`} 
                    className="w-full h-full object-contain transition-all"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>

            {/* Tap to view full display indicator overlay */}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/screenshot:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
              <span className="text-[11px] bg-black/95 text-neon-cyan font-mono border border-neon-cyan/25 px-3 py-1.5 rounded-xl flex items-center gap-1.5 uppercase tracking-wider font-bold shadow-lg">
                🔍 Click to View Fullscreen
              </span>
            </div>

            {/* Custom Manual Overlays (Prev/Next buttons) */}
            {screenshots.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-950/80 hover:bg-slate-950 border border-slate-850/60 text-slate-300 hover:text-white flex items-center justify-center transition-opacity opacity-0 group-hover/screenshot:opacity-100 z-20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-950/80 hover:bg-slate-950 border border-slate-850/60 text-slate-300 hover:text-white flex items-center justify-center transition-opacity opacity-0 group-hover/screenshot:opacity-100 z-20"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Horizontal Progress dots overlay */}
                <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 z-20">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImgIndex(index);
                      }}
                      className={`h-1 rounded-full transition-all ${
                        index === currentImgIndex 
                          ? 'w-4 bg-neon-cyan' 
                          : 'w-1.5 bg-slate-650 opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}


          </div>
        )}

        {/* Clean, authentic details block (Only verified guarantees) */}
        <div className="space-y-2 mb-5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/40 text-xs font-mono">
          <div className="flex justify-between items-center text-slate-400">
            <span>Proof of ownership:</span>
            <span className="text-white font-bold text-[11px]">
              {screenshots.length > 1 
                ? `${screenshots.length} Verified Screens` 
                : 'Verified Screen'
              }
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Transfer safety:</span>
            <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
              100% Secure
            </span>
          </div>
        </div>

        {/* Bottom Pricing & Navigation Actions row */}
        <div className="mt-auto pt-3.5 border-t border-slate-800/60 flex items-center justify-between">
          <div className="text-left font-sans">
            <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">ASKING PRICE</span>
            <span className="text-2xl font-display font-black text-white tracking-tight">
              ${squad.price}
            </span>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => onSelect(squad)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-blue-950/20 uppercase tracking-wider"
            >
              Buy Out <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowLightbox(false)}
        >
          <div className="absolute top-4 right-4 z-[110]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLightbox(false);
              }}
              className="text-white bg-slate-900/80 border border-slate-800 hover:bg-slate-850 px-4 py-2 rounded-xl transition-all cursor-pointer font-mono text-xs uppercase font-bold"
            >
              ✕ Close Detail
            </button>
          </div>

          {/* Main image container */}
          <div 
            className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={screenshots[lightboxIndex]}
              alt={`Full proof screenshot ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-slate-800/60"
              referrerPolicy="no-referrer"
            />

            {/* Carousel controls inside lightbox */}
            {screenshots.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-white flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev + 1) % screenshots.length);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-white flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Slide metadata indicators below image */}
          <div 
            className="mt-6 px-5 py-2.5 bg-slate-950/80 border border-slate-850 rounded-full font-mono text-xs text-white shadow-xl flex items-center gap-3.5 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> VETTED SCREENSHOT PROOF
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300">
              Frame {lightboxIndex + 1} of {screenshots.length}
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
