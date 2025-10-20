
import { Player } from './types';

export const ADMIN_EMAILS: string[] = ['admin@click2mine.com', 'maruf@example.com'];

export const TEAM_LOGOS = ['⚽', '🏟️', '🏆', '🏅', '🔥', '⭐', '👑', '🔴', '🔵', '⚪️'];

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

// A default set of standard players for new users
const defaultSquadPlayerIds = [
    'std_gk_1', 'std_cb_1', 'std_cb_2', 'std_lb_1', 'std_rb_1',
    'std_dmf_1', 'std_cmf_1', 'std_amf_1', 'std_lwf_1', 'std_rwf_1', 'std_cf_1'
];

const defaultSubstitutesPlayerIds = [
    'std_gk_2', 'std_cb_3', 'std_cmf_2', 'std_cmf_3', 'std_lwf_2', 'std_rwf_2', 'std_cf_2'
];

export const INITIAL_PLAYER_STATE: Omit<Player, 'uid' | 'username' | 'email'> = {
    gp: 50000,
    coins: 100,
    avatar: '⚽',
    banned: false,
    lastLogin: yesterday.toISOString().split('T')[0],
    division: 'Division 10',
    divisionPoints: 0,
    ownedPlayerIds: [...defaultSquadPlayerIds, ...defaultSubstitutesPlayerIds],
    squad: defaultSquadPlayerIds,
    substitutes: defaultSubstitutesPlayerIds,
    activeFormationId: '4-3-3',
    matchHistory: {},
};
