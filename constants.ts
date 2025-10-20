
import { Player } from './types';

export const ADMIN_EMAILS: string[] = ['admin@click2mine.com', 'maruf@example.com'];

export const INITIAL_PLAYER_STATE: Omit<Player, 'uid' | 'username' | 'email'> = {
    gold: 0,
    gems: 5,
    miningPower: 1,
    miningSpeed: 1, // clicks per second
    autoMinerLevel: 0,
    banned: false,
    lastLogin: new Date().toISOString().split('T')[0],
    dailyRewardClaimed: true,
};
