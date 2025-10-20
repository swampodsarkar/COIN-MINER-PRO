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
    }
};