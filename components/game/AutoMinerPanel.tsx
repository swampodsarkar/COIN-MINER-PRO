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
        <div className="flex-1 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-xl p-2.5 border-2 border-gray-700 shadow-lg flex items-center text-center backdrop-blur-sm transition-all duration-300 hover:border-yellow-600 hover:shadow-yellow-500/10">
            <div className="w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-2xl mr-3 flex-shrink-0">
                🤖
            </div>
            <div className="flex-grow text-left space-y-0">
                <h3 className="font-bold text-yellow-400 text-sm leading-tight">Auto-Miner</h3>
                <p className="text-white text-xs leading-tight">
                    Lv. <span className="font-bold text-base text-yellow-200">{level}</span> | <span className="text-green-400 font-semibold">{goldPerSecond.toFixed(1)} G/s</span>
                </p>
            </div>
            <button
                onClick={onUpgrade}
                disabled={!canAfford}
                className="bg-green-600 hover:bg-green-500 text-white font-bold p-2 rounded-lg border-b-4 border-green-800 shadow-md transition-all active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-700 transform hover:-translate-y-0.5 hover:brightness-110 disabled:transform-none text-xs flex flex-col items-center justify-center h-full ml-2 leading-tight"
            >
                <span>{level > 0 ? 'UP' : 'BUY'}</span>
                <span className="text-xs font-semibold">({Math.ceil(upgradeCost).toLocaleString()}💰)</span>
            </button>
        </div>
    );
};

export default AutoMinerPanel;