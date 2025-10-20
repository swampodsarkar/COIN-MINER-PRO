import { Player } from './types';

export const ADMIN_EMAILS: string[] = ['admin@click2mine.com', 'maruf@example.com'];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const INITIAL_PLAYER_STATE: Omit<Player, 'uid' | 'username' | 'email'> = {
    gold: 500,
    diamonds: 0,
    ownedHeroes: ['toro'], // Start with a default hero
    ownedSkins: ['toro_default'],
    emblems: {
        physical: { level: 1, xp: 0 },
        magical: { level: 1, xp: 0 },
        tank: { level: 1, xp: 0 },
    },
    banned: false,
    lastLogin: yesterday.toISOString().split('T')[0], // Set to yesterday for new players
    dailyRewardClaimed: false, // They can claim on first login
    loginStreak: 0,
    rank: 'Warrior',
    rankPoints: 0,
    activeMembership: null,
};
