export interface Player {
    uid: string;
    username: string;
    email: string;
    gold: number;
    gems: number;
    equipment: {
        equippedAxe: string; // ID of the axe
    };
    inventory: {
        axes: string[]; // array of axe IDs
    };
    luckRoyaleSpins: number;
    autoMinerLevel: number;
    banned: boolean;
    lastLogin: string; // ISO string
    dailyRewardClaimed: boolean;
    loginStreak: number;
    activeMatch?: string | null;
}

export interface LeaderboardEntry {
    uid: string;
    username: string;
    gold: number;
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
    betAmount: number;
    timestamp: number;
}

export interface ChallengeMatch {
    matchId: string;
    status: 'countdown' | 'inprogress' | 'finished' | 'cancelled';
    betAmount: number;
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
    betAmount: number;
    result: 'win' | 'loss' | 'draw';
    timestamp: number;
}