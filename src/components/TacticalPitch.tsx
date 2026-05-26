import React, { useState } from 'react';
import { eFootballSquad } from '../types';
import { ShieldAlert, Award, Sparkles, AlertCircle, ZoomIn, Eye } from 'lucide-react';

interface TacticalPitchProps {
  squad: eFootballSquad;
}

export default function TacticalPitch({ squad }: TacticalPitchProps) {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset magnifier zoom setting on squad change
  React.useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [squad]);

  // Handle Zoom Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.5));
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const next = Math.max(1, prev - 0.5);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  return (
    <div id="tactical-board-section" className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-5 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-ping" />
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
              VORZA Visual Integrity Bench
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare active squad, players, and coins visually. Use magnifier controls to inspect credentials directly from untampered in-game screenshot.
          </p>
        </div>

        {/* Zoom Tool Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-500 font-mono px-2">Magnifier tool:</span>
          <button
            onClick={handleZoomIn}
            className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            Zoom +
          </button>
          <button
            onClick={handleZoomOut}
            className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            Zoom -
          </button>
          {scale > 1 && (
            <button
              onClick={() => {
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-900"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Dynamic eFootball Screenshot Frame */}
        <div className="lg:col-span-8 relative">
          <div className="text-center text-slate-500 text-[10px] uppercase tracking-widest font-mono mb-2 flex items-center justify-center gap-1 bg-slate-900/40 p-2 rounded-lg border border-slate-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] inline-block animate-ping" />
            Verified File Source Checklist: Original Live Asset Preview
          </div>

          <div 
            className={`w-full aspect-[16/10] max-w-[650px] mx-auto rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.85)] border border-slate-800/80 bg-slate-950/90 ${
              scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* The main screenshot image */}
            <img
              src={squad.squadPreviewUrl}
              alt="Live Game Screenshot Account Proof"
              draggable="false"
              className="w-full h-full object-contain pointer-events-none transition-transform duration-200"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                cursor: scale > 1 ? 'grab' : 'default'
              }}
              referrerPolicy="no-referrer"
            />

            {/* Scale indicator overlay */}
            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-slate-300 pointer-events-none border border-slate-800">
              Zoom: {scale.toFixed(1)}x {scale > 1 && '(Click & Drag to pan)'}
            </div>
          </div>
        </div>

        {/* Right Side: Visual Fact Bench Credentials */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl text-left space-y-3.5">
            <div className="flex items-center gap-2 text-indigo-400">
              <Award className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm uppercase font-bold tracking-wider font-display text-white">Verified Account Info</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              To provide absolute protection against false or inaccurate information, we do not state unvetted values or player rosters. Everything is fully public and verified within the high-res game image itself:
            </p>

            <ul className="space-y-2.5 font-mono text-xs text-slate-300">
              <li className="flex items-start gap-2 p-2 bg-slate-950/60 rounded border border-slate-900">
                <span className="text-neon-cyan font-bold">●</span>
                <div>
                  <strong className="text-slate-400 block text-[10px] uppercase">Original System</strong>
                  <span className="text-white font-black">{squad.platform}</span>
                </div>
              </li>
              <li className="flex items-start gap-2 p-2 bg-slate-950/60 rounded border border-slate-900">
                <span className="text-neon-cyan font-bold">●</span>
                <div>
                  <strong className="text-slate-400 block text-[10px] uppercase">Verified File URL</strong>
                  <a 
                    href={squad.squadPreviewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-cyan-400 hover:underline hover:text-cyan-300 font-semibold flex items-center gap-1 mt-0.5 text-[11px]"
                  >
                    Open Full Image <Eye className="w-3.5 h-3.5" />
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2 p-2 bg-slate-950/60 rounded border border-slate-900">
                <span className="text-neon-cyan font-bold">●</span>
                <div>
                  <strong className="text-slate-400 block text-[10px] uppercase">Ownership Guarantee</strong>
                  <span className="text-emerald-450 font-bold text-emerald-400">Verified VORZA Escrow Secured</span>
                </div>
              </li>
            </ul>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl flex items-start gap-2.5 text-xs font-sans">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <strong>Escrow Policy:</strong> What you see in the screenshot is exactly what you get. If the account details do not match the screenshot after hand-over, secure escrow instantly returns your payment in full.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
