import React, { useState, useEffect } from 'react';
import { eFootballSquad } from '../types';
import { 
  Copy, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  Clock, 
  ExternalLink, 
  HelpCircle,
  QrCode,
  Send,
  Coins,
  ChevronDown,
  ChevronUp,
  Smartphone,
  RefreshCw
} from 'lucide-react';

interface CheckoutPortalProps {
  selectedSquad: eFootballSquad | null;
  onBackToMarket: () => void;
}

export default function CheckoutPortal({ selectedSquad, onBackToMarket }: CheckoutPortalProps) {
  const [phase, setPhase] = useState<1 | 2 | 3>(1); // Phase 1 & 2 are in the checkout screen, Phase 3 is the Completed state.
  const [txId, setTxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSwapGuideOpen, setIsSwapGuideOpen] = useState(true);
  
  // Fake generated values
  const [orderId, setOrderId] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Static Monero Subaddress starting with '8'
  const moneroAddress = "8AvaZ2v5vB686gT8Yn8pEa7hHi9jJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZbd7s8wEa1bBcC29xEsCwZ1Q2W3E4R5T6";
  const moneroPrice = 0.45;

  useEffect(() => {
    // Generate order ID on mount
    const num = Math.floor(1000 + Math.random() * 9000);
    setOrderId(`#EFB-${num}`);
  }, []);

  // Simple toast manager
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(moneroAddress);
    setCopied(true);
    triggerToast("Address copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(moneroPrice.toString());
    triggerToast("Amount copied to clipboard!");
  };

  const handleCopyTxId = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast("Transaction hash copied!");
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!txId.trim()) {
      setErrorMsg('Transaction ID or Swap Receipt is required to verify your deposit');
      return;
    }

    if (txId.trim().length < 12) {
      setErrorMsg('Invalid receipt format. Please paste a valid TxID or Swap Receipt code.');
      return;
    }

    setIsProcessing(true);

    // Simulate 1.5 seconds loading state
    setTimeout(() => {
      setIsProcessing(false);
      setPhase(3);
    }, 1500);
  };

  // Safe fallback if selectedSquad is null (shows first default account metadata)
  const productTitle = selectedSquad ? selectedSquad.title : 'Premium eFootball Account #180107';
  const productPriceUsd = selectedSquad ? selectedSquad.price : 85;
  const productCoins = selectedSquad ? selectedSquad.coinAmount : 2200;
  const productGp = selectedSquad ? selectedSquad.gpAmount : 6400000;
  const productStrength = selectedSquad ? selectedSquad.teamStrength : 3230;
  const productRating = selectedSquad ? selectedSquad.squadRating : 99;
  const productPreview = selectedSquad ? selectedSquad.squadPreviewUrl : 'https://ik.imagekit.io/0iaahkrcv/107cr7.jpg';

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-2 min-h-[85vh] flex flex-col justify-start">
      
      {/* Dynamic Toast Element */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-bounce bg-slate-900 border border-emerald-505/40 text-emerald-400 font-mono text-xs font-semibold py-3.5 px-6 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* Back to Marketplace Anchor Navigation */}
      {phase !== 3 && (
        <button
          onClick={onBackToMarket}
          className="self-start mb-6 inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-slate-400 hover:text-white transition-colors group bg-slate-950 border border-slate-900 hover:border-slate-800 p-2 px-4 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-1 transition-transform" />
          Back to Marketplace
        </button>
      )}

      {/* Dynamic phase contents */}
      {phase !== 3 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ACTIVE CHECKOUT SCREEN (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Page Header */}
            <div>
              <span className="text-[10px] font-mono font-black tracking-widest text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 px-2.5 py-1 rounded-md uppercase">
                SECURE MONERO REDIRECT
              </span>
              <h1 className="text-2xl md:text-3xl font-display font-black text-white mt-1.5 uppercase tracking-tight">
                Transfer & Verify Order
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Your order is reserved below. Read payment details carefully to execute transactions instantly.
              </p>
            </div>

            {/* MONERO DEPOSIT INFO PANEL (PHASE 1) */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />
              
              {/* Headline Monero Pricing */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/65">
                <div>
                  <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest">Amount to Transfer</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-mono font-black text-amber-500 tracking-tight">{moneroPrice} XMR</span>
                    <button 
                      onClick={handleCopyAmount}
                      title="Copy Amount"
                      className="p-1 px-1.5 rounded-md bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-all text-[9px] font-mono flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest">Estimated Value</span>
                  <span className="text-sm font-semibold text-slate-300 mt-1 block">~ {productPriceUsd}.00 USD Contract</span>
                </div>
              </div>

              {/* Monero Subaddress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 font-mono tracking-widest">
                  <span>Monero Subaddress (Type-8)</span>
                  <span className="text-amber-500/80 font-semibold lowercase">network locked</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 flex items-start gap-3 relative group">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mt-1.5 shrink-0" />
                  <div className="font-mono text-[11px] text-emerald-300 break-all select-all leading-relaxed flex-1 pr-6">
                    {moneroAddress}
                  </div>
                  <button
                    onClick={handleCopyAddress}
                    className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-slate-900/95 border border-slate-800 text-slate-400 hover:text-white transition-all hover:scale-105"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* QR Code and Instructions grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-950/60 p-4 rounded-xl border border-slate-900/55">
                
                {/* QR Container (5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-3.5 bg-white rounded-xl shadow-lg border border-slate-200">
                  {/* High Quality SVG-rendered QR Code representation */}
                  <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-full max-w-[140px] text-black">
                    {/* Background */}
                    <rect width="100" height="100" fill="#FFFFFF" />
                    {/* Finder Patterns */}
                    <rect x="5" y="5" width="25" height="25" fill="#000000" />
                    <rect x="9" y="9" width="17" height="17" fill="#FFFFFF" />
                    <rect x="12" y="12" width="11" height="11" fill="#000000" />

                    <rect x="70" y="5" width="25" height="25" fill="#000000" />
                    <rect x="74" y="9" width="17" height="17" fill="#FFFFFF" />
                    <rect x="77" y="12" width="11" height="11" fill="#000000" />

                    <rect x="5" y="70" width="25" height="25" fill="#000000" />
                    <rect x="9" y="74" width="17" height="17" fill="#FFFFFF" />
                    <rect x="12" y="77" width="11" height="11" fill="#000000" />

                    {/* Small Alignment Pattern */}
                    <rect x="74" y="74" width="9" height="9" fill="#000000" />
                    <rect x="76" y="76" width="5" height="5" fill="#FFFFFF" />
                    <rect x="78" y="78" width="1" height="1" fill="#000000" />

                    {/* QR Code Matrix Dots (Simulated Layout) */}
                    <path d="M 40 5 h 5 v 5 h -5 z M 50 5 h 5 v 5 h -5 z M 60 5 h 5 v 5 h -5 z" fill="#000000" />
                    <path d="M 40 15 h 5 v 5 h -5 z M 50 15 h 5 v 5 h -5 z M 60 15 h 5 v 5 h -5 z" fill="#000000" />
                    <path d="M 45 25 h 5 v 5 h -5 z M 55 25 h 5 v 5 h -5 z M 65 25 h 5 v 5 h -5 z" fill="#000000" />
                    
                    <path d="M 5 40 h 5 v 5 h -5 z M 15 40 h 5 v 5 h -5 z M 25 40 h 5 v 5 h -5 z M 35 40 h 5 v 5 h -5 z" fill="#000000" />
                    <path d="M 45 40 h 10 v 5 h -10 z M 60 40 h 5 v 5 h -5 z M 75 40 h 10 v 5 h -10 z" fill="#000000" />

                    <path d="M 5 50 h 10 v 5 h -10 z M 25 50 h 5 v 5 h -5 z M 35 50 h 5 v 5 h -5 z M 55 50 h 5 v 5 h -5 z" fill="#000000" />
                    <path d="M 65 50 h 10 v 5 h -10 z M 85 50 h 5 v 5 h -5 z" fill="#000000" />

                    <path d="M 5 60 h 5 v 5 h -5 z M 20 60 h 10 v 5 h -10 z M 40 60 h 5 v 5 h -5 z M 50 60 h 5 v 5 h -5 z" fill="#000000" />
                    <path d="M 65 60 h 5 v 5 h -5 z M 80 60 h 10 v 5 h -10 z" fill="#000000" />

                    <path d="M 35 70 h 10 v 5 h -10 z M 50 70 h 5 v 5 h -5 z M 60 70 h 5 v 5 h -5 z" fill="#000000" />
                    <path d="M 35 80 h 5 v 5 h -5 z M 45 80 h 5 v 5 h -5 z M 55 80 h 10 v 5 h -10 z" fill="#000000" />
                    <path d="M 40 90 h 10 v 5 h -10 z M 55 90 h 5 v 5 h -5 z M 65 90 h 5 v 5 h -5 z" fill="#000000" />

                    {/* Monero Symbol Core Emblem Vector overlay */}
                    <g transform="translate(38, 38) scale(0.24)">
                      {/* Monero Background disk for isolation */}
                      <circle cx="50" cy="50" r="42" fill="#FFFFFF" />
                      {/* Monero Logo Silhouette vector */}
                      <circle cx="50" cy="50" r="36" fill="#f26822" />
                      <path d="M 22 78 L 22 41 L 34 53 L 50 37 L 66 53 L 78 41 L 78 78 L 68 78 L 68 55 L 50 73 L 32 55 L 32 78 Z" fill="#FFFFFF" />
                    </g>
                  </svg>
                  <span className="text-[10px] text-slate-650 font-mono font-bold uppercase tracking-wider mt-2.5 flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-slate-500" /> SCAN ME IN WALLET
                  </span>
                </div>

                {/* Info Text Guidelines (7 cols) */}
                <div className="md:col-span-7 space-y-3">
                  <h4 className="text-sm font-semibold text-white">How To Pay:</h4>
                  <ul className="space-y-2.5 text-[11.5px] leading-relaxed text-slate-300 font-sans">
                    <li className="flex gap-2 items-start">
                      <span className="w-4 h-4 rounded-full bg-slate-850 border border-slate-750 text-slate-400 text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span>Open any secure Monero wallet (e.g., Cake Wallet, Feather Wallet, MyMonero).</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="w-4 h-4 rounded-full bg-slate-850 border border-slate-750 text-slate-400 text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span>Scan the QR code or copy the address and correct amount (<strong>0.45 XMR</strong>).</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="w-4 h-4 rounded-full bg-slate-850 border border-slate-750 text-slate-400 text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span>Execute the broadcast transaction from your private wallet dashboard and wait for network confirmations.</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* MULTI-NETWORK SWAP INSTRUCTION BLOCK */}
              <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl overflow-hidden transition-all duration-300">
                <button
                  type="button"
                  onClick={() => setIsSwapGuideOpen(!isSwapGuideOpen)}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900/80 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm shrink-0">💡</span>
                    <span className="text-xs md:text-sm font-bold text-white tracking-wide">
                      Don't own a Monero wallet? Pay using Solana, Bitcoin, or USDT
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="hidden sm:inline text-[10px] uppercase font-mono tracking-wider font-semibold">
                      {isSwapGuideOpen ? "Hide Guide" : "View Guide"}
                    </span>
                    {isSwapGuideOpen ? (
                      <ChevronUp className="w-4 h-4 shrink-0 transition-transform" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 transition-transform" />
                    )}
                  </div>
                </button>

                {isSwapGuideOpen && (
                  <div className="p-4 md:p-5 border-t border-slate-900 space-y-4">
                    <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans">
                      You can buy instantly with standard assets. Most popular multi-coin wallets let you swap other coins (like <strong className="text-[#00ff87]">SOL</strong> or <strong className="text-[#00ff87]">BTC</strong>) and pay straight into a Monero address in seconds!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* STEP 1 */}
                      <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-mono font-black text-neon-cyan uppercase tracking-widest bg-neon-cyan/10 px-2 py-0.5 rounded">
                              STEP 1
                            </span>
                            <span className="text-slate-550 text-[9px] font-mono uppercase tracking-wider text-slate-500">Copy details</span>
                          </div>
                          <p className="text-[11.5px] text-slate-300 font-sans leading-relaxed">
                            Copy our <strong className="text-white">Monero Wallet Address</strong> and the exact <strong className="text-amber-500 font-mono font-bold">{moneroPrice} XMR</strong> amount shown above.
                          </p>
                        </div>
                      </div>

                      {/* STEP 2 */}
                      <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg flex flex-col justify-between hover:border-slate-700 transition-colors">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-mono font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
                              STEP 2
                            </span>
                            <span className="text-slate-550 text-[9px] font-mono uppercase tracking-wider text-slate-500 font-semibold">open swap</span>
                          </div>
                          <p className="text-[11.5px] text-slate-300 font-sans leading-relaxed">
                            Open your everyday personal wallet app (like <strong className="text-white">Phantom</strong>, <strong className="text-white">Trust Wallet</strong>, or <strong className="text-white">Exodus</strong>) and navigate to the <strong className="text-indigo-400 font-semibold">"Swap"</strong> or <strong className="text-indigo-400 font-semibold">"Exchange"</strong> tab.
                          </p>
                        </div>
                      </div>

                      {/* STEP 3 */}
                      <div className="bg-slate-900/60 border border-emerald-500/20 p-3.5 rounded-lg flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-mono font-black text-[#00ff87] uppercase tracking-widest bg-[#00ff87]/10 px-2 py-0.5 rounded">
                              STEP 3
                            </span>
                            <span className="text-[#00ff87] text-[9px] font-mono uppercase tracking-wider font-semibold">convert coin</span>
                          </div>
                          <p className="text-[11.5px] text-slate-300 font-sans leading-relaxed">
                            Set the coin you want to spend (e.g., <strong className="text-emerald-400">SOL</strong>), select Monero (<strong className="text-amber-500 font-semibold">XMR</strong>) as the destination token, paste our address, and confirm the transfer. Your wallet will handle the conversion automatically!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* NOTICE BANNER */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 text-slate-300">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-[11.5px] leading-relaxed font-sans">
                  <strong>🕒 Manual Verification Notice:</strong> Payments are checked manually by an admin. Your assets will be securely delivered to your dashboard within 30-60 minutes after network broadcast.
                </div>
              </div>

            </div>

            {/* PHASE 2: PROOF SUBMISSION FORM */}
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 md:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.6)] space-y-4">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#00ff87]" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Payment Verification proof
                </h3>
              </div>

              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="txidInput" className="text-[11px] uppercase font-bold text-slate-450 text-indigo-400 font-mono tracking-wider block">
                    Paste your Outbound Transaction ID (TxID / Hash) or Swap Receipt here to verify your order.
                  </label>
                  
                  <div className="relative">
                    <input
                      id="txidInput"
                      type="text"
                      value={txId}
                      onChange={(e) => {
                        setTxId(e.target.value);
                        if (errorMsg) setErrorMsg('');
                      }}
                      placeholder="e.g., 4a5e6f859a239c017d6b9ef842d348a9010ef8c36b81c2f109b8374dcfc9d2bf"
                      className={`w-full bg-slate-950 font-mono text-[11.5px] border rounded-xl pl-4 pr-4 py-3 focus:outline-none transition-colors ${
                        errorMsg 
                          ? 'border-red-500 focus:border-red-400' 
                          : 'border-slate-800 focus:border-neon-cyan'
                      }`}
                      disabled={isProcessing}
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-[11px] text-red-400 font-mono flex items-center gap-1.5 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errorMsg}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#00ff87] to-cyan-500 hover:opacity-90 disabled:opacity-50 text-slate-950 font-mono text-xs font-black py-4 px-4 rounded-xl transition-all shadow-[0_0_25px_rgba(0,255,135,0.15)] focus:scale-98 active:scale-98 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Verification ...
                    </>
                  ) : (
                    <>
                      Submit Payment Request
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT COLUMN: DETAILED ORDER SUMMARY CARD (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.6)] space-y-5">
              
              <div className="border-b border-slate-800/80 pb-3">
                <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest">Selected Item</span>
                <span className="text-xs text-indigo-400 font-mono font-bold tracking-widest block uppercase mt-0.5">eFootball Market Asset</span>
              </div>

              {/* Game Rarity Preview Badge */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-950 border border-slate-800 group">
                <img
                  src={productPreview}
                  alt={productTitle}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                
                {/* Holographic specs stripe overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent p-3.5 flex flex-col justify-end">
                  <span className="text-[10px] font-mono text-neon-cyan font-bold block">SPECIFICATION AUDIT</span>
                  <h3 className="font-display font-black text-sm text-white truncate mt-0.5 uppercase tracking-wide">
                    {productTitle}
                  </h3>
                </div>
              </div>

              {/* Specification Grid List */}
              <div className="space-y-2.5 pt-1 text-xs">
                
                <div className="flex justify-between items-center py-2 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">Vetted Squad Rating</span>
                  <span className="font-mono font-bold text-white bg-indigo-505 bg-indigo-500/15 border border-indigo-500/35 px-2 py-0.5 rounded text-[11px]">{productRating} OVR</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">Team Strength</span>
                  <span className="font-mono font-black text-emerald-400">{productStrength} Power</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">eFootball Coins</span>
                  <span className="font-mono font-bold text-yellow-405 text-yellow-400 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    {productCoins.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-900">
                  <span className="text-slate-400 font-sans">GP Amount</span>
                  <span className="font-mono font-semibold text-slate-200">{productGp.toLocaleString()} GP</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-sans">Transfer Guarantee</span>
                  <span className="font-mono font-bold text-[#00ff87] flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Escrow Checked
                  </span>
                </div>

              </div>
              
              {/* THE COMPREHENSIVE CREDENTIALS PRIVILEGE CARD */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-500/30 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                  <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                    🔒 Verified Full-Asset Ownership & Privileges
                  </h3>
                </div>
                <ul className="space-y-3 text-[11px] leading-relaxed text-slate-350 font-sans">
                  <li className="flex gap-2 items-start hover:text-white transition-colors">
                    <span className="text-[#00ff87] font-bold text-xs shrink-0 mt-0.5">✦</span>
                    <div>
                      <strong className="text-white font-bold block mb-0.5">Complete Konami Data Transfer Kit:</strong>
                      Upon approval, you receive the full bundle: The Konami ID, the registered password, and full access credentials to the linked master email inbox.
                    </div>
                  </li>
                  <li className="flex gap-2 items-start hover:text-white transition-colors">
                    <span className="text-[#00ff87] font-bold text-xs shrink-0 mt-0.5">✦</span>
                    <div>
                      <strong className="text-white font-bold block mb-0.5">Bypass Konami 2-Step Verification:</strong>
                      Because you get the linked inbox, you can immediately intercept Konami's 6-digit data transfer security codes yourself without waiting for an admin.
                    </div>
                  </li>
                  <li className="flex gap-2 items-start hover:text-white transition-colors">
                    <span className="text-indigo-400 font-bold text-xs shrink-0 mt-0.5">✦</span>
                    <div>
                      <strong className="text-indigo-300 font-bold block mb-0.5">Elite Discord Tournament Pass:</strong>
                      Instant entry into our private Discord Server holding active eFootball mobile league tournaments with prize pools.
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      ) : (
        
        /* PHASE 3: THE COMPLETED / ADVANCED ONBOARDING PRO-DASHBOARD */
        <div className="max-w-3xl mx-auto w-full bg-[#0b0f19] border border-slate-800 rounded-3xl p-5 md:p-8 space-y-6 text-left shadow-[0_4px_45px_rgba(0,0,0,0.8)] relative overflow-hidden animate-fade-in my-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400" />
          
          {/* Radial amber/violet glow backplate */}
          <div className="absolute top-12 right-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-[95px] pointer-events-none" />

          {/* Header Block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black tracking-widest text-[#00ff87] bg-[#00ff87]/10 border border-[#00ff87]/20 px-2.5 py-1 rounded-md uppercase">
                PROOF SUBMITTED SUCCESSFULLY
              </span>
              <h2 className="text-xl md:text-2xl font-display font-black text-white mt-1.5 uppercase tracking-wide">
                Invoice Logged
              </h2>
            </div>
            
            <div className="bg-slate-950 p-2.5 px-4 rounded-xl border border-slate-900 font-mono text-xs text-right shrink-0">
              <span className="block text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Order Receipt Code</span>
              <span className="font-bold text-white text-sm">{orderId}</span>
            </div>
          </div>

          {/* 📦 Your Account Delivery Hub */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950 border border-slate-900 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-lg select-none shrink-0">
                  📦
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Your Account Delivery Hub
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Handover credentials for <strong className="text-white">{productTitle}</strong>
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-full text-[10px] font-mono text-amber-400 uppercase font-bold shrink-0 self-start md:self-auto">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Status: Verifying Transfer Block (Est. 15-30 mins)
              </div>
            </div>

            {/* Decryption Panel (Simulated Locked State) */}
            <div className="bg-[#0e1424] border border-slate-800 rounded-2xl p-4 md:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-300">
                    ESCROW DECRYPTION VAULT
                  </span>
                </div>
                <span className="text-[9px] font-mono uppercase text-slate-500 font-bold">AES-256 ENCRYPTED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Konami ID */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    Konami ID / Linked Email
                  </span>
                  <div className="font-mono text-xs text-indigo-400/90 font-semibold bg-slate-900/40 p-2.5 rounded border border-slate-900.5 flex items-center justify-between">
                    <span>[🔒 Decrypting on confirmation...]</span>
                  </div>
                </div>

                {/* Konami Password */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    Konami Password
                  </span>
                  <div className="font-mono text-xs text-indigo-400/90 font-semibold bg-slate-900/40 p-2.5 rounded border border-slate-900.5 flex items-center justify-between">
                    <span>[🔒 Decrypting on confirmation...]</span>
                  </div>
                </div>

                {/* Master Email Inbox */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    Master Email Inbox Login
                  </span>
                  <div className="font-mono text-xs text-indigo-400/90 font-semibold bg-slate-900/40 p-2.5 rounded border border-slate-900.5 flex items-center justify-between">
                    <span>[🔒 Decrypting on confirmation...]</span>
                  </div>
                </div>

                {/* Email Password */}
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-900 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                    Email Inbox Password
                  </span>
                  <div className="font-mono text-xs text-indigo-400/90 font-semibold bg-slate-900/40 p-2.5 rounded border border-slate-900.5 flex items-center justify-between">
                    <span>[🔒 Decrypting on confirmation...]</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex gap-2.5 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed font-sans">
                  Our custody smart systems hold your transfer credentials locked. Once our admin approves your payment hash, this vault will decrypt automatically in your browser thread. No email delay, no admin wait.
                </p>
              </div>
            </div>

            {/* 🛠️ The Pro-Login Protocol (How to Load Your Squad) */}
            <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
                <span className="text-sm shrink-0">🛠️</span>
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  The Pro-Login Protocol (How to Load Your Squad)
                </h3>
              </div>

              <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans">
                Follow this industry-standard onboarding sequence to load your acquired eFootball squad securely without triggering secondary Konami fraud flags or breaching developer TOS.
              </p>

              {/* Steps Layout */}
              <div className="space-y-4 pt-1">
                {/* Step 1 */}
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-[#00ff87] text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    1
                  </span>
                  <div className="text-xs text-slate-300 font-sans leading-relaxed">
                    Open <strong className="text-white">eFootball</strong> on your mobile device. Stay on the main loading screen (<strong className="text-slate-400">do not tap to enter the main menu</strong>).
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-[#00ff87] text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    2
                  </span>
                  <div className="text-xs text-slate-300 font-sans leading-relaxed">
                    Tap the <strong className="text-white">hamburger menu icon (three lines)</strong> in the bottom-right corner and select <strong className="text-indigo-400 font-semibold">'Data Transfer'</strong>.
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-[#00ff87] text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    3
                  </span>
                  <div className="text-xs text-slate-300 font-sans leading-relaxed">
                    Choose <strong className="text-white">'Transfer Data Linked to Konami ID Account'</strong>. This will automatically trigger and open your native default browser window.
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-[#00ff87] text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    4
                  </span>
                  <div className="text-xs text-slate-300 font-sans leading-relaxed">
                    Input the secure <strong className="text-white">Konami ID</strong> and <strong className="text-white">Password</strong> displayed on the Decryption Panel above once approved.
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    5
                  </span>
                  <div className="text-xs text-slate-300 font-sans leading-relaxed">
                    Konami will immediately prompt you for a 2-Step Verification Code sent to the account email. Log into the <strong className="text-indigo-400 font-semibold">Master Email Inbox</strong> provided above, inspect and copy the raw <strong className="text-white">6-digit code</strong>, paste it into the browser window, and return to the game to complete the transfer.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Help Line Information Banner */}
          <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl text-slate-400 text-xs text-left leading-relaxed space-y-2.5">
            <div className="font-sans text-slate-300">
              🔒 <strong>Handover Security Protocol:</strong> The administrator compiles ledger proofs from standard block explorers. On confirmation, credentials are dynamically processed into your dashboard vault!
            </div>
            
            <div className="font-mono text-[11px] text-amber-500 flex flex-col sm:flex-row gap-2 sm:items-center justify-between border-t border-slate-900/80 pt-2.5">
              <span>Have any layout or checkout query?</span>
              <a 
                href="https://t.me/eFootballMarketSupport" 
                target="_blank" 
                rel="noreferrer" 
                className="text-neon-cyan hover:underline flex items-center gap-1 font-bold shrink-0"
              >
                Telegram Support Link: @eFootballMarketSupport
                <ExternalLink className="w-3 h-3 text-neon-cyan" />
              </a>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setPhase(1);
                setTxId('');
                onBackToMarket();
              }}
              className="w-full sm:w-1/2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 font-mono text-xs font-bold py-3.5 px-4 rounded-xl transition-all uppercase tracking-wider text-center"
            >
              Return to Marketplace
            </button>
            <button
              onClick={() => {
                triggerToast("Refreshing verification block status");
              }}
              className="w-full sm:w-1/2 bg-slate-950 text-slate-400 hover:text-white border border-slate-900 hover:border-slate-800 font-mono text-xs font-bold py-3.5 px-4 rounded-xl transition-all uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Force Refresh Vault
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
