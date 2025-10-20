import React from 'react';
import { Player } from '../../types';
import { HEROES, Hero } from '../../gameConfig';

interface HeroStoreProps {
    player: Player;
    onBuyHero: (hero: Hero & { id: string }) => void;
    onEquipHero: (heroId: string) => void;
    onBack: () => void;
}

const HeroStore: React.FC<HeroStoreProps> = ({ player, onBuyHero, onEquipHero, onBack }) => {

    const allHeroes = Object.entries(HEROES).map(([id, heroData]) => ({ id, ...heroData }));

    const HeroCard: React.FC<{ hero: Hero & { id: string } }> = ({ hero }) => {
        const ownsHero = player.inventory.heroes.includes(hero.id);
        const isEquipped = player.equipment.equippedHero === hero.id;
        const canAfford = player.gems >= hero.cost;

        const handleBuy = () => {
            if (!ownsHero && canAfford) {
                onBuyHero(hero);
            }
        };

        const handleEquip = () => {
            if (ownsHero && !isEquipped) {
                onEquipHero(hero.id);
            }
        };

        return (
            <div className="bg-gray-800 p-4 rounded-lg border-2 border-gray-700 flex flex-col text-center shadow-lg">
                <span className="text-5xl mb-2">{hero.emoji}</span>
                <h4 className="text-yellow-400 text-lg mb-1">{hero.name}</h4>
                <p className="text-gray-300 text-sm mb-3">Power: +{((hero.powerMultiplier - 1) * 100).toFixed(0)}%</p>
                <div className="flex-grow"></div>
                {ownsHero ? (
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
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-lg border-b-4 border-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-400 flex items-center justify-center"
                    >
                        💎 {hero.cost.toLocaleString()}
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
            <h3 className="text-center text-2xl text-yellow-300 mb-4">HERO SHRINE</h3>

            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allHeroes.map(hero => <HeroCard key={hero.id} hero={hero} />)}
                </div>
            </div>
        </div>
    );
};

export default HeroStore;