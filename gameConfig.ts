import { Rank } from './types';

export interface Axe {
    id: string;
    name: string;
    type: 'normal' | 'rare';
    power: number;
    cost: number;
    currency: 'gold' | 'gems';
    emoji: string;
}

export interface Hero {
    id: string;
    name: string;
    rarity: 'common' | 'rare' | 'legendary';
    cost: number; // in gems
    powerMultiplier: number;
    secondaryBuff?: {
        description: string;
        gemDropChance?: number; // e.g. 0.02 for 2%
    };
    emoji: string;
}

export const RANKS: Record<Rank, { minRP: number, maxRP: number, color: string, stakeRange: [number, number], rpChange: [number, number] }> = {
    Bronze:   { minRP: 0,    maxRP: 99,   color: '#cd7f32', stakeRange: [10, 50],   rpChange: [10, -8] },
    Silver:   { minRP: 100,  maxRP: 299,  color: '#c0c0c0', stakeRange: [50, 150],  rpChange: [10, -8] },
    Gold:     { minRP: 300,  maxRP: 599,  color: '#ffd700', stakeRange: [150, 400], rpChange: [12, -10] },
    Platinum: { minRP: 600,  maxRP: 999,  color: '#e5e4e2', stakeRange: [400, 1000], rpChange: [12, -10] },
    Diamond:  { minRP: 1000, maxRP: 1499, color: '#b9f2ff', stakeRange: [1000, 2500],rpChange: [15, -12] },
    Heroic:   { minRP: 1500, maxRP: Infinity, color: '#ff4500', stakeRange: [2500, 5000],rpChange: [15, -12] },
};

export const getRankFromRP = (rp: number): Rank => {
    if (rp < 100) return 'Bronze';
    if (rp < 300) return 'Silver';
    if (rp < 600) return 'Gold';
    if (rp < 1000) return 'Platinum';
    if (rp < 1500) return 'Diamond';
    return 'Heroic';
};

export const AXES: Record<string, Omit<Axe, 'id'>> = {
    'stone_axe': { name: 'Stone Axe', type: 'normal', power: 1, cost: 0, currency: 'gold', emoji: '🪨' },
    'copper_pickaxe': { name: 'Copper Pickaxe', type: 'normal', power: 2, cost: 250, currency: 'gold', emoji: '⛏️' },
    'iron_pickaxe': { name: 'Iron Pickaxe', type: 'normal', power: 5, cost: 1000, currency: 'gold', emoji: '🔩' },
    'gold_pickaxe': { name: 'Gold Pickaxe', type: 'normal', power: 10, cost: 5000, currency: 'gold', emoji: '⭐' },
    'diamond_pickaxe': { name: 'Diamond Pickaxe', type: 'normal', power: 20, cost: 20000, currency: 'gold', emoji: '💎' },

    'amethyst_axe': { name: 'Amethyst Axe', type: 'rare', power: 30, cost: 50, currency: 'gems', emoji: '🔮' },
    'ruby_smasher': { name: 'Ruby Smasher', type: 'rare', power: 50, cost: 150, currency: 'gems', emoji: '🩸' },
    'cosmic_drill': { name: 'Cosmic Drill', type: 'rare', power: 100, cost: 300, currency: 'gems', emoji: '🌌' },
};

export const HEROES: Record<string, Omit<Hero, 'id'>> = {
    'dwarven_smith': { 
        name: 'Dwarven Smith', 
        rarity: 'common',
        cost: 500, 
        powerMultiplier: 1.1, // 10% boost
        emoji: '🛠️' 
    },
    'rock_golem': { 
        name: 'Rock Golem',
        rarity: 'rare',
        cost: 600, 
        powerMultiplier: 1.25, // 25% boost
        secondaryBuff: {
            description: "+2% Gem Drop Chance",
            gemDropChance: 0.02
        },
        emoji: '🗿' 
    },
    'crystal_king': { 
        name: 'Crystal King', 
        rarity: 'legendary',
        cost: 999, 
        powerMultiplier: 1.5, // 50% boost
        secondaryBuff: {
            description: "+5% Gem Drop Chance",
            gemDropChance: 0.05
        },
        emoji: '👑' 
    },
};

export const AUTO_MINER_CONFIG = {
    baseCost: 50,
    costMultiplier: 1.5,
    baseGoldPerSecond: 0.1,
};

export const BASE_GEM_DROP_CHANCE = 0.005; // 0.5% base chance

export const LUCK_ROYALE_COST = 50;
export const LUCK_ROYALE_GUARANTEED_SPINS = 50;

export interface LuckRoyaleReward {
    type: 'gold' | 'gems' | 'axe';
    value?: number | string; // amount for gold/gems, axe id for axe
    weight: number;
    message: (value: any) => string;
}

export const LUCK_ROYALE_REWARDS: LuckRoyaleReward[] = [
    // Common Rewards
    { type: 'gold', value: 10, weight: 40, message: (v) => `You won ${v} Gold! 💰` },
    { type: 'gold', value: 25, weight: 20, message: (v) => `You won ${v} Gold! 💰` },
    { type: 'gems', value: 1, weight: 28, message: (v) => `You found a Gem! 💎` },

    // Rare Rewards
    { type: 'axe', value: 'amethyst_axe', weight: 7, message: (v) => `RARE DROP! You found the ${AXES[v].name}! ${AXES[v].emoji}` },
    { type: 'axe', value: 'ruby_smasher', weight: 4, message: (v) => `EPIC DROP! You unearthed the ${AXES[v].name}! ${AXES[v].emoji}` },
    { type: 'axe', value: 'cosmic_drill', weight: 1, message: (v) => `LEGENDARY! You've discovered the ${AXES[v].name}! ${AXES[v].emoji}` },
];