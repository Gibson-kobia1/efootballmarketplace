import { eFootballSquad, LiveActivity } from './types';

export const INITIAL_SQUADS: eFootballSquad[] = [
  {
    id: 'squad-1',
    title: 'VERIFIED MOBILE ACCOUNT #180143',
    price: 145,
    coinAmount: 1450,
    gpAmount: 2200000,
    pointsAmount: 11200,
    squadRating: 98,
    teamStrength: 3200,
    divisionRank: 1,
    epicCardCount: 12,
    legendCardCount: 15,
    platform: 'Mobile',
    formation: '4-3-3',
    playstyle: 'Quick Counter',
    description: 'Genuine eFootball mobile account verified visually. All active inventory, coin counts, and elite player boosts are represented in the official screenshot preview. Verified hand-off handled securely by the VORZA escrow coordinator.',
    squadPreviewUrl: 'https://ik.imagekit.io/0iaahkrcv/20260526_180143.jpg',
    hasMatchPass: true,
    verifiedBadge: true,
    glowColor: '#fbbf24', // Legendary Gold Glow
    rarityTier: 'LEGENDARY',
    seller: {
      id: 'sell-1',
      name: 'VORZA_EscrowAgent_X',
      rating: 4.9,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80',
      totalSales: 482,
      responseTime: '< 5 Mins'
    },
    players: [
      { id: 'p1-1', name: 'L. Messi', rating: 104, position: 'CF', category: 'Big Time', nationality: 'Argentina', ratingBonus: 4, stats: { speed: 95, shooting: 98, passing: 94, defense: 40, dribbling: 104 } },
      { id: 'p1-2', name: 'Neymar Jr', rating: 102, position: 'LWF', category: 'Epic', nationality: 'Brazil', ratingBonus: 3, stats: { speed: 96, shooting: 90, passing: 92, defense: 35, dribbling: 105 } },
      { id: 'p1-3', name: 'C. Ronaldo', rating: 101, position: 'CF', category: 'Legend', nationality: 'Portugal', ratingBonus: 2, stats: { speed: 91, shooting: 99, passing: 80, defense: 38, dribbling: 90 } },
      { id: 'p1-4', name: 'P. Vieira', rating: 102, position: 'DMF', category: 'Epic', nationality: 'France', ratingBonus: 4, stats: { speed: 84, shooting: 75, passing: 87, defense: 101, dribbling: 83 } },
      { id: 'p1-5', name: 'A. Iniesta', rating: 100, position: 'CMF', category: 'Epic', nationality: 'Spain', ratingBonus: 3, stats: { speed: 82, shooting: 80, passing: 98, defense: 55, dribbling: 96 } },
      { id: 'p1-6', name: 'Rodri', rating: 99, position: 'DMF', category: 'Highlight', nationality: 'Spain', ratingBonus: 1, stats: { speed: 78, shooting: 80, passing: 90, defense: 94, dribbling: 82 } },
      { id: 'p1-7', name: 'P. Maldini', rating: 102, position: 'CB', category: 'Epic', nationality: 'Italy', ratingBonus: 4, stats: { speed: 86, shooting: 55, passing: 81, defense: 102, dribbling: 76 } },
      { id: 'p1-8', name: 'F. Beckenbauer', rating: 101, position: 'CB', category: 'Epic', nationality: 'Germany', ratingBonus: 3, stats: { speed: 84, shooting: 70, passing: 89, defense: 100, dribbling: 84 } },
      { id: 'p1-9', name: 'R. Carlos', rating: 100, position: 'LB', category: 'Legend', nationality: 'Brazil', ratingBonus: 2, stats: { speed: 99, shooting: 95, passing: 84, defense: 81, dribbling: 83 } },
      { id: 'p1-10', name: 'J. Zanetti', rating: 100, position: 'RB', category: 'Epic', nationality: 'Argentina', ratingBonus: 2, stats: { speed: 87, shooting: 62, passing: 86, defense: 93, dribbling: 81 } },
      { id: 'p1-11', name: 'I. Casillas', rating: 101, position: 'GK', category: 'Epic', nationality: 'Spain', ratingBonus: 3, stats: { speed: 78, shooting: 12, passing: 65, defense: 99, dribbling: 45 } }
    ],
    featured: true
  },
  {
    id: 'squad-2',
    title: 'VERIFIED MOBILE ACCOUNT #180012',
    price: 139,
    coinAmount: 850,
    gpAmount: 1800000,
    pointsAmount: 9500,
    squadRating: 97,
    teamStrength: 3160,
    divisionRank: 1,
    epicCardCount: 10,
    legendCardCount: 12,
    platform: 'Mobile',
    formation: '4-3-3',
    playstyle: 'Possession Game',
    description: 'Official verified eFootball mobile profile. Roster setup, high-tier player stats, booster indicators, and original config are shown strictly within the certified screenshot proof. Immediate transfer upon safe payment clearances.',
    squadPreviewUrl: 'https://ik.imagekit.io/0iaahkrcv/20260526_180012.jpg',
    hasMatchPass: false,
    verifiedBadge: true,
    glowColor: '#10b981', // Emerald green
    rarityTier: 'ICONIC',
    seller: {
      id: 'sell-2',
      name: 'VORZA_EscrowAgent_X',
      rating: 4.8,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
      totalSales: 194,
      responseTime: '< 15 Mins'
    },
    players: [
      { id: 'p2-1', name: 'Neymar Jr', rating: 103, position: 'LWF', category: 'Showtime', nationality: 'Brazil', ratingBonus: 3, stats: { speed: 95, shooting: 90, passing: 91, defense: 35, dribbling: 106 } },
      { id: 'p2-2', name: 'J. Cruyff', rating: 104, position: 'CF', category: 'Epic', nationality: 'Netherlands', ratingBonus: 4, stats: { speed: 94, shooting: 94, passing: 93, defense: 45, dribbling: 103 } },
      { id: 'p2-3', name: 'Romário', rating: 102, position: 'CF', category: 'Epic', nationality: 'Brazil', ratingBonus: 3, stats: { speed: 94, shooting: 98, passing: 78, defense: 38, dribbling: 97 } },
      { id: 'p2-4', name: 'S. Gerrard', rating: 101, position: 'CMF', category: 'Epic', nationality: 'England', ratingBonus: 3, stats: { speed: 86, shooting: 92, passing: 94, defense: 82, dribbling: 87 } },
      { id: 'p2-5', name: 'A. Pirlo', rating: 102, position: 'DMF', category: 'Epic', nationality: 'Italy', ratingBonus: 4, stats: { speed: 78, shooting: 85, passing: 101, defense: 75, dribbling: 94 } },
      { id: 'p2-6', name: 'K. De Bruyne', rating: 99, position: 'AMF', category: 'Highlight', nationality: 'Belgium', ratingBonus: 1, stats: { speed: 79, shooting: 88, passing: 98, defense: 54, dribbling: 90 } },
      { id: 'p2-7', name: 'P. Maldini', rating: 102, position: 'CB', category: 'Epic', nationality: 'Italy', ratingBonus: 4, stats: { speed: 86, shooting: 55, passing: 81, defense: 102, dribbling: 76 } },
      { id: 'p2-8', name: 'V. van Dijk', rating: 101, position: 'CB', category: 'Highlight', nationality: 'Netherlands', ratingBonus: 2, stats: { speed: 83, shooting: 55, passing: 81, defense: 100, dribbling: 70 } },
      { id: 'p2-9', name: 'T. Hernandez', rating: 98, position: 'LB', category: 'Highlight', nationality: 'France', ratingBonus: 1, stats: { speed: 97, shooting: 71, passing: 82, defense: 83, dribbling: 82 } },
      { id: 'p2-10', name: 'K. Walker', rating: 98, position: 'RB', category: 'Highlight', nationality: 'England', ratingBonus: 1, stats: { speed: 98, shooting: 62, passing: 79, defense: 86, dribbling: 80 } },
      { id: 'p2-11', name: 'M. ter Stegen', rating: 99, position: 'GK', category: 'Highlight', nationality: 'Germany', ratingBonus: 1, stats: { speed: 74, shooting: 15, passing: 85, defense: 97, dribbling: 50 } }
    ],
    featured: true
  },
  {
    id: 'squad-3',
    title: 'VERIFIED MOBILE ACCOUNT #180335',
    price: 160,
    coinAmount: 1100,
    gpAmount: 3100000,
    pointsAmount: 18000,
    squadRating: 98,
    teamStrength: 3210,
    divisionRank: 1,
    epicCardCount: 14,
    legendCardCount: 16,
    platform: 'Mobile',
    formation: '4-3-3',
    playstyle: 'Quick Counter',
    description: 'Fully authenticated active mobile squad. Checked and verified via original uncropped live game image representation below. Complete safety ensured, transfer code provided upon deal finalization.',
    squadPreviewUrl: 'https://ik.imagekit.io/0iaahkrcv/20260526_180335.jpg',
    hasMatchPass: true,
    verifiedBadge: true,
    glowColor: '#ef4444', // Crimson fire glow
    rarityTier: 'ICONIC',
    seller: {
      id: 'sell-3',
      name: 'VORZA_EscrowAgent_X',
      rating: 5.0,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80',
      totalSales: 94,
      responseTime: '< 10 Mins'
    },
    players: [
      { id: 'p3-1', name: 'R. Gullit', rating: 102, position: 'AMF', category: 'Big Time', nationality: 'Netherlands', ratingBonus: 4, stats: { speed: 89, shooting: 93, passing: 92, defense: 78, dribbling: 91 } },
      { id: 'p3-2', name: 'L. Messi', rating: 105, position: 'CF', category: 'Big Time', nationality: 'Argentina', ratingBonus: 5, stats: { speed: 96, shooting: 98, passing: 95, defense: 42, dribbling: 104 } },
      { id: 'p3-3', name: 'Ronaldinho', rating: 103, position: 'LWF', category: 'Epic', nationality: 'Brazil', ratingBonus: 4, stats: { speed: 98, shooting: 92, passing: 96, defense: 38, dribbling: 105 } },
      { id: 'p3-4', name: 'P. Vieira', rating: 102, position: 'DMF', category: 'Epic', nationality: 'France', ratingBonus: 4, stats: { speed: 84, shooting: 75, passing: 87, defense: 101, dribbling: 83 } },
      { id: 'p3-5', name: 'L. Modric', rating: 100, position: 'CMF', category: 'Highlight', nationality: 'Croatia', ratingBonus: 1, stats: { speed: 80, shooting: 82, passing: 97, defense: 73, dribbling: 93 } },
      { id: 'p3-6', name: 'Casemiro', rating: 99, position: 'DMF', category: 'Highlight', nationality: 'Brazil', ratingBonus: 1, stats: { speed: 76, shooting: 74, passing: 83, defense: 97, dribbling: 78 } },
      { id: 'p3-7', name: 'P. Maldini', rating: 102, position: 'CB', category: 'Epic', nationality: 'Italy', ratingBonus: 4, stats: { speed: 88, shooting: 60, passing: 84, defense: 103, dribbling: 79 } },
      { id: 'p3-8', name: 'C. Puyol', rating: 102, position: 'CB', category: 'Epic', nationality: 'Spain', ratingBonus: 4, stats: { speed: 84, shooting: 52, passing: 75, defense: 103, dribbling: 68 } },
      { id: 'p3-9', name: 'R. Carlos', rating: 101, position: 'LB', category: 'Epic', nationality: 'Brazil', ratingBonus: 3, stats: { speed: 99, shooting: 97, passing: 86, defense: 82, dribbling: 85 } },
      { id: 'p3-10', name: 'J. Zanetti', rating: 101, position: 'RB', category: 'Epic', nationality: 'Argentina', ratingBonus: 3, stats: { speed: 89, shooting: 65, passing: 88, defense: 96, dribbling: 83 } },
      { id: 'p3-11', name: 'O. Kahn', rating: 102, position: 'GK', category: 'Epic', nationality: 'Germany', ratingBonus: 4, stats: { speed: 72, shooting: 10, passing: 60, defense: 102, dribbling: 42 } }
    ],
    featured: true
  },
  {
    id: 'squad-4',
    title: 'VERIFIED MOBILE ACCOUNT #180239',
    price: 180,
    coinAmount: 1900,
    gpAmount: 4200000,
    pointsAmount: 22000,
    squadRating: 99,
    teamStrength: 3240,
    divisionRank: 1,
    epicCardCount: 16,
    legendCardCount: 20,
    platform: 'Mobile',
    formation: '4-3-3',
    playstyle: 'Possession Game',
    description: 'High-tier verified mobile eFootball profile. Roster composition, active ratings, and tactical player boosts are visually verified in the certified proof link below. Hand-over is entirely safe and immediate.',
    squadPreviewUrl: 'https://ik.imagekit.io/0iaahkrcv/20260526_180239.jpg',
    hasMatchPass: true,
    verifiedBadge: true,
    glowColor: '#a855f7', // Epic Purple Glow
    rarityTier: 'EPIC',
    seller: {
      id: 'sell-4',
      name: 'VORZA_EscrowAgent_X',
      rating: 5.0,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&q=80',
      totalSales: 890,
      responseTime: '< 3 Mins'
    },
    players: [
      { id: 'p4-1', name: 'D. Maradona', rating: 103, position: 'AMF', category: 'Epic', nationality: 'Argentina', ratingBonus: 4, stats: { speed: 92, shooting: 93, passing: 96, defense: 44, dribbling: 105 } },
      { id: 'p4-2', name: 'E. Haaland', rating: 102, position: 'CF', category: 'Showtime', nationality: 'Norway', ratingBonus: 3, stats: { speed: 97, shooting: 101, passing: 74, defense: 35, dribbling: 84 } },
      { id: 'p4-3', name: 'K. Mbappé', rating: 101, position: 'LWF', category: 'Highlight', nationality: 'France', ratingBonus: 2, stats: { speed: 101, shooting: 94, passing: 83, defense: 36, dribbling: 96 } },
      { id: 'p4-4', name: 'D. Beckham', rating: 102, position: 'RWF', category: 'Epic', nationality: 'England', ratingBonus: 3, stats: { speed: 83, shooting: 97, passing: 102, defense: 62, dribbling: 89 } },
      { id: 'p4-5', name: 'P. Vieira', rating: 102, position: 'DMF', category: 'Epic', nationality: 'France', ratingBonus: 4, stats: { speed: 84, shooting: 75, passing: 87, defense: 101, dribbling: 83 } },
      { id: 'p4-6', name: 'A. Iniesta', rating: 101, position: 'CMF', category: 'Epic', nationality: 'Spain', ratingBonus: 3, stats: { speed: 84, shooting: 82, passing: 99, defense: 58, dribbling: 97 } },
      { id: 'p4-7', name: 'C. Puyol', rating: 102, position: 'CB', category: 'Epic', nationality: 'Spain', ratingBonus: 4, stats: { speed: 84, shooting: 52, passing: 75, defense: 103, dribbling: 68 } },
      { id: 'p4-8', name: 'P. Maldini', rating: 102, position: 'CB', category: 'Epic', nationality: 'Italy', ratingBonus: 4, stats: { speed: 87, shooting: 58, passing: 83, defense: 102, dribbling: 78 } },
      { id: 'p4-9', name: 'A. Davies', rating: 98, position: 'LB', category: 'Highlight', nationality: 'Canada', ratingBonus: 1, stats: { speed: 102, shooting: 68, passing: 80, defense: 81, dribbling: 89 } },
      { id: 'p4-10', name: 'T. Alexander-Arnold', rating: 99, position: 'RB', category: 'Highlight', nationality: 'England', ratingBonus: 1, stats: { speed: 88, shooting: 80, passing: 98, defense: 81, dribbling: 86 } },
      { id: 'p4-11', name: 'P. Schmeichel', rating: 103, position: 'GK', category: 'Epic', nationality: 'Denmark', ratingBonus: 5, stats: { speed: 75, shooting: 12, passing: 66, defense: 103, dribbling: 48 } }
    ],
    featured: true
  }
];

