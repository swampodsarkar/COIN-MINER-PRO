import React, { useState } from 'react';
import { Player } from '../../types';
import Modal from '../ui/Modal';

interface TopUpModalProps {
    player: Player;
    onClose: () => void;
    onBuyGems: (amount: number) => void;
    onBuyMembership: (type: 'weekly' | 'monthly', days: number) => void;
}

const gemPacks = [
    { gems: 100, price: 75, popular: false },
    { gems: 300, price: 160, popular: true },
    { gems: 500, price: 380, popular: false },
    { gems: 1000, price: 850, popular: false },
    { gems: 2000, price: 1850, popular: false },
    { gems: 3000, price: 2850, popular: false },
];

const membershipsData = [
    { type: 'weekly' as const, name: 'Weekly Pass', days: 7, dailyGems: 50, price: 150, popular: true },
    { type: 'monthly' as const, name: 'Monthly Pass', days: 30, dailyGems: 80, price: 800, popular: false },
];

const TopUpModal: React.FC<TopUpModalProps> = ({ player, onClose, onBuyGems, onBuyMembership }) => {
    const [activeTab, setActiveTab] = useState<'gems' | 'membership'>('gems');

    const TabButton: React.FC<{ tab: 'gems' | 'membership', label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-lg font-bold transition-colors ${activeTab === tab ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}
        >
            {label}
        </button>
    );

    return (
        <Modal title="Shop" onClose={onClose}>
            <div className="w-full">
                <div className="flex border-b border-gray-700 mb-4">
                    <TabButton tab="gems" label="Diamonds" />
                    <TabButton tab="membership" label="Passes" />
                </div>
                {activeTab === 'gems' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-1">
                        {gemPacks.map(pack => (
                            <div key={pack.gems} className={`relative bg-gray-900 border-2 rounded-lg p-3 text-center transition-transform hover:scale-105 ${pack.popular ? 'border-yellow-500' : 'border-gray-700'}`}>
                                {pack.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">POPULAR</div>}
                                <p className="text-4xl">💎</p>
                                <p className="text-xl font-bold text-blue-300 my-1">{pack.gems.toLocaleString()}</p>
                                <button
                                    onClick={() => onBuyGems(pack.gems)}
                                    className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-3 rounded-lg border-b-2 border-green-800 shadow-sm transition-all active:scale-95"
                                >
                                    {pack.price.toLocaleString()} TK
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'membership' && (
                    <div className="space-y-4 p-1">
                         {membershipsData.map(sub => (
                             <div key={sub.type} className={`relative bg-gray-900 border-2 rounded-lg p-4 transition-transform hover:scale-105 ${sub.popular ? 'border-yellow-500' : 'border-gray-700'}`}>
                                {sub.popular && <div className="absolute -top-3 left-4 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">BEST VALUE</div>}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-bold text-yellow-300">{sub.name}</h4>
                                        <p className="text-sm text-gray-300">Get {sub.dailyGems}💎 daily for {sub.days} days.</p>
                                        <p className="text-xs text-green-400">Total: {(sub.dailyGems * sub.days).toLocaleString()} 💎</p>
                                    </div>
                                    <button
                                        onClick={() => onBuyMembership(sub.type, sub.days)}
                                        disabled={!!player.activeMembership}
                                        className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-5 rounded-lg border-b-2 border-green-800 shadow-sm transition-all active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-400"
                                    >
                                        {player.activeMembership ? 'Active' : `${sub.price} TK`}
                                    </button>
                                </div>
                            </div>
                         ))}
                         {player.activeMembership && (
                            <div className="text-center text-yellow-400 p-2 bg-yellow-500/10 rounded-lg mt-4">
                                <p>You have an active {player.activeMembership.type} pass.</p>
                                <p className="text-sm">Expires: {new Date(player.activeMembership.expiresAt).toLocaleDateString()}</p>
                            </div>
                         )}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default TopUpModal;