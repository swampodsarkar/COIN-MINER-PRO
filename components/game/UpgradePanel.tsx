import React from 'react';

interface UpgradePanelProps {
    level: number;
    currentPower: number;
    upgradeCost: number;
    playerGold: number;
    onUpgrade: () => void;
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({
    level,
    currentPower,
    upgradeCost,
    playerGold,
    onUpgrade
}) => {
    const canAfford = playerGold >= upgradeCost;

    return (
        <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-3 border-2 border-yellow-900/70 shadow-lg flex flex-col text-center backdrop-blur-sm transition-all duration-300 hover:border-yellow-500 hover:shadow-yellow-500/20 hover:-translate-y-1">
            <div className="flex items-center justify-center mb-2">
                <span className="text-3xl mr-2">⛏️</span>
                <h3 className="font-bold text-yellow-400 text-base">Pickaxe</h3>
            </div>
            
            <div className="text-white text-sm mb-3">
                <span>Lv. <span className="font-bold text-lg text-yellow-200">{level}</span></span>
                <span className="mx-2 text-gray-600">|</span>
                <span className="text-green-400 font-semibold">Pwr: {currentPower.toFixed(1)}</span>
            </div>

            <button
                onClick={onUpgrade}
                disabled={!canAfford}
                className="w-full mt-auto bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-3 rounded-lg border-b-4 border-green-800 shadow-md transition-all active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-700 transform hover:brightness-110 text-sm"
            >
                Upgrade (💰{Math.ceil(upgradeCost).toLocaleString()})
            </button>
        </div>
    );
};

export default UpgradePanel;