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

const CDN_BASE = 'https://firebasestorage.googleapis.com/v0/b/gen-z-airdrop.appspot.com/o';

export const HEROES: Record<string, Hero> = {
    toro: {
        id: 'toro',
        name: 'Toro',
        role: 'Tank',
        cost: { gold: 0, diamonds: 0 },
        skins: [{
            id: 'toro_default',
            name: 'Default',
            fullUrl: `${CDN_BASE}/heroes%2Ftoro_full.png?alt=media&token=e858079a-14a0-4565-be33-313837f40778`,
            iconUrl: `${CDN_BASE}/heroes%2Ftoro_icon.png?alt=media&token=e9597c27-1c23-44c1-9d22-26a1b827e69f`
        }]
    },
    valhein: {
        id: 'valhein',
        name: 'Valhein',
        role: 'Marksman',
        cost: { gold: 3000, diamonds: 0 },
        skins: [{
            id: 'valhein_default',
            name: 'Default',
            fullUrl: `${CDN_BASE}/heroes%2Fvalhein_full.png?alt=media&token=1d74c0b4-3588-4672-8417-09b757e31b79`,
            iconUrl: `${CDN_BASE}/heroes%2Fvalhein_icon.png?alt=media&token=2d4d80a1-a64e-4f73-9556-9d107297e682`
        }]
    },
    veera: {
        id: 'veera',
        name: 'Veera',
        role: 'Mage',
        cost: { gold: 3000, diamonds: 0 },
        skins: [{
            id: 'veera_default',
            name: 'Default',
            fullUrl: `${CDN_BASE}/heroes%2Fveera_full.png?alt=media&token=b3f6847a-24a9-4b68-80e2-66236b35e8d9`,
            iconUrl: `${CDN_BASE}/heroes%2Fveera_icon.png?alt=media&token=07c24f5a-c4f4-4a25-83e0-63116a4b162f`
        }]
    },
    zuka: {
        id: 'zuka',
        name: 'Zuka',
        role: 'Fighter',
        cost: { gold: 0, diamonds: 500 },
        skins: [{
            id: 'zuka_default',
            name: 'Default',
            fullUrl: `${CDN_BASE}/heroes%2Fzuka_full.png?alt=media&token=6d4a046c-5f80-4963-8a3b-21d3f23a9686`,
            iconUrl: `${CDN_BASE}/heroes%2Fzuka_icon.png?alt=media&token=592d6e33-2895-4682-a590-0f2c4179e830`
        }]
    }
};
