import { Player } from './types';

export const ADMIN_EMAILS: string[] = ['admin@click2mine.com', 'maruf@example.com'];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const INITIAL_PLAYER_STATE: Omit<Player, 'uid' | 'username' | 'email'> = {
    gold: 0,
    gems: 5,
    equipment: {
        equippedAxe: 'stone_axe',
        equippedHero: null,
    },
    inventory: {
        axes: ['stone_axe'],
        heroes: [],
    },
    luckRoyaleSpins: 0,
    autoMinerLevel: 0,
    banned: false,
    lastLogin: yesterday.toISOString().split('T')[0], // Set to yesterday for new players
    dailyRewardClaimed: false, // They can claim on first login
    loginStreak: 0,
    rank: 'Bronze',
    rankPoints: 0,
};