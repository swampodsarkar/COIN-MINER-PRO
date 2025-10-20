import React, { useState } from 'react';
import { Player } from '../../types';
import { AXES, Axe } from '../../gameConfig';

interface StoreProps {
    player: Player;
    onBuyAxe: (axe: Axe & { id: string }, cost: number, currency: 'gold' | 'gems') => void;
    onEquipAxe: (axeId: string) => void;
    onBack: () => void;
}

const Store: React.FC<StoreProps> = ({ player, onBuyAxe, onEquipAxe, onBack }) => {
    const [activeTab, setActiveTab] = useState<'normal' | 'rare'>('normal');

    const allAxes = Object.entries(AXES).map(([id, axeData]) => ({ id, ...axeData }));
    const normalAxes = allAxes.filter(axe => axe.type === 'normal');
    const rareAxes = allAxes.filter(axe => axe.type === 'rare');

    const axesToDisplay = activeTab === 'normal' ? normalAxes : rareAxes;

    const AxeCard: React.FC<{ axe: Axe & { id: string } }> = ({ axe }) => {
        const ownsAxe = player.inventory.axes.includes(axe.id);
        const isEquipped = player.equipment.equippedAxe === axe.id;
        const canAfford = axe.currency === 'gold' ? player.gold >= axe.cost : player.gems >= axe.cost;

        const handleBuy = () => {
            if (!ownsAxe && canAfford) {
                onBuyAxe(axe, axe.cost, axe.currency);
            }
        };

        const handleEquip = () => {
            if (ownsAxe && !isEquipped) {
                onEquipAxe(axe.id);
            }
        };

        return (
            <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700 flex flex-col text-center shadow-lg">
                <span className="text-5xl mb-2">{axe.emoji}</span>
                <h4 className="text-yellow-400 text-lg mb-1">{axe.name}</h4>
                <p className="text-gray-300 text-sm mb-3">Power: +{axe.power}</p>
                <div className="flex-grow"></div>
                {ownsAxe ? (
                    <button
                        onClick={handleEquip}
                        disabled={isEquipped}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg border-b-4 border-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-400"
                    >
                        {isEquipped ? 'Equipped' : 'Equip'}
                    </button>
                ) : (
                    <button
                        onClick={handleBuy}
                        disabled={!canAfford}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg border-b-4 border-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-400 flex items-center justify-center"
                    >
                        {axe.currency === 'gold' ? '💰' : '💎'} {axe.cost.toLocaleString()}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-3xl h-full flex flex-col bg-black bg-opacity-60 p-4 rounded-xl border-2 border-yellow-600 relative">
            <button onClick={onBack} className="absolute top-3 left-3 text-2xl bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors transform hover:scale-110 z-10">
                ⬅️
            </button>
            <h3 className="text-center text-2xl text-yellow-300 mb-4">AXE STORE</h3>

            <div className="flex justify-center mb-4 border-b-2 border-gray-700">
                <button onClick={() => setActiveTab('normal')} className={`px-6 py-2 text-lg ${activeTab === 'normal' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>
                    Normal
                </button>
                <button onClick={() => setActiveTab('rare')} className={`px-6 py-2 text-lg ${activeTab === 'rare' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>
                    Rare
                </button>
            </div>

            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {axesToDisplay.map(axe => <AxeCard key={axe.id} axe={axe} />)}
                </div>
            </div>
        </div>
    );
};

export default Store;
