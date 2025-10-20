
import React from 'react';
import { Player } from '../../types';
import { PLAYERS } from '../../gameConfig';

interface MyTeamScreenProps {
    player: Player;
}

const PlayerCard: React.FC<{ playerId: string }> = ({ playerId }) => {
    const p = PLAYERS[playerId];
    if (!p) return null;

    const rarityColor = {
        Standard: 'from-gray-600 to-gray-800',
        Featured: 'from-purple-600 to-purple-900',
        Legendary: 'from-yellow-500 to-yellow-800',
    };
    const rarityBorder = {
        Standard: 'border-gray-500',
        Featured: 'border-purple-400',
        Legendary: 'border-yellow-300',
    };

    return (
        <div className={`bg-gradient-to-br ${rarityColor[p.rarity]} text-white rounded-lg p-3 flex flex-col justify-between border-2 ${rarityBorder[p.rarity]}`}>
            <div>
                <p className="text-lg font-bold">{p.name}</p>
                <p className="text-sm text-gray-300">{p.position}</p>
            </div>
            <p className="text-3xl font-black text-right">{p.overall}</p>
        </div>
    );
};

const MyTeamScreen: React.FC<MyTeamScreenProps> = ({ player }) => {
    return (
        <div className="w-full h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-xl border-2 border-blue-500">
            <h3 className="text-center text-3xl font-bold text-cyan-300 mb-6">MY TEAM</h3>
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {player.ownedPlayerIds
                        .map(id => PLAYERS[id])
                        .sort((a,b) => b.overall - a.overall)
                        .map(p => <PlayerCard key={p.id} playerId={p.id} />)
                    }
                </div>
            </div>
        </div>
    );
};

export default MyTeamScreen;
