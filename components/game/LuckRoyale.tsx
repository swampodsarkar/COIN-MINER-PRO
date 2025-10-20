import React from 'react';
import { Player } from '../../types';
import { LUCK_ROYALE_COST, LUCK_ROYALE_GUARANTEED_SPINS } from '../../gameConfig';
import Modal from '../ui/Modal';
import { Spinner } from '../ui/Spinner';

interface LuckRoyaleProps {
    player: Player;
    onSpin: () => void;
    onBack: () => void;
    spinResult: { message: string } | null;
    clearSpinResult: () => void;
    isSpinning: boolean;
}

const LuckRoyale: React.FC<LuckRoyaleProps> = ({ player, onSpin, onBack, spinResult, clearSpinResult, isSpinning }) => {
    
    const canAfford = player.gold >= LUCK_ROYALE_COST;

    const progressPercentage = ((player.luckRoyaleSpins || 0) / LUCK_ROYALE_GUARANTEED_SPINS) * 100;

    return (
        <div className="w-full max-w-3xl h-full flex flex-col items-center justify-center bg-black bg-opacity-60 p-4 rounded-xl border-2 border-yellow-600 relative">
            <button onClick={onBack} className="absolute top-3 left-3 text-2xl bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors transform hover:scale-110 z-10">
                ⬅️
            </button>

            {spinResult && (
                <Modal title="You Won!" onClose={clearSpinResult}>
                    <div className="text-center p-6">
                        <p className="text-2xl text-yellow-300">{spinResult.message}</p>
                    </div>
                </Modal>
            )}
            
            <h3 className="text-center text-3xl text-yellow-300 mb-4">LUCK ROYALE</h3>
            <p className="text-gray-400 mb-8">Spin for a chance to win a rare axe!</p>

            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                <div className={`absolute inset-0 border-8 border-purple-500 rounded-full ${isSpinning ? 'animate-spin' : ''}`}></div>
                 <div className={`absolute inset-2 border-4 border-yellow-400 rounded-full ${isSpinning ? 'animate-spin' : ''}`} style={{animationDirection: 'reverse'}}></div>
                <button
                    onClick={onSpin}
                    disabled={!canAfford || isSpinning}
                    className="w-48 h-48 bg-gray-800 rounded-full border-4 border-yellow-700 flex flex-col items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform active:scale-95 hover:scale-105"
                >
                    {isSpinning ? (
                        <Spinner />
                    ) : (
                        <>
                            <span className="text-3xl font-bold">SPIN</span>
                            <span className="text-yellow-400 flex items-center">
                                💰 {LUCK_ROYALE_COST}
                            </span>
                        </>
                    )}
                </button>
            </div>
            
            <div className="w-full max-w-md text-center">
                <p className="text-yellow-200 mb-2">Guaranteed Rare Axe Progress</p>
                <div className="w-full bg-gray-700 rounded-full h-4 border-2 border-gray-600">
                    <div 
                        className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <p className="text-sm mt-1">{(player.luckRoyaleSpins || 0)} / {LUCK_ROYALE_GUARANTEED_SPINS} spins</p>
            </div>
             <p className="text-center text-gray-500 mt-auto pt-4 text-sm">Your Gold: {Math.floor(player.gold).toLocaleString()} 💰</p>
        </div>
    );
};

export default LuckRoyale;
