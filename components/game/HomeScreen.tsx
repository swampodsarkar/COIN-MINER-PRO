import React from 'react';
import { Player } from '../../types';
import { HEROES } from '../../gameConfig';

interface HomeScreenProps {
    player: Player;
    onPlay: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ player, onPlay }) => {
    // For now, just show the first hero they own. This can be expanded to a "favorite hero" system.
    const displayHeroId = player.ownedHeroes[0] || 'toro';
    const displayHero = HEROES[displayHeroId];
    const heroSkin = displayHero.skins.find(s => s.id === `${displayHero.id}_default`);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Hero display */}
            <div className="absolute inset-0 flex items-center justify-center">
                <img 
                    src={heroSkin?.fullUrl} 
                    alt={displayHero.name} 
                    className="max-w-[80%] max-h-[80%] object-contain -mb-20" 
                />
            </div>

            {/* Play Button */}
            <div className="absolute bottom-10 right-10">
                <button
                    onClick={onPlay}
                    className="bg-yellow-500 text-gray-900 font-bold text-3xl py-6 px-12 rounded-lg border-4 border-yellow-300 shadow-2xl shadow-yellow-500/30 transform transition-transform hover:scale-105 hover:brightness-110"
                >
                    PLAY
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
