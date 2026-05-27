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
  Gavel,
  Wallet,
  ArrowUpRight,
  History,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

// ==================== CRYPTO TYPES ====================
type CryptoCurrency = 'USDC' | 'USDT' | 'ETH';
type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'completed';

interface CryptoTransaction {
  id: string;
  squadId: string;
  squadTitle: string;
  amount: number;
  currency: CryptoCurrency;
  walletAddress: string;
  txHash: string;
  status: TransactionStatus;
  timestamp: number;
  blockConfirmations: number;
}

interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  balance: {
    USDC: number;
    USDT: number;
    ETH: number;
  };
}

// ==================== CRYPTO CONFIG ====================
const CRYPTO_CONFIG = {
  // Contract addresses (Sepolia testnet for demo - replace with mainnet for production)
  USDC_ADDRESS: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  USDT_ADDRESS: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
  // Target wallet where payments go (your business wallet)
  MERCHANT_WALLET: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
  // Network configuration
  SUPPORTED_CHAIN_ID: 11155111, // Sepolia (testnet) - change to 1 for mainnet
  SUPPORTED_CHAIN_NAME: 'Ethereum Sepolia',
  RPC_URL: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  // Currency conversion rates (USD to crypto - approximate)
  USDC_TO_USD: 1,
  USDT_TO_USD: 1,
  ETH_TO_USD: 3500,
};

// ==================== CRYPTO HOOK ====================
declare global {
  interface Window {
    ethereum?: any;
  }
}

const useCryptoWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    balance: { USDC: 0, USDT: 0, ETH: 0 },
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      const address = accounts[0];
      const chainIdDec = parseInt(chainId, 16);

      // Check if correct network
      if (chainIdDec !== CRYPTO_CONFIG.SUPPORTED_CHAIN_ID) {
        await switchToCorrectNetwork();
      }

      // Fetch balances (simplified - in production use ethers.js or web3.js)
      const balances = await fetchBalances(address);
      
      setWallet({
        address,
        chainId: chainIdDec,
        isConnected: true,
        balance: balances,
      });

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch to correct network
  const switchToCorrectNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CRYPTO_CONFIG.SUPPORTED_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${CRYPTO_CONFIG.SUPPORTED_CHAIN_ID.toString(16)}`,
            chainName: CRYPTO_CONFIG.SUPPORTED_CHAIN_NAME,
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: [CRYPTO_CONFIG.RPC_URL],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        });
      } else {
        throw switchError;
      }
    }
  };

  // Fetch balances (simplified mock - replace with actual contract calls)
  const fetchBalances = async (address: string) => {
    // In production, use ethers.js to call balanceOf on token contracts
    // This is a mock for demo purposes
    return {
      USDC: 1250.50,
      USDT: 850.25,
      ETH: 0.45,
    };
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet({
      address: null,
      chainId: null,
      isConnected: false,
      balance: { USDC: 0, USDT: 0, ETH: 0 },
    });
  };

  // Listen for account/network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (wallet.isConnected && accounts[0] !== wallet.address) {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [wallet.isConnected, wallet.address]);

  return { wallet, connectWallet, disconnectWallet, isConnecting, error };
};

export default function App() {
  // ... (existing state declarations) ...
  const [squads, setSquads] = useState<eFootballSquad[]>(() => {
    const saved = localStorage.getItem('vorza_squads_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as eFootballSquad[];
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

  // Crypto state
  const { wallet, connectWallet, disconnectWallet, isConnecting, error: walletError } = useCryptoWallet();
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>('USDC');
  const [transactions, setTransactions] = useState<CryptoTransaction[]>(() => {
    const saved = localStorage.getItem('vorza_crypto_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [showTxHistory, setShowTxHistory] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [pendingSquad, setPendingSquad] = useState<eFootballSquad | null>(null);

  // ... (rest of existing state declarations) ...

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('vorza_crypto_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // ==================== CRYPTO PAYMENT FUNCTIONS ====================
  
  // Initiate crypto purchase
  const initiateCryptoPurchase = (squad: eFootballSquad) => {
    if (!wallet.isConnected) {
      connectWallet();
      setPendingSquad(squad);
      return;
    }
    setPendingSquad(squad);
    setShowCryptoModal(true);
  };

  // Execute crypto payment
  const executeCryptoPayment = async () => {
    if (!pendingSquad || !wallet.address) return;
    
    setProcessingPayment(true);
    
    try {
      // Calculate crypto amount based on selected currency
      let cryptoAmount: number;
      let tokenAddress: string;
      
      switch (selectedCurrency) {
        case 'USDC':
          cryptoAmount = pendingSquad.price;
          tokenAddress = CRYPTO_CONFIG.USDC_ADDRESS;
          break;
        case 'USDT':
          cryptoAmount = pendingSquad.price;
          tokenAddress = CRYPTO_CONFIG.USDT_ADDRESS;
          break;
        case 'ETH':
          cryptoAmount = pendingSquad.price / CRYPTO_CONFIG.ETH_TO_USD;
          tokenAddress = '';
          break;
        default:
          cryptoAmount = pendingSquad.price;
          tokenAddress = CRYPTO_CONFIG.USDC_ADDRESS;
      }

      // In production: Use ethers.js to send transaction
      // This is a simulated transaction for demo
      const simulatedTxHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      // Create transaction record
      const newTransaction: CryptoTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        squadId: pendingSquad.id,
        squadTitle: pendingSquad.title,
        amount: pendingSquad.price,
        currency: selectedCurrency,
        walletAddress: wallet.address,
        txHash: simulatedTxHash,
        status: 'pending',
        timestamp: Date.now(),
        blockConfirmations: 0,
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Simulate blockchain confirmation
      setTimeout(() => {
        setTransactions(prev => 
          prev.map(tx => 
            tx.id === newTransaction.id 
              ? { ...tx, status: 'confirmed', blockConfirmations: 1 }
              : tx
          )
        );
      }, 3000);
      
      setTimeout(() => {
        setTransactions(prev => 
          prev.map(tx => 
            tx.id === newTransaction.id 
              ? { ...tx, status: 'completed', blockConfirmations: 12 }
              : tx
          )
        );
        
        // Mark squad as sold
        setSquads(prev => prev.map(s => 
          s.id === pendingSquad.id ? { ...s, sold: true } : s
        ));
        
        // Show success and proceed with purchase simulation
        setShowCryptoModal(false);
        setPendingSquad(null);
        
        // Trigger existing purchase flow
        setSelectedSquad(pendingSquad);
        setShowPurchaseSimulation(true);
        setPurchaseStep(1);
        
      }, 8000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === transactions[0]?.id 
            ? { ...tx, status: 'failed' }
            : tx
        )
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  // Format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format transaction hash
  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  // Get status icon
  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  // Render crypto wallet button in header
  const CryptoWalletButton = () => (
    <div className="relative">
      {wallet.isConnected ? (
        <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-950/50 to-blue-950/50 border border-emerald-500/30 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono text-emerald-300">
            {formatAddress(wallet.address!)}
          </span>
          <button
            onClick={disconnectWallet}
            className="text-[10px] text-slate-400 hover:text-white ml-1"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => connectWallet()}
          disabled={isConnecting}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono text-xs font-bold py-1.5 px-4 rounded-full flex items-center gap-2 transition-all shadow-lg"
        >
          <Wallet className="w-4 h-4" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
      
      {wallet.isConnected && (
        <button
          onClick={() => setShowTxHistory(true)}
          className="ml-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs py-1.5 px-3 rounded-full flex items-center gap-1.5 transition-all"
        >
          <History className="w-3.5 h-3.5" />
          History
        </button>
      )}
    </div>
  );

  // Render crypto payment modal
  const CryptoPaymentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-display font-bold text-white">Crypto Checkout</h3>
            </div>
            <p className="text-xs text-slate-400">Secure blockchain payment via smart contract</p>
          </div>
          <button
            onClick={() => {
              setShowCryptoModal(false);
              setPendingSquad(null);
            }}
            className="text-slate-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Squad info */}
        {pendingSquad && (
          <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{pendingSquad.title}</span>
              <span className="text-white font-bold">${pendingSquad.price} USD</span>
            </div>
          </div>
        )}

        {/* Currency selection */}
        <div className="mb-4">
          <label className="text-[10px] uppercase font-mono text-slate-500 block mb-2">Select Currency</label>
          <div className="grid grid-cols-3 gap-2">
            {(['USDC', 'USDT', 'ETH'] as CryptoCurrency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedCurrency === curr
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                } border`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Amount display */}
        <div className="bg-slate-800/30 rounded-xl p-3 mb-4 border border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">You pay</span>
            <div className="text-right">
              <span className="text-xl font-bold text-white">
                {selectedCurrency === 'ETH' 
                  ? `${(pendingSquad?.price || 0) / CRYPTO_CONFIG.ETH_TO_USD}`
                  : pendingSquad?.price}
              </span>
              <span className="text-xs text-slate-400 ml-1">{selectedCurrency}</span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Network: {CRYPTO_CONFIG.SUPPORTED_CHAIN_NAME}</span>
            <span>Est. gas: ~$0.50</span>
          </div>
        </div>

        {/* Wallet info */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2 text-[10px] text-amber-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Funds held in escrow until delivery confirmation</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 font-mono">
            Receiving wallet: {formatAddress(CRYPTO_CONFIG.MERCHANT_WALLET)}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowCryptoModal(false);
              setPendingSquad(null);
            }}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-sm font-mono"
          >
            Cancel
          </button>
          <button
            onClick={executeCryptoPayment}
            disabled={processingPayment}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {processingPayment ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                Pay with {selectedCurrency}
              </>
            )}
          </button>
        </div>

        {walletError && (
          <p className="text-xs text-red-400 mt-3 text-center">{walletError}</p>
        )}
      </div>
    </div>
  );

  // Render transaction history modal
  const TransactionHistoryModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-display font-bold text-white">Transaction History</h3>
          </div>
          <button
            onClick={() => setShowTxHistory(false)}
            className="text-slate-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs">Connect your wallet and make a purchase</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-slate-800/30 rounded-xl p-3 border border-slate-700 hover:border-slate-600 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{tx.squadTitle}</span>
                      {getStatusIcon(tx.status)}
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold">
                      {tx.amount} {tx.currency}
                    </span>
                    <p className="text-[9px] text-slate-500 font-mono">
                      ${tx.amount} USD
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Tx:</span>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {formatTxHash(tx.txHash)}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {tx.blockConfirmations > 0 && (
                    <span className="text-emerald-400">
                      ✓ {tx.blockConfirmations} confirmations
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {transactions.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800 text-center">
            <p className="text-[9px] text-slate-500 font-mono">
              All transactions are recorded on the blockchain and verifiable via Etherscan
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Modified purchase button for AccountCard integration
  // Add this to your AccountCard component or use it where purchase button appears
  const CryptoPurchaseButton = ({ squad }: { squad: eFootballSquad }) => (
    <button
      onClick={() => initiateCryptoPurchase(squad)}
      disabled={squad.sold}
      className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
        squad.sold
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg'
      }`}
    >
      <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
      </div>
      Buy with Crypto
    </button>
  );

  // Modify the header to include crypto wallet
  // Update the header JSX section:

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

          <div className="flex items-center gap-4">
            {/* Crypto Wallet Button - New */}
            <CryptoWalletButton />
            
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
        </div>
      </header>

      {/* ... (rest of your existing JSX remains the same) ... */}

      {/* Add Crypto Payment Modal */}
      {showCryptoModal && <CryptoPaymentModal />}
      
      {/* Add Transaction History Modal */}
      {showTxHistory && <TransactionHistoryModal />}

      {/* ... (rest of your existing JSX, including the purchase simulation modal) ... */}
      
    </div>
  );
}