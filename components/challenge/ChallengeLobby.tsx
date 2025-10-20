
import React from 'react';
import { Player } from '../../types';
import { RANKS } from '../../gameConfig';

interface ChallengeLobbyProps {
    player: Player;
    onFindMatch: () => void;
    onShowHistory: () => void;
    onBack: () => void;
}

const ChallengeLobby: React.FC<ChallengeLobbyProps> = ({ player, onFindMatch, onShowHistory, onBack }) => {
    
    const rankConfig = RANKS[player.rank];

    return (
        <div className="w-full max-w-3xl h-full flex flex-col bg-black bg-opacity-60 p-4 sm:p-6 rounded-xl border-2 border-yellow-600 relative">
            <button onClick={onBack} className="absolute top-3 left-3 text-2xl bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors transform hover:scale-110">
                ⬅️
            </button>
            <h3 className="text-center text-xl sm:text-2xl text-yellow-300 mb-4">RANK MATCH</h3>
            <p className="text-center text-gray-300 text-sm sm:text-base mb-6">Battle another player in a 15-second mining duel to climb the ranks. Winner takes a gold prize and Rank Points!</p>
            
            <div className="w-full max-w-sm mx-auto flex flex-col items-center">
                 <div className="mb-6 text-center">
                    <p className="text-gray-400">YOUR RANK</p>
                    <p className="text-4xl font-bold" style={{ color: rankConfig.color }}>{player.rank}</p>
                    <p className="text-sm text-gray-200">{player.rankPoints} RP</p>
                </div>
                
                 <div className="w-full flex flex-col sm:flex-row gap-2">
                     <button
                        onClick={onFindMatch}
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
