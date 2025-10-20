
import { Player } from './types';

export const ADMIN_EMAILS: string[] = ['admin@click2mine.com', 'maruf@example.com'];

export const INITIAL_PLAYER_STATE: Omit<Player, 'uid' | 'username' | 'email'> = {
    gold: 0,
    gems: 5,
    equipment: {
        equippedAxe: 'stone_axe',
    },
    inventory: {
        axes: ['stone_axe'],
    },
    luckRoyaleSpins: 0,
    autoMinerLevel: 0,
    banned: false,
    lastLogin: new Date().toISOString().split('T')[0],
    dailyRewardClaimed: true,
    loginStreak: 1,
};