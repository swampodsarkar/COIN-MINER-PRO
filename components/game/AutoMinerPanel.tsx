import React from 'react';

interface AutoMinerPanelProps {
    level: number;
    goldPerSecond: number;
    upgradeCost: number;
    playerGold: number;
    onUpgrade: () => void;
}

const AutoMinerPanel: React.FC<AutoMinerPanelProps> = ({
    level,
    goldPerSecond,
    upgradeCost,
    playerGold,
    onUpgrade
}) => {
    const canAfford = playerGold >= upgradeCost;

    return (
        <div className="w-full max-w-md bg-gray-800 bg-opacity-80 rounded-lg p-4 border-2 border-yellow-700 shadow-xl mt-4">
            <h3 className="text-center text-yellow-300 text-xl mb-3">Auto Miner 🤖</h3>
            <div className="flex justify-between items-center text-lg mb-4">
                <div className="text-center">
                    <p className="text-gray-400 text-sm">Level</p>
                    <p className="text-white font-bold">{level}</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-400 text-sm">Income</p>
                    <p className="text-green-400 font-bold">{goldPerSecond.toFixed(1)} G/sec</p>
                </div>
            </div>
            <button
                onClick={onUpgrade}
                disabled={!canAfford}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg border-b-4 border-yellow-700 shadow-lg transition-transform active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-700 transform hover:-translate-y-1 hover:brightness-110 disabled:transform-none"
            >
                {level > 0 ? `Upgrade (${Math.ceil(upgradeCost).toLocaleString()} 💰)` : `Purchase (${Math.ceil(upgradeCost).toLocaleString()} 💰)`}
            </button>
        </div>
    );
};

export default AutoMinerPanel;
