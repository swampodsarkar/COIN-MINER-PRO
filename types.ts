export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Heroic' | 'Grandmaster';

export interface MembershipInfo {
    type: 'weekly' | 'monthly';
    startedAt: number;
    expiresAt: number;
    lastClaimedDailyDiamonds: string; // ISO date string YYYY-MM-DD
}

export interface Pet {
    id: string;
    name: string;
    emoji: string;
    cost: {
        gold: number;
        diamonds: number;
    };
    abilityName: string;
    abilityDescription: string;
}

export interface ClanMember {
    uid: string;
    username: string;
    rank: Rank;
}

export interface Clan {
    id: string;
    name: string;
    tag: string;
    leaderUid: string;
    members: Record<string, ClanMember>; // key is player uid
}

export interface Player {
    uid:string;
    username: string;
    email: string;
    gold: number;
    diamonds: number;
    ownedCharacters: string[];
    avatar: string; // Player's unique emoji avatar
    banned: boolean;
    lastLogin: string; // ISO date string YYYY-MM-DD
    dailyRewardClaimed: boolean;
    loginStreak: number;
    rank: Rank;
    rankPoints: number;
    activeMembership: MembershipInfo | null;
    ownedPets: string[];
    equippedPet: string | null;
    clanId?: string;
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

export interface Character {
    id: string;
    name: string;
    role: 'Rusher' | 'Support' | 'Sniper' | 'Scout';
    emoji: string;
    cost: {
        gold: number;
        diamonds: number;
    };
    abilityName: string;
    abilityDescription: string;
}

export interface MatchHistory {
    id: string;
    placement: number;
    kills: number;
    result: 'VICTORY' | 'DEFEAT';
    rankPointsChange: number;
    timestamp: number;
    playerCharacterId: string;
    mode?: 'br' | 'cs';
}

export interface Weapon {
    id: string;
    name: string;
    tier: number;
    emoji: string;
}

export interface Armor {
    id: string;
    name: string;
    tier: number;
    emoji: string;
}

export interface Helmet {
    id: string;
    name: string;
    tier: number;
    emoji: string;
}
