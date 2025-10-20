
import React from 'react';
import { Player, Character } from '../../types';
import { CHARACTERS } from '../../gameConfig';

interface CharacterStoreProps {
    player: Player;
    onBuyHero: (character: Character) => void;
}

const CharacterStore: React.FC<CharacterStoreProps> = ({ player, onBuyHero }) => {
    const allCharacters = Object.values(CHARACTERS);

    const HeroCard: React.FC<{ character: Character }> = ({ character }) => {
        const ownsCharacter = player.ownedCharacters.includes(character.id);
        const canAffordGold = player.gold >= character.cost.gold;
        const canAffordDiamonds = player.diamonds >= character.cost.diamonds;
        const purchaseWithGold = character.cost.gold > 0;

        const handleBuy = () => {
            if (!ownsCharacter && (purchaseWithGold ? canAffordGold : canAffordDiamonds)) {
                onBuyHero(character);
            }
        };

        const rarityStyles = {
            Rusher: 'border-red-500',
            Support: 'border-green-500',
            Sniper: 'border-blue-500',
            Scout: 'border-yellow-500',
        };

        return (
            <div className={`bg-gray-800 rounded-lg border-2 flex flex-col text-center transition-transform hover:scale-105 shadow-lg ${rarityStyles[character.role]}`}>
                <div className="rounded-t-md h-40 bg-gray-900 flex items-center justify-center">
                    <span className="text-7xl">{character.emoji}</span>
                </div>
                <div className="p-3 flex flex-col flex-grow">
                    <h4 className={`text-lg mb-1 font-bold text-white`}>{character.name}</h4>
                    <p className={`text-xs font-bold mb-2 text-gray-400`}>{character.role}</p>
                     <p className={`text-xs text-gray-300 mb-2 h-10`}>"{character.abilityDescription}"</p>
                    <div className="flex-grow"></div>
                    {ownsCharacter ? (
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
                            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-lg border-b-4 border-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-400 flex items-center justify-center"
                        >
                            {purchaseWithGold ? `💰 ${character.cost.gold.toLocaleString()}` : `💎 ${character.cost.diamonds.toLocaleString()}`}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-xl border-2 border-purple-600">
            <h3 className="text-center text-3xl font-bold text-orange-300 mb-6">CHARACTERS</h3>
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allCharacters.map(char => <HeroCard key={char.id} character={char} />)}
                </div>
            </div>
        </div>
    );
};

export default CharacterStore;
