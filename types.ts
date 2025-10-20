export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Heroic';

export interface MembershipInfo {
    type: 'weekly' | 'monthly';
    expiresAt: number; // Timestamp
    lastClaimedDailyGems: string; // YYYY-MM-DD
}

export interface Player {
    uid: string;
    username: string;
    email: string;
    gold: number;
    gems: number;
    equipment: {
        equippedAxe: string; // ID of the axe
        equippedHero: string | null; // ID of the hero
    };
    inventory: {
        axes: string[]; // array of axe IDs
        heroes: string[]; // array of hero IDs
    };
    luckRoyaleSpins: number;
    autoMinerLevel: number;
    miningPowerLevel: number;
    banned: boolean;
    lastLogin: string; // ISO string
    dailyRewardClaimed: boolean;
    loginStreak: number;
    activeMatch?: string | null;
    rank: Rank;
    rankPoints: number;
    activeMembership?: MembershipInfo | null;
}

export interface LeaderboardEntry {
    uid: string;
    username: string;
    gold: number;
    rankPoints: number;
    rank: Rank;
}

export interface GameConfig {
    upgradeCosts: {
        miningPower: { base: number, multiplier: number };
        miningSpeed: { base: number, multiplier: number };
        autoMiner: { base: number, multiplier: number };
    };
    adRewardMultiplier: number;
    miningDifficulty: number;
}

export interface SystemData {
    season: number;
    events: {
        goldenRush: boolean;
        goldenRushEnds: number; // Timestamp
    };
}

export interface Notification {
    id: string;
    message: string;
    timestamp: number;
}

export interface ChallengeQueueEntry {
    uid: string;
    username: string;
    rank: Rank;
    timestamp: number;
}

export interface ChallengeMatch {
    matchId: string;
    status: 'countdown' | 'inprogress' | 'finished' | 'cancelled';
    goldAtStake: number;
    startTime: number;
    
    player1: {
        uid: string;
        username: string;
        score: number;
    };

    player2: {
        uid: string;
        username: string;
        score: number;
    };

    winner?: string; // uid of the winner
}

export interface ChallengeHistoryEntry {
    opponentUsername: string;
    goldChange: number;
    result: 'win' | 'loss' | 'draw';
    timestamp: number;
    rankPointsChange: number;
}