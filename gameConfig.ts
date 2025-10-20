import { Character, Rank, Pet, Weapon, Armor, Helmet } from './types';

export const RANKS: Record<Rank, { color: string, pointsToAdvance: number | null }> = {
    Bronze: { color: '#cd7f32', pointsToAdvance: 100 },
    Silver: { color: '#c0c0c0', pointsToAdvance: 200 },
    Gold: { color: '#ffd700', pointsToAdvance: 300 },
    Platinum: { color: '#e5e4e2', pointsToAdvance: 400 },
    Diamond: { color: '#b9f2ff', pointsToAdvance: 500 },
    Heroic: { color: '#ff4500', pointsToAdvance: 600 },
    Grandmaster: { color: '#b10021', pointsToAdvance: null }, // Highest rank
};

export const CHARACTERS: Record<string, Character> = {
    alok: {
        id: 'alok',
        name: 'Alok',
        role: 'Support',
        emoji: '🎧',
        cost: { gold: 0, diamonds: 0 },
        abilityName: 'Drop the Beat',
        abilityDescription: 'Creates a 5m aura that increases movement speed and restores HP.'
    },
    kelly: {
        id: 'kelly',
        name: 'Kelly',
        role: 'Scout',
        emoji: '🏃‍♀️',
        cost: { gold: 2000, diamonds: 0 },
        abilityName: 'Dash',
        abilityDescription: 'Increases sprinting speed.'
    },
    chrono: {
        id: 'chrono',
        name: 'Chrono',
        role: 'Rusher',
        emoji: '🛡️',
        cost: { gold: 8000, diamonds: 0 },
        abilityName: 'Time Turner',
        abilityDescription: 'Creates a force field that blocks damage from enemies.'
    },
    moco: {
        id: 'moco',
        name: 'Moco',
        role: 'Sniper',
        emoji: '🎯',
        cost: { gold: 8000, diamonds: 0 },
        abilityName: 'Hacker\'s Eye',
        abilityDescription: 'Tags enemies that are shot, sharing the information with teammates.'
    },
    hayato: {
        id: 'hayato',
        name: 'Hayato',
        role: 'Rusher',
        emoji: '⚔️',
        cost: { gold: 0, diamonds: 500 },
        abilityName: 'Bushido',
        abilityDescription: 'The lower your HP, the higher your armor penetration becomes.'
    },
    paloma: {
        id: 'paloma',
        name: 'Paloma',
        role: 'Support',
        emoji: '💃',
        cost: { gold: 6000, diamonds: 0 },
        abilityName: 'Arms-dealing',
        abilityDescription: 'Able to carry AR ammo without taking up inventory space.'
    },
};

export const PETS: Record<string, Pet> = {
    panda: {
        id: 'panda',
        name: 'Detective Panda',
        emoji: '🐼',
        cost: { gold: 10000, diamonds: 0 },
        abilityName: 'Panda\'s Blessings',
        abilityDescription: 'Gain extra gold for each kill in a match.',
    },
    ottero: {
        id: 'ottero',
        name: 'Ottero',
        emoji: '🦦',
        cost: { gold: 0, diamonds: 400 },
        abilityName: 'Double Blubber',
        abilityDescription: 'Start with a small damage shield.',
    },
    falco: {
        id: 'falco',
        name: 'Falco',
        emoji: '🦅',
        cost: { gold: 8000, diamonds: 0 },
        abilityName: 'Skyline Spree',
        abilityDescription: 'Land faster, giving you a slight head start.',
    }
};

export const WEAPONS: Record<string, Weapon> = {
    pistol: { id: 'pistol', name: 'Pistol', tier: 1, emoji: '🔫' },
    smg: { id: 'smg', name: 'SMG', tier: 2, emoji: '💥' },
    ar: { id: 'ar', name: 'Assault Rifle', tier: 3, emoji: '💣' },
    sniper: { id: 'sniper', name: 'Sniper Rifle', tier: 4, emoji: '🔭' },
};

export const ARMOR: Record<string, Armor> = {
    vest1: { id: 'vest1', name: 'Level 1 Vest', tier: 1, emoji: '👕' },
    vest2: { id: 'vest2', name: 'Level 2 Vest', tier: 2, emoji: '👕' },
    vest3: { id: 'vest3', name: 'Level 3 Vest', tier: 3, emoji: '👕' },
    vest4: { id: 'vest4', name: 'Level 4 Vest', tier: 4, emoji: '👕' },
};

export const HELMETS: Record<string, Helmet> = {
    helmet1: { id: 'helmet1', name: 'Level 1 Helmet', tier: 1, emoji: '⛑️' },
    helmet2: { id: 'helmet2', name: 'Level 2 Helmet', tier: 2, emoji: '⛑️' },
    helmet3: { id: 'helmet3', name: 'Level 3 Helmet', tier: 3, emoji: '⛑️' },
    helmet4: { id: 'helmet4', name: 'Level 4 Helmet', tier: 4, emoji: '⛑️' },
};

export const MAP_LOCATIONS = ['Mill', 'Shipyard', 'Observatory', 'Power Plant', 'Riverside', 'Hangar', 'Graveyard'];
