import { Player } from './types';

export const ADMIN_EMAILS: string[] = ['admin@click2mine.com', 'maruf@example.com'];

export const AVATAR_EMOJIS = ['😀', '😎', '😼', '👻', '👽', '🤖', '👾', '🦊', '🐻', '🐼', '🐨', '🦁', '🐸', '🎃', '🔥', '⭐', '👑', '🎩'];


const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const INITIAL_PLAYER_STATE: Omit<Player, 'uid' | 'username' | 'email'> = {
    gold: 500,
    diamonds: 0,
    ownedCharacters: ['alok'], // Start with a default character
    avatar: '😀', // Default avatar, will be randomized on creation
    banned: false,
    lastLogin: yesterday.toISOString().split('T')[0], // Set to yesterday for new players
    dailyRewardClaimed: false, // They can claim on first login
    loginStreak: 0,
    rank: 'Bronze',
    rankPoints: 0,
    activeMembership: null,
    ownedPets: [],
    equippedPet: null,
};