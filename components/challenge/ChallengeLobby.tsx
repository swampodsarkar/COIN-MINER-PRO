import React, { useState } from 'react';
import { Player } from '../../types';

interface ChallengeLobbyProps {
    player: Player;
    onFindMatch: (betAmount: number) => void;
    onShowHistory: () => void;
    onBack: () => void;
}

const PRESET_BETS = [100, 500, 1000, 5000];

const ChallengeLobby: React.FC<ChallengeLobbyProps> = ({ player, onFindMatch, onShowHistory, onBack }) => {
    const [betAmount, setBetAmount] = useState('');
    const [error, setError] = useState('');

    const handleFindMatchClick = () => {
        const amount = parseInt(betAmount, 10);
        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid bet amount.');
            return;
        }
        if (player.gold < amount) {
            setError("You don't have enough gold for this bet.");
            return;
        }
        setError('');
        onFindMatch(amount);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setBetAmount(e.target.value);
    }

    return (
        <div className="w-full max-w-3xl h-full flex flex-col bg-black bg-opacity-60 p-4 sm:p-6 rounded-xl border-2 border-yellow-600 relative">
            <button onClick={onBack} className="absolute top-3 left-3 text-2xl bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors transform hover:scale-110">
                ⬅️
            </button>
            <h3 className="text-center text-xl sm:text-2xl text-yellow-300 mb-4">MINING CHALLENGE</h3>
            <p className="text-center text-gray-300 text-sm sm:text-base mb-6">Bet your gold against another player in a 15-second mining duel. Winner takes all!</p>
            
            <div className="w-full max-w-sm mx-auto">
                <div className="flex items-center bg-gray-900 border-2 border-gray-700 rounded-lg p-2 focus-within:border-yellow-500">
                    <span className="text-2xl mx-2">💰</span>
                    <input 
                        type="number" 
                        value={betAmount}
                        onChange={handleAmountChange}
                        placeholder="Enter your bet"
                        className="w-full bg-transparent text-white text-xl font-bold focus:outline-none"
                    />
                </div>
                {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
                    {PRESET_BETS.map(amount => (
                        <button 
                            key={amount}
                            onClick={() => {
                                setBetAmount(String(amount));
                                setError('');
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-yellow-300 py-2 rounded-lg transform hover:-translate-y-0.5"
                        >
                            {amount.toLocaleString()}
                        </button>
                    ))}
                </div>
                
                 <div className="flex flex-col sm:flex-row gap-2">
                     <button
                        onClick={handleFindMatchClick}
                        disabled={!betAmount || parseInt(betAmount, 10) <= 0 || player.gold < parseInt(betAmount || '0', 10)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg border-b-4 border-yellow-700 shadow-lg transition-transform active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-700 text-lg transform hover:-translate-y-1 hover:brightness-110 disabled:transform-none"
                    >
                        Find Match
                    </button>
                    <button
                        onClick={onShowHistory}
                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg border-b-4 border-blue-700 shadow-lg transition-transform active:scale-95 text-lg transform hover:-translate-y-1 hover:brightness-110"
                    >
                        📜
                    </button>
                </div>
            </div>
            
            <p className="text-center text-gray-500 mt-auto pt-4 text-sm">Your Gold: {Math.floor(player.gold).toLocaleString()} 💰</p>
        </div>
    );
};

export default ChallengeLobby;