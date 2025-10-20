
export interface Player {
    uid: string;
    username: string;
    email: string;
    gold: number;
    gems: number;
    miningPower: number;
    miningSpeed: number;
    autoMinerLevel: number;
    banned: boolean;
    lastLogin: string; // ISO string
    dailyRewardClaimed: boolean;
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
