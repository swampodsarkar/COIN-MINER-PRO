import { Division, PlayerData, Formation } from './types';

export const DIVISIONS: Record<Division, { name: Division, color: string, pointsToPromote: number, pointsToRelegate: number | null }> = {
    'Division 10': { name: 'Division 10', color: '#8a8a8a', pointsToPromote: 10, pointsToRelegate: null },
    'Division 9': { name: 'Division 9', color: '#a1a1a1', pointsToPromote: 12, pointsToRelegate: 3 },
    'Division 8': { name: 'Division 8', color: '#b9b9b9', pointsToPromote: 15, pointsToRelegate: 5 },
    'Division 7': { name: 'Division 7', color: '#6ab04c', pointsToPromote: 18, pointsToRelegate: 7 },
    'Division 6': { name: 'Division 6', color: '#7bed9f', pointsToPromote: 21, pointsToRelegate: 9 },
    'Division 5': { name: 'Division 5', color: '#48dbfb', pointsToPromote: 25, pointsToRelegate: 12 },
    'Division 4': { name: 'Division 4', color: '#0abde3', pointsToPromote: 30, pointsToRelegate: 15 },
    'Division 3': { name: 'Division 3', color: '#f368e0', pointsToPromote: 35, pointsToRelegate: 18 },
    'Division 2': { name: 'Division 2', color: '#ff9ff3', pointsToPromote: 40, pointsToRelegate: 22 },
    'Division 1': { name: 'Division 1', color: '#feca57', pointsToPromote: Infinity, pointsToRelegate: 28 },
};

export const PLAYERS: Record<string, PlayerData> = {
    // Standard Players
    'std_gk_1': { id: 'std_gk_1', name: 'A. Becker', position: 'GK', overall: 80, rarity: 'Standard' },
    'std_cb_1': { id: 'std_cb_1', name: 'V. van Dijk', position: 'CB', overall: 82, rarity: 'Standard' },
    'std_cb_2': { id: 'std_cb_2', name: 'R. Dias', position: 'CB', overall: 81, rarity: 'Standard' },
    'std_lb_1': { id: 'std_lb_1', name: 'A. Robertson', position: 'LB', overall: 78, rarity: 'Standard' },
    'std_rb_1': { id: 'std_rb_1', name: 'T. Alexander-Arnold', position: 'RB', overall: 79, rarity: 'Standard' },
    'std_dmf_1': { id: 'std_dmf_1', name: 'Rodri', position: 'DMF', overall: 81, rarity: 'Standard' },
    'std_cmf_1': { id: 'std_cmf_1', name: 'K. De Bruyne', position: 'CMF', overall: 83, rarity: 'Standard' },
    'std_amf_1': { id: 'std_amf_1', name: 'B. Fernandes', position: 'AMF', overall: 80, rarity: 'Standard' },
    'std_lwf_1': { id: 'std_lwf_1', name: 'Vini Jr.', position: 'LWF', overall: 82, rarity: 'Standard' },
    'std_rwf_1': { id: 'std_rwf_1', name: 'M. Salah', position: 'RWF', overall: 81, rarity: 'Standard' },
    'std_cf_1': { id: 'std_cf_1', name: 'E. Haaland', position: 'CF', overall: 84, rarity: 'Standard' },
    // Standard Subs
    'std_gk_2': { id: 'std_gk_2', name: 'M. ter Stegen', position: 'GK', overall: 78, rarity: 'Standard' },
    'std_cb_3': { id: 'std_cb_3', name: 'É. Militão', position: 'CB', overall: 79, rarity: 'Standard' },
    'std_cmf_2': { id: 'std_cmf_2', name: 'J. Bellingham', position: 'CMF', overall: 81, rarity: 'Standard' },
    'std_cmf_3': { id: 'std_cmf_3', name: 'F. de Jong', position: 'CMF', overall: 79, rarity: 'Standard' },
    'std_lwf_2': { id: 'std_lwf_2', name: 'K. Mbappé', position: 'LWF', overall: 83, rarity: 'Standard' },
    'std_rwf_2': { id: 'std_rwf_2', name: 'L. Messi', position: 'RWF', overall: 85, rarity: 'Standard' },
    'std_cf_2': { id: 'std_cf_2', name: 'R. Lewandowski', position: 'CF', overall: 82, rarity: 'Standard' },

    // Featured Players
    'ft_messi': { id: 'ft_messi', name: 'L. Messi (Featured)', position: 'RWF', overall: 96, rarity: 'Featured' },
    'ft_ronaldo': { id: 'ft_ronaldo', name: 'C. Ronaldo (Featured)', position: 'CF', overall: 95, rarity: 'Featured' },
    'ft_neymar': { id: 'ft_neymar', name: 'Neymar Jr (Featured)', position: 'LWF', overall: 94, rarity: 'Featured' },

    // Legendary Players
    'leg_maradona': { id: 'leg_maradona', name: 'D. Maradona (Legend)', position: 'AMF', overall: 98, rarity: 'Legendary' },
    'leg_cruyff': { id: 'leg_cruyff', name: 'J. Cruyff (Legend)', position: 'SS', overall: 97, rarity: 'Legendary' },
    'leg_maldini': { id: 'leg_maldini', name: 'P. Maldini (Legend)', position: 'CB', overall: 96, rarity: 'Legendary' },
};

export const FORMATIONS: Record<string, Formation> = {
    '4-3-3': {
        name: '4-3-3',
        positions: ['GK', 'RB', 'CB', 'CB', 'LB', 'DMF', 'CMF', 'CMF', 'RWF', 'LWF', 'CF'],
    },
    '4-4-2': {
        name: '4-4-2',
        positions: ['GK', 'RB', 'CB', 'CB', 'LB', 'CMF', 'CMF', 'RWF', 'LWF', 'CF', 'CF'],
    },
    '3-5-2': {
        name: '3-5-2',
        positions: ['GK', 'CB', 'CB', 'CB', 'DMF', 'CMF', 'CMF', 'RWF', 'LWF', 'CF', 'CF'],
    },
};
