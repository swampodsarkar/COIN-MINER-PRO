
import React, { useState } from 'react';
import { Player } from '../../types';
import { PLAYERS, FORMATIONS, DIVISIONS } from '../../gameConfig';

interface MatchSelectionScreenProps {
    player: Player;
    onPlay: (mode: 'division' | 'ai') => void;
}

const MatchSelectionScreen: React.FC<MatchSelectionScreenProps> = ({ player, onPlay }) => {
    const [selectedMode, setSelectedMode] = useState<'division' | 'ai'>('division');

    const captain = PLAYERS[player.squad[10]] || PLAYERS['std_cf_1']; // Default to CF
    const division = DIVISIONS[player.division];

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
             {/* Background Character */}
             <div className="absolute -right-20 -bottom-20 flex items-center justify-center opacity-30 pointer-events-none">
                 <div className="text-[28rem] drop-shadow-2xl select-none transform scale-x-[-1]">
                    ⚽
                </div>
            </div>
            
            <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 text-white">
                {/* Top section for team info */}
                <div className="bg-black/50 p-4 rounded-xl backdrop-blur-sm border border-gray-700 w-full max-w-sm">
                    <h2 className="text-2xl font-bold">{player.username}'s Team</h2>
                    <p className="font-semibold" style={{ color: division.color }}>{division.name}</p>
                    <p className="text-sm text-gray-300">Captain: {captain.name}</p>
                </div>

                {/* Bottom section for mode selection and play button */}
                <div className="flex flex-col items-center">
                    <div className="flex bg-black/60 p-1.5 rounded-full border border-gray-700 mb-6">
                        <button 
                            onClick={() => setSelectedMode('division')} 
                            className={`px-6 py-2 rounded-full font-bold transition-colors w-40 ${selectedMode === 'division' ? 'bg-cyan-500 text-black' : 'text-white'}`}
                        >
                            Division Match
                        </button>
                        <button 
                            onClick={() => setSelectedMode('ai')}
                            className={`px-6 py-2 rounded-full font-bold transition-colors w-40 ${selectedMode === 'ai' ? 'bg-cyan-500 text-black' : 'text-white'}`}
                        >
                            Tour Event
                        </button>
                    </div>

                    <button
                        onClick={() => onPlay(selectedMode)}
                        className="bg-green-500 text-gray-900 font-black text-3xl py-4 px-24 rounded-lg border-b-8 border-green-700 shadow-2xl shadow-green-500/30 transform transition-transform hover:scale-105 active:scale-100 active:border-b-4"
                    >
                        PLAY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchSelectionScreen;
