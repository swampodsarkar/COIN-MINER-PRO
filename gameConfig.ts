// FIX: Added type imports and defined RANKS and HEROES constants.
import { Hero, Rank } from './types';

export const RANKS: Record<Rank, { color: string, pointsToAdvance: number | null }> = {
    Warrior: { color: '#a1a1aa', pointsToAdvance: 100 },
    Elite: { color: '#78716c', pointsToAdvance: 200 },
    Master: { color: '#f59e0b', pointsToAdvance: 300 },
    Grandmaster: { color: '#ef4444', pointsToAdvance: 400 },
    Epic: { color: '#a855f7', pointsToAdvance: 500 },
    Legend: { color: '#ec4899', pointsToAdvance: 600 },
    Mythic: { color: '#3b82f6', pointsToAdvance: null }, // Highest rank
};

export const EMBLEM_CONFIG = {
    maxLevel: 20,
    // Function to calculate XP needed for the next level
    xpForNextLevel: (level: number) => 50 * level,
    // Function to calculate the gold cost for one upgrade action
    upgradeCost: (level: number) => 25 * level,
    // How much XP is gained per upgrade click
    xpPerUpgrade: 10,
};

export const HEROES: Record<string, Hero> = {
    toro: {
        id: 'toro',
        name: 'Toro',
        role: 'Tank',
        emoji: '🐂',
        cost: { gold: 0, diamonds: 0 },
    },
    valhein: {
        id: 'valhein',
        name: 'Valhein',
        role: 'Marksman',
        emoji: '🏹',
        cost: { gold: 3000, diamonds: 0 },
    },
    veera: {
        id: 'veera',
        name: 'Veera',
        role: 'Mage',
        emoji: '🔮',
        cost: { gold: 3000, diamonds: 0 },
    },
    zuka: {
        id: 'zuka',
        name: 'Zuka',
        role: 'Fighter',
        emoji: '🐼',
        cost: { gold: 0, diamonds: 500 },
    },
    arthur: {
        id: 'arthur',
        name: 'Arthur',
        role: 'Fighter',
        emoji: '⚔️',
        cost: { gold: 5000, diamonds: 0 },
    },
    butterfly: {
        id: 'butterfly',
        name: 'Butterfly',
        role: 'Assassin',
        emoji: '🦋',
        cost: { gold: 8000, diamonds: 0 },
    },
    krixi: {
        id: 'krixi',
        name: 'Krixi',
        role: 'Mage',
        emoji: '🧚',
        cost: { gold: 0, diamonds: 800 },
    }
};