import React, { useState } from 'react';
import { Player } from '../../types';
import { EMBLEM_CONFIG } from '../../gameConfig';

interface PrepScreenProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

type EmblemType = 'physical' | 'magical' | 'tank';

const PrepScreen: React.FC<PrepScreenProps> = ({ player, setPlayer }) => {
    
    const [lastUpdate, setLastUpdate] = useState({ id: '', time: 0 });

    const handleUpgrade = (type: EmblemType) => {
        const emblem = player.emblems[type];
        if (emblem.level >= EMBLEM_CONFIG.maxLevel) return;

        const cost = EMBLEM_CONFIG.upgradeCost(emblem.level);
        if (player.gold < cost) {
            alert("Not enough gold!");
            return;
        }

        setPlayer(p => {
            if (!p) return null;
            const updatedEmblems = { ...p.emblems };
            const currentEmblem = updatedEmblems[type];
            let newXp = currentEmblem.xp + EMBLEM_CONFIG.xpPerUpgrade;
            let newLevel = currentEmblem.level;

            const xpNeeded = EMBLEM_CONFIG.xpForNextLevel(newLevel);
            if (newXp >= xpNeeded) {
                newLevel += 1;
                newXp -= xpNeeded;
                 setLastUpdate({ id: type, time: Date.now() });
            }
            
            updatedEmblems[type] = { level: newLevel, xp: newXp };
            
            return {
                ...p,
                gold: p.gold - cost,
                emblems: updatedEmblems
            };
        });
    };

    const handleEquip = (type: EmblemType) => {
        setPlayer(p => p ? { ...p, equippedEmblem: type } : null);
    }

    const EmblemCard: React.FC<{ type: EmblemType, title: string, icon: string, color: string }> = ({ type, title, icon, color }) => {
        const emblem = player.emblems[type];
        const xpNeeded = EMBLEM_CONFIG.xpForNextLevel(emblem.level);
        const progress = (emblem.xp / xpNeeded) * 100;
        const isEquipped = player.equippedEmblem === type;
        const isMaxLevel = emblem.level >= EMBLEM_CONFIG.maxLevel;
        const cost = EMBLEM_CONFIG.upgradeCost(emblem.level);
        const justLeveledUp = lastUpdate.id === type && Date.now() - lastUpdate.time < 1500;

        return (
            <div className={`bg-gray-800 p-4 rounded-lg border-2 ${isEquipped ? color : 'border-gray-700'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <span className="text-4xl mr-3">{icon}</span>
                        <div>
                            <h4 className="text-xl font-bold text-white">{title}</h4>
                            <p className={`text-sm font-semibold ${justLeveledUp ? 'animate-level-up text-yellow-300' : 'text-gray-300'}`}>
                                Level {emblem.level}
                            </p>
                        </div>
                    </div>
                    {isEquipped ? (
                        <span className="text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded-full text-sm">Equipped</span>
                    ) : (
                        <button onClick={() => handleEquip(type)} className="text-yellow-400 hover:text-yellow-300 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-sm transition-colors">
                            Equip
                        </button>
                    )}
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>XP Progress</span>
                        <span>{emblem.xp} / {xpNeeded}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <button
                    onClick={() => handleUpgrade(type)}
                    disabled={isMaxLevel || player.gold < cost}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg border-b-4 border-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-400 transform active:scale-95 transition-all"
                >
                    {isMaxLevel ? 'Max Level' : `Upgrade (💰 ${cost})`}
                </button>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-xl border-2 border-purple-600">
            <h3 className="text-center text-3xl font-bold text-yellow-300 mb-6">PREPARATION</h3>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                <EmblemCard type="physical" title="Physical Emblem" icon="⚔️" color="border-red-500" />
                <EmblemCard type="magical" title="Magical Emblem" icon="🔮" color="border-blue-500" />
                <EmblemCard type="tank" title="Tank Emblem" icon="🛡️" color="border-green-500" />
            </div>
        </div>
    );
};

export default PrepScreen;