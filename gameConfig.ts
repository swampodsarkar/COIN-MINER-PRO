export interface Axe {
    id: string;
    name: string;
    type: 'normal' | 'rare';
    power: number;
    cost: number;
    currency: 'gold' | 'gems';
    emoji: string;
}

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

export const AUTO_MINER_CONFIG = {
    baseCost: 50,
    costMultiplier: 1.5,
    baseGoldPerSecond: 0.1,
};

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