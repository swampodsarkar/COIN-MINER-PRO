// FIX: Added type definitions for the application.
export type Rank = 'Warrior' | 'Elite' | 'Master' | 'Grandmaster' | 'Epic' | 'Legend' | 'Mythic';

export interface Emblem {
    level: number;
    xp: number;
}

export interface MembershipInfo {
    type: 'weekly' | 'monthly';
    startedAt: number;
    expiresAt: number;
    lastClaimedDailyDiamonds: string; // ISO date string YYYY-MM-DD
}

export interface Player {
    uid: string;
    username: string;
    email: string;
    gold: number;
    diamonds: number;
    ownedHeroes: string[];
    ownedSkins: string[];
    emblems: {
        physical: Emblem;
        magical: Emblem;
        tank: Emblem;
    };
    banned: boolean;
    lastLogin: string; // ISO date string YYYY-MM-DD
    dailyRewardClaimed: boolean;
    loginStreak: number;
    rank: Rank;
    rankPoints: number;
    activeMembership: MembershipInfo | null;
}

export interface SystemData {
    season: number;
    events: {
        goldenRush: boolean;
        goldenRushEnds: number;
    };
}

export interface LeaderboardEntry {
    uid: string;
    username: string;
    rankPoints: number;
    rank: Rank;
}

export interface Notification {
    id: string;
    message: string;
    timestamp: number;
}

export interface Skin {
    id: string;
    name: string;
    fullUrl: string;
    iconUrl: string;
}

export interface Hero {
    id: string;
    name: string;
    role: 'Fighter' | 'Mage' | 'Marksman' | 'Tank';
    cost: {
        gold: number;
        diamonds: number;
    };
    skins: Skin[];
}

export interface MatchHistory {
    id: string;
    opponentName: string;
    result: 'win' | 'loss';
    rankPointsChange: number;
    timestamp: number;
}
