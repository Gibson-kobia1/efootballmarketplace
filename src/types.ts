export type RarityTier = 'LEGENDARY' | 'EPIC' | 'ICONIC' | 'ELITE';
export type PlatformType = 'PS5' | 'Xbox' | 'PC' | 'Mobile';
export type PlaystyleType = 'Quick Counter' | 'Possession Game' | 'Long Ball Counter' | 'Out Wide';

export interface PlayerStats {
  speed: number;
  shooting: number;
  passing: number;
  defense: number;
  dribbling: number;
}

export interface Player {
  id: string;
  name: string;
  rating: number;
  position: 'GK' | 'CB' | 'LB' | 'RB' | 'DMF' | 'CMF' | 'AMF' | 'LWF' | 'RWF' | 'CF' | 'SS';
  category: 'Epic' | 'Big Time' | 'Showtime' | 'Legend' | 'Highlight' | 'Base';
  nationality: string;
  ratingBonus: number;
  stats: PlayerStats;
}

export interface Seller {
  id: string;
  name: string;
  rating: number; // e.g. 4.9
  verified: boolean;
  avatar: string;
  totalSales: number;
  responseTime: string;
}

export interface eFootballSquad {
  id: string;
  title: string;
  price: number;
  coinAmount: number;
  gpAmount: number;
  pointsAmount: number;
  squadRating: number; // VORZA custom e.g., 97
  teamStrength: number; // e.g., 3190
  divisionRank: number; // 1-10
  epicCardCount: number;
  legendCardCount: number;
  platform: PlatformType;
  formation: string; // e.g. '4-3-3'
  playstyle: PlaystyleType;
  seller: Seller;
  rarityTier: RarityTier;
  hasMatchPass: boolean;
  verifiedBadge: boolean;
  glowColor: string; // tailwind class hex glow color
  description: string;
  squadPreviewUrl?: string;
  squadScreenshots?: string[];
  players: Player[];
  sold?: boolean;
  featured?: boolean;
}

export interface CartState {
  items: string[]; // squad ids
  wishlist: string[]; // squad ids
  compareList: string[]; // squad ids (up to 2 or 3)
}

export interface LiveActivity {
  id: string;
  timestamp: string;
  type: 'sale' | 'listing' | 'offer' | 'verification';
  user: string;
  squadName: string;
  value?: string;
}
