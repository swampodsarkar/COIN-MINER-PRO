// FIX: Added component implementation for the match screen.
import React, { useState, useEffect } from 'react';
import { Player } from '../../types';
import { HEROES } from '../../gameConfig';

interface ChallengeMatchProps {
    player: Player;
    opponent: Player | null; // For now, we can simulate a bot
    result: 'win' | 'loss';
    onMatchEnd: (result: 'win' | 'loss', goldChange: number, rankPointsChange: number) => void;
}

const GOLD_REWARD = 100;
const RANK_POINTS_CHANGE = 20;

const ChallengeMatch: React.FC<ChallengeMatchProps> = ({ player, result, onMatchEnd }) => {
    const [timeLeft, setTimeLeft] = useState(15);
    const [showResult, setShowResult] = useState(false);
    
    const playerHero = HEROES[player.ownedHeroes[0] || 'toro'];
    // For now, let's just pick a random hero for the bot
    const opponentHero = HEROES['valhein'];

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShowResult(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (showResult) {
            const goldChange = result === 'win' ? GOLD_REWARD : 0; // Win gold, lose nothing
            const rankPointsChange = result === 'win' ? RANK_POINTS_CHANGE : -RANK_POINTS_CHANGE;
            onMatchEnd(result, goldChange, rankPointsChange);
        }
    }, [showResult, result, onMatchEnd]);


    if (showResult) {
        return (
             <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                <h1 className={`text-6xl font-bold ${result === 'win' ? 'text-yellow-400' : 'text-red-500'}`}>
                    {result === 'win' ? 'VICTORY' : 'DEFEAT'}
                </h1>
                <p className="mt-4 text-lg text-white">
                    {result === 'win' ? `You earned ${GOLD_REWARD} Gold and ${RANK_POINTS_CHANGE} RP!` : `You lost ${RANK_POINTS_CHANGE} RP.`}
                </p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl h-full flex flex-col items-center justify-between bg-black bg-opacity-60 p-4 rounded-xl border-2 border-red-600 animate-fade-in">
            <div className="text-4xl font-bold text-white">{timeLeft}</div>
            <div className="flex w-full justify-around items-center">
                 {/* Player Side */}
                <div className="flex flex-col items-center">
                    <img src={playerHero.skins[0].fullUrl} alt={playerHero.name} className="h-64" />
                    <p className="text-white text-lg font-bold">{player.username}</p>
                </div>
                 <div className="text-5xl font-bold text-red-500">VS</div>
                {/* Opponent Side */}
                <div className="flex flex-col items-center">
                    <img src={opponentHero.skins[0].fullUrl} alt={opponentHero.name} className="h-64 scale-x-[-1]" />
                    <p className="text-white text-lg font-bold">Bot Player</p>
                </div>
            </div>
            <div className="text-lg text-gray-300">Destroy the Enemy Nexus!</div>
        </div>
    );
};

export default ChallengeMatch;
