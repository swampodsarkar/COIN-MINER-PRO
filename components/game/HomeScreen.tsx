import React, { useState } from 'react';
import { Player } from '../../types';
import { CHARACTERS } from '../../gameConfig';
import FriendsPanel from './FriendsPanel';
import { UserGroupIcon } from '../ui/icons';

interface HomeScreenProps {
    player: Player;
    onPlay: (mode: 'br' | 'cs') => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ player, onPlay }) => {
    const [gameMode, setGameMode] = useState<'br' | 'cs'>('br');
    const [showFriends, setShowFriends] = useState(false);
    
    const displayCharacterId = player.ownedCharacters[0] || 'alok';
    const displayCharacter = CHARACTERS[displayCharacterId];

    const SquadMemberCard: React.FC<{ member?: { name: string, emoji: string } }> = ({ member }) => {
        if (!member) {
            return (
                <button onClick={() => setShowFriends(true)} className="h-20 w-full bg-black/40 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-400 hover:bg-black/60 hover:border-orange-500 transition-colors">
                    <span className="text-3xl">+ INVITE</span>
                </button>
            )
        }
        return (
             <div className="h-20 w-full bg-gray-800/80 rounded-lg border-2 border-gray-600 flex items-center p-2">
                <span className="text-5xl mr-2">{member.emoji}</span>
                <div>
                    <p className="font-bold text-white">{member.name}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
            {/* Background Character */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                 <div className="text-[20rem] sm:text-[26rem] md:text-[32rem] -mb-20 drop-shadow-2xl select-none">
                    {displayCharacter.emoji}
                </div>
            </div>

            {/* Main content */}
            <div className="relative w-full h-full flex justify-between items-end p-4 sm:p-6">
                {/* Left Side: Character/Mode select */}
                <div className="flex flex-col justify-end h-full">
                     <div className="bg-black/60 p-4 rounded-xl backdrop-blur-sm border border-gray-700 mb-4">
                        <h2 className="text-3xl font-bold text-white">{displayCharacter.name}</h2>
                        <p className="text-orange-400 font-semibold">{displayCharacter.role}</p>
                    </div>
                    <div className="flex bg-black/60 p-1.5 rounded-full border border-gray-700">
                        <button 
                            onClick={() => setGameMode('br')} 
                            className={`px-6 py-2 rounded-full font-bold transition-colors ${gameMode === 'br' ? 'bg-orange-500 text-black' : 'text-white'}`}
                        >
                            Battle Royale
                        </button>
                        <button 
                            onClick={() => setGameMode('cs')}
                            className={`px-6 py-2 rounded-full font-bold transition-colors ${gameMode === 'cs' ? 'bg-orange-500 text-black' : 'text-white'}`}
                        >
                            Clash Squad
                        </button>
                    </div>
                </div>

                {/* Right Side: Squad */}
                <div className="w-1/3 max-w-xs flex flex-col space-y-2">
                    <SquadMemberCard member={{ name: player.username, emoji: player.avatar }} />
                    <SquadMemberCard />
                    <SquadMemberCard />
                    <SquadMemberCard />
                </div>
            </div>

            {/* Bottom Start Button */}
            <div className="absolute bottom-6 right-1/2 translate-x-1/2">
                 <button
                    onClick={() => onPlay(gameMode)}
                    className="bg-yellow-400 text-gray-900 font-black text-3xl py-4 px-24 rounded-lg border-b-8 border-yellow-600 shadow-2xl shadow-yellow-500/30 transform transition-transform hover:scale-105 active:scale-100 active:border-b-4"
                >
                    START
                </button>
            </div>
            
            {/* Friends Panel Toggle */}
            <button 
                onClick={() => setShowFriends(true)} 
                className="absolute top-24 right-4 bg-black/60 p-3 rounded-full hover:bg-orange-500 transition-colors z-20"
            >
                <UserGroupIcon className="h-8 w-8 text-white"/>
            </button>
            
            {showFriends && <FriendsPanel onClose={() => setShowFriends(false)} />}
        </div>
    );
};

export default HomeScreen;