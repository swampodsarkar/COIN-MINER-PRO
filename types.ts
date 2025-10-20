export type Division =
    | 'Division 10'
    | 'Division 9'
    | 'Division 8'
    | 'Division 7'
    | 'Division 6'
    | 'Division 5'
    | 'Division 4'
    | 'Division 3'
    | 'Division 2'
    | 'Division 1';

export interface MatchHistory {
    id: string;
    result: 'WIN' | 'DEFEAT' | 'DRAW';
    score: string;
    mode: 'ai' | 'division';
    timestamp: number;
    gpChange: number;
    divisionPointsChange: number;
}

export type Strategy = 'DEFENSIVE' | 'BALANCED' | 'ATTACKING';

export interface Player {
    uid: string;
    username: string;
    email: string;
    gp: number;
    coins: number;
    avatar: string;
    banned: boolean;
    lastLogin: string;
    division: Division;
    divisionPoints: number;
    ownedPlayerIds: string[];
    squad: string[];
    substitutes: string[];
    activeFormationId: string;
    matchHistory: { [key: string]: Omit<MatchHistory, 'id'> };
    activeMembership?: {
        type: 'weekly' | 'monthly';
        startedAt: number;
        expiresAt: number;
        lastClaimedDailyDiamonds: string;
    };
}

export interface LeaderboardEntry {
    uid: string;
    username: string;
    division: Division;
    divisionPoints: number;
}

export interface SystemData {
    season: number;
    events: {
        goldenRush: boolean;
        goldenRushEnds: number;
    };
}

export interface Notification {
    id: string;
    message: string;
    timestamp: number;
}

export interface PlayerData {
    id: string;
    name: string;
    position: 'GK' | 'CB' | 'LB' | 'RB' | 'DMF' | 'CMF' | 'AMF' | 'LWF' | 'RWF' | 'SS' | 'CF';
    overall: number;
    rarity: 'Standard' | 'Featured' | 'Legendary';
}

export interface Formation {
    name: string;
    positions: string[]; // e.g., ['GK', 'LB', 'CB', 'CB', 'RB', ...]
    coordinates: { x: number; y: number }[];
}


// Types for 2D Match Simulation
export interface FieldPlayer {
    id: string;
    team: 'player' | 'opponent';
    x: number;
    y: number;
    initialX: number;
    initialY: number;
    hasBall: boolean;
    data: PlayerData;
}

export interface Ball {
    x: number;
    y: number;
    carrierId: string | null;
    targetX: number;
    targetY: number;
}
