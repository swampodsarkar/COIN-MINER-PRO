
import React from 'react';
import { Player } from '../../types';

interface UpgradePanelProps {
    player: Player;
    onUpgrade: (type: 'miningPower' | 'miningSpeed' | 'autoMinerLevel', cost: number) => void;
    onBack: () => void;
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({ player, onUpgrade, onBack }) => {
    const powerCost = 10 * Math.pow(1.5, player.miningPower - 1);
    const speedCost = 15 * Math.pow(1.6, player.miningSpeed - 1);
    const autoMinerCost = 50 * Math.pow(2, player.autoMinerLevel);

    const upgrades = [
        {
            name: 'Mining Power',
            level: player.miningPower,
            description: `Increases gold per click. Current: ${player.miningPower} gold/click.`,
            cost: Math.floor(powerCost),
            type: 'miningPower' as const,
        },
        {
            name: 'Mining Speed',
            level: player.miningSpeed,
            description: `Boosts auto-miner frequency. Current Lv: ${player.miningSpeed}`,
            cost: Math.floor(speedCost),
            type: 'miningSpeed' as const,
        },
        {
            name: 'Auto Miner',
            level: player.autoMinerLevel,
            description: `Mines gold automatically for you. Current Lv: ${player.autoMinerLevel}`,
            cost: Math.floor(autoMinerCost),
            type: 'autoMinerLevel' as const,
        }
    ];

    return (
        <div className="w-full max-w-3xl h-full flex flex-col bg-black bg-opacity-60 p-4 rounded-xl border-2 border-yellow-600 relative">
            <button onClick={onBack} className="absolute top-3 left-3 text-2xl bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                ⬅️
            </button>
            <h3 className="text-center text-2xl text-yellow-300 mb-6">UPGRADES</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upgrades.map((upgrade) => (
                    <div key={upgrade.name} className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700 flex flex-col text-center shadow-lg">
                        <h4 className="text-yellow-400 text-xl mb-2">{upgrade.name}</h4>
                        <p className="text-gray-300 text-sm flex-grow mb-4">{upgrade.description}</p>
                        <button
                            onClick={() => onUpgrade(upgrade.type, upgrade.cost)}
                            disabled={player.gems < upgrade.cost}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg border-b-4 border-yellow-700 shadow-lg transition-transform active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-700 flex items-center justify-center"
                        >
                            💎 {upgrade.cost.toLocaleString()}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpgradePanel;