export const MOCK_ACTIVITIES: LiveActivity[] = [
  { id: 'act-1', timestamp: 'Just now', type: 'sale', user: 'ViperSquad_X', squadName: 'VERIFIED MOBILE ACCOUNT #180143', value: '$145' },
  { id: 'act-2', timestamp: '2 mins ago', type: 'listing', user: 'eF_Lord99', squadName: 'VERIFIED MOBILE ACCOUNT #180239', value: '$180' },
  { id: 'act-3', timestamp: '5 mins ago', type: 'verification', user: 'VORZA_Escrow', squadName: 'VERIFIED MOBILE ACCOUNT #180012', value: 'VERIFIED PASS' },
  { id: 'act-4', timestamp: '8 mins ago', type: 'offer', user: 'eFootball_Guru', squadName: 'VERIFIED MOBILE ACCOUNT #180335', value: '$160 Accepted' }
];

export const MOCK_REVIEWS = [
  { id: 'rev-1', user: 'Amir_K', rating: 5, text: 'Instantly synced with my Konami ID. The preview image perfectly matched the in-game assets down to the exact points and players.', date: '1 day ago' },
  { id: 'rev-2', user: 'Kylian_Stan', rating: 5, text: 'Clean and safe billing flow. Got verification proof seconds after purchasing. An absolute game changer.', date: '3 days ago' },
  { id: 'rev-3', user: 'GamerD_9', rating: 5, text: 'Best interface for account verification. Escrow code arrived instantly.', date: '1 week ago' }
];

export const SQUAD_CATEGORIES = [
  { name: 'All Accounts', count: 4 },
  { name: 'Division 1 Accounts', count: 4, color: 'from-amber-500/10 to-transparent border-amber-500/30' },
  { name: 'Verified Screenshot Proofs', count: 4, color: 'from-cyan-500/10 to-transparent border-cyan-500/30' }
];
