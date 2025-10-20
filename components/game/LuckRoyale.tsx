
import React, { useState } from 'react';
import { Player } from '../../types';

interface LuckRoyaleProps {
    player: Player;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const prizes = [
    { type: 'gold', value: 100, label: '100 Gold', color: 'bg-yellow-600' },
    { type: 'gold', value: 500, label: '500 Gold', color: 'bg-yellow-500' },
    { type: 'diamonds', value: 10, label: '10 Diamonds', color: 'bg-blue-600' },
    { type: 'item', value: 'Rare Skin', label: 'Rare Skin', color: 'bg-purple-600' },
    { type: 'gold', value: 1000, label: '1K Gold', color: 'bg-yellow-400' },
    { type: 'diamonds', value: 50, label: '50 Diamonds', color: 'bg-blue-500' },
    { type: 'gold', value: 200, label: '200 Gold', color: 'bg-yellow-600' },
    { type: 'item', value: 'Legendary Skin', label: 'Legendary Skin', color: 'bg-red-600' },
];

const SPIN_COST_GOLD = 500;
const SPIN_COST_DIAMONDS = 50;

const LuckRoyale: React.FC<LuckRoyaleProps> = ({ player, setPlayer }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [resultIndex, setResultIndex] = useState<number | null>(null);
    const [rotation, setRotation] = useState(0);

    const handleSpin = (currency: 'gold' | 'diamonds') => {
        const cost = currency === 'gold' ? SPIN_COST_GOLD : SPIN_COST_DIAMONDS;
        if (player[currency] < cost || isSpinning) return;

        setPlayer(p => p ? { ...p, [currency]: p[currency] - cost } : null);
        setIsSpinning(true);
        setResultIndex(null);

        const randomIndex = Math.floor(Math.random() * prizes.length);
        const prize = prizes[randomIndex];
        
        const fullSpins = 5;
        const prizeAngle = (360 / prizes.length) * randomIndex;
        const newRotation = rotation + (360 * fullSpins) - prizeAngle + (360 / prizes.length / 2);

        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setResultIndex(randomIndex);
            
            // Grant prize
            setPlayer(p => {
                if (!p) return null;
                if (prize.type === 'gold') return { ...p, gold: p.gold + (prize.value as number) };
                if (prize.type === 'diamonds') return { ...p, diamonds: p.diamonds + (prize.value as number) };
                // item logic would go here
                return p;
            });
            alert(`You won: ${prize.label}!`);
        }, 4000); // Corresponds to animation duration
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70 p-4 rounded-xl border-2 border-purple-600">
            <h3 className="text-center text-3xl font-bold text-orange-300 mb-6">LUCK ROYALE</h3>
            
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-yellow-400 overflow-hidden mb-8">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full z-20 border-2 border-black"></div>
                <div 
                    className="w-full h-full transition-transform duration-[4000ms] ease-out"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {prizes.map((prize, i) => (
                        <div 
                            key={i} 
                            className={`absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center ${prize.color}`}
                            style={{ transform: `rotate(${i * (360 / prizes.length)}deg)`}}
                        >
                            <span className="text-white font-bold text-xs sm:text-sm -rotate-45 transform -translate-x-4 -translate-y-2">{prize.label}</span>
                        </div>
                    ))}
                </div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-[16px] border-t-yellow-300 z-10"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={() => handleSpin('gold')}
                    disabled={isSpinning || player.gold < SPIN_COST_GOLD}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg border-b-4 border-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    Spin (💰 {SPIN_COST_GOLD})
                </button>
                 <button 
                    onClick={() => handleSpin('diamonds')}
                    disabled={isSpinning || player.diamonds < SPIN_COST_DIAMONDS}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg border-b-4 border-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    Spin (💎 {SPIN_COST_DIAMONDS})
                </button>
            </div>
        </div>
    );
};

export default LuckRoyale;
