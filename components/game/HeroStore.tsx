import React from 'react';
import { Player } from '../../types';
import { PLAYERS } from '../../gameConfig';

interface ShopScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const AGENTS = [
    {
        name: 'Standard Agent',
        cost: 25000,
        currency: 'gp',
        description: 'Sign a random Standard player.',
        emoji: '👤',
        pool: Object.values(PLAYERS).filter(p => p.rarity === 'Standard'),
    },
    {
        name: 'Featured Agent',
        cost: 100,
        currency: 'coins',
        description: 'Chance to sign a high-rated Featured player!',
        emoji: '⭐',
        pool: Object.values(PLAYERS).filter(p => p.rarity === 'Featured' || p.overall > 82),
    },
    {
        name: 'Legendary Agent',
        cost: 500,
        currency: 'coins',
        description: 'Guaranteed Legendary player! A true icon of the sport.',
        emoji: '👑',
        pool: Object.values(PLAYERS).filter(p => p.rarity === 'Legendary'),
    }
];

const ShopScreen: React.FC<ShopScreenProps> = ({ player, setPlayer }) => {

    const handleBuyAgent = (agent: typeof AGENTS[0]) => {
        if (agent.currency === 'gp' && player.gp < agent.cost) {
            alert("Not enough GP!");
            return;
        }
        if (agent.currency === 'coins' && player.coins < agent.cost) {
            alert("Not enough Coins!");
            return;
        }

        const newPlayer = agent.pool[Math.floor(Math.random() * agent.pool.length)];

        if (player.ownedPlayerIds.includes(newPlayer.id)) {
            const duplicateGP = 5000;
            alert(`You already own ${newPlayer.name}! You received ${duplicateGP} GP as compensation.`);
            setPlayer(p => p ? { ...p, gp: p.gp + duplicateGP - (agent.currency === 'gp' ? agent.cost : 0), coins: p.coins - (agent.currency === 'coins' ? agent.cost : 0) } : null);
        } else {
            alert(`Congratulations! You signed ${newPlayer.name} (${newPlayer.overall})!`);
            setPlayer(p => p ? {
                ...p,
                gp: p.gp - (agent.currency === 'gp' ? agent.cost : 0),
                coins: p.coins - (agent.currency === 'coins' ? agent.cost : 0),
                ownedPlayerIds: [...p.ownedPlayerIds, newPlayer.id],
            } : null);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-xl border-2 border-purple-500">
            <h3 className="text-center text-3xl font-bold text-purple-300 mb-6">AGENT SCOUTS</h3>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {AGENTS.map(agent => (
                    <div key={agent.name} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-5xl mr-4">{agent.emoji}</span>
                            <div>
                                <h4 className="text-lg font-bold text-white">{agent.name}</h4>
                                <p className="text-sm text-gray-400">{agent.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleBuyAgent(agent)}
                            className={`px-4 py-2 rounded-lg font-bold border-b-4 transition-transform active:scale-95 ${agent.currency === 'gp' ? 'bg-yellow-500 border-yellow-700 text-black' : 'bg-purple-500 border-purple-700 text-white'}`}
                        >
                            {agent.cost.toLocaleString()} {agent.currency.toUpperCase()}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopScreen;
