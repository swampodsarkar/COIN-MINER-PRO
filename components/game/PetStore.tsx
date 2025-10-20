import React from 'react';
import { Player, Pet } from '../../types';
import { PETS } from '../../gameConfig';

interface PetStoreProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const PetStore: React.FC<PetStoreProps> = ({ player, setPlayer }) => {
    const allPets = Object.values(PETS);

    const handleBuyPet = (pet: Pet) => {
        setPlayer(p => {
            if (!p) return null;
            const canAffordGold = p.gold >= pet.cost.gold;
            const canAffordDiamonds = p.diamonds >= pet.cost.diamonds;
            const purchaseWithGold = pet.cost.gold > 0;

            if (purchaseWithGold && canAffordGold) {
                return { ...p, gold: p.gold - pet.cost.gold, ownedPets: [...p.ownedPets, pet.id] };
            }
            if (!purchaseWithGold && canAffordDiamonds) {
                return { ...p, diamonds: p.diamonds - pet.cost.diamonds, ownedPets: [...p.ownedPets, pet.id] };
            }
            return p;
        });
    };

    const handleEquipPet = (petId: string) => {
        setPlayer(p => p ? { ...p, equippedPet: p.equippedPet === petId ? null : petId } : null);
    };

    const PetCard: React.FC<{ pet: Pet }> = ({ pet }) => {
        const ownsPet = player.ownedPets.includes(pet.id);
        const isEquipped = player.equippedPet === pet.id;
        const canAffordGold = player.gold >= pet.cost.gold;
        const canAffordDiamonds = player.diamonds >= pet.cost.diamonds;
        const purchaseWithGold = pet.cost.gold > 0;

        return (
            <div className={`bg-gray-800 rounded-lg border-2 flex flex-col text-center transition-transform hover:scale-105 shadow-lg ${isEquipped ? 'border-green-400' : 'border-purple-500'}`}>
                <div className="rounded-t-md h-40 bg-gray-900 flex items-center justify-center">
                    <span className="text-7xl">{pet.emoji}</span>
                </div>
                <div className="p-3 flex flex-col flex-grow">
                    <h4 className="text-lg mb-1 font-bold text-white">{pet.name}</h4>
                    <p className="text-xs font-bold mb-2 text-green-400">{pet.abilityName}</p>
                    <p className="text-xs text-gray-300 mb-2 h-10">"{pet.abilityDescription}"</p>
                    <div className="flex-grow"></div>
                    {ownsPet ? (
                        <button
                            onClick={() => handleEquipPet(pet.id)}
                            className={`w-full mt-2 font-bold py-2 px-4 rounded-lg border-b-4 transition-colors ${isEquipped ? 'bg-green-500 border-green-700 text-white' : 'bg-gray-600 border-gray-700 text-white hover:bg-gray-500'}`}
                        >
                            {isEquipped ? 'Equipped' : 'Equip'}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleBuyPet(pet)}
                            disabled={!(purchaseWithGold ? canAffordGold : canAffordDiamonds)}
                            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-lg border-b-4 border-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-400 flex items-center justify-center"
                        >
                            {purchaseWithGold ? `💰 ${pet.cost.gold.toLocaleString()}` : `💎 ${pet.cost.diamonds.toLocaleString()}`}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-xl border-2 border-green-500">
            <h3 className="text-center text-3xl font-bold text-orange-300 mb-6">PETS</h3>
            <div className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {allPets.map(p => <PetCard key={p.id} pet={p} />)}
                </div>
            </div>
        </div>
    );
};

export default PetStore;
