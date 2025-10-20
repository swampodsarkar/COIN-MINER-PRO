import React from 'react';
// FIX: Changed import for Hero type from gameConfig.ts to types.ts to resolve module scope issue.
import { Player, Hero } from '../../types';
import { HEROES } from '../../gameConfig';

interface HeroStoreProps {
    player: Player;
    onBuyHero: (hero: Hero) => void;
}

const HeroStore: React.FC<HeroStoreProps> = ({ player, onBuyHero }) => {
    const allHeroes = Object.values(HEROES);

    const HeroCard: React.FC<{ hero: Hero }> = ({ hero }) => {
        const ownsHero = player.ownedHeroes.includes(hero.id);
        const canAffordGold = player.gold >= hero.cost.gold;
        const canAffordDiamonds = player.diamonds >= hero.cost.diamonds;
        const purchaseWithGold = hero.cost.gold > 0;

        const handleBuy = () => {
            if (!ownsHero && (purchaseWithGold ? canAffordGold : canAffordDiamonds)) {
                onBuyHero(hero);
            }
        };

        const rarityStyles = {
            Fighter: 'border-red-500',
            Mage: 'border-blue-500',
            Marksman: 'border-yellow-500',
            Tank: 'border-green-500',
        };

        return (
            <div className={`bg-gray-800 rounded-lg border-2 flex flex-col text-center transition-transform hover:scale-105 shadow-lg ${rarityStyles[hero.role]}`}>
                <img src={hero.skins[0].fullUrl} alt={hero.name} className="rounded-t-md object-cover h-40" />
                <div className="p-3 flex flex-col flex-grow">
                    <h4 className={`text-lg mb-1 font-bold text-white`}>{hero.name}</h4>
                    <p className={`text-xs font-bold mb-2 text-gray-400`}>{hero.role}</p>
                    <div className="flex-grow"></div>
                    {ownsHero ? (
                        <button
                            disabled={true}
                            className="w-full mt-2 bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded-lg cursor-not-allowed"
                        >
                            Owned
                        </button>
                    ) : (
                        <button
                            onClick={handleBuy}
                            disabled={!(purchaseWithGold ? canAffordGold : canAffordDiamonds)}
                            className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg border-b-4 border-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-400 flex items-center justify-center"
                        >
                            {purchaseWithGold ? `💰 ${hero.cost.gold.toLocaleString()}` : `💎 ${hero.cost.diamonds.toLocaleString()}`}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-xl border-2 border-purple-600">
            <h3 className="text-center text-3xl font-bold text-yellow-300 mb-6">HEROES</h3>
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allHeroes.map(hero => <HeroCard key={hero.id} hero={hero} />)}
                </div>
            </div>
        </div>
    );
};

export default HeroStore;