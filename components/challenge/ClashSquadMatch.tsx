import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../../types';
import { CHARACTERS } from '../../gameConfig';

interface ClashSquadMatchProps {
    player: Player;
    onMatchEnd: (result: 'VICTORY' | 'DEFEAT', goldChange: number, rankPointsChange: number, playerCharacterId: string, placement: number, kills: number) => void;
}

const GOLD_PER_ROUND_WIN = 50;
const RP_WIN = 12;
const RP_LOSS = -8;

const ClashSquadMatch: React.FC<ClashSquadMatchProps> = ({ player, onMatchEnd }) => {
    const [score, setScore] = useState({ player: 0, enemy: 0 });
    const [round, setRound] = useState(1);
    const [log, setLog] = useState<string[]>(['Match Started! First to 4 wins.']);
    const [roundResult, setRoundResult] = useState<'WON' | 'LOST' | null>(null);
    const [isMatchOver, setIsMatchOver] = useState(false);
    const [totalKills, setTotalKills] = useState(0);

    const playerCharacter = CHARACTERS[player.ownedCharacters[0] || 'alok'];
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isMatchOver) return;
    
        const simulateRound = () => {
            if (score.player >= 4 || score.enemy >= 4) {
                setIsMatchOver(true);
                return;
            }

            setRoundResult(null);

            const playerTeamStrength = 50 + (player.rankPoints / 20); // Base strength + rank bonus
            const enemyTeamStrength = 55; // Slightly tougher enemies

            const roundWinChance = playerTeamStrength / (playerTeamStrength + enemyTeamStrength);
            const playerWins = Math.random() < roundWinChance;
            const killsThisRound = Math.floor(Math.random() * 3); // 0, 1, or 2 kills
            
            setTotalKills(k => k + killsThisRound);

            timeoutRef.current = setTimeout(() => {
                setRoundResult(playerWins ? 'WON' : 'LOST');
                setLog(prev => [`Round ${round} ${playerWins ? 'Won' : 'Lost'}!`, `You got ${killsThisRound} kills.`, ...prev].slice(0, 4));
                
                setScore(s => ({
                    player: s.player + (playerWins ? 1 : 0),
                    enemy: s.enemy + (playerWins ? 0 : 1),
                }));

            }, 2000); 

            timeoutRef.current = setTimeout(() => {
                setRound(r => r + 1);
            }, 3500);
        };

        timeoutRef.current = setTimeout(simulateRound, 1500);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [round, isMatchOver]);
    
    useEffect(() => {
        if (score.player >= 4 || score.enemy >= 4) {
             if (!isMatchOver) {
                setIsMatchOver(true);
                const playerWonMatch = score.player >= 4;
                const result = playerWonMatch ? 'VICTORY' : 'DEFEAT';
                const goldChange = score.player * GOLD_PER_ROUND_WIN;
                const rankPointsChange = playerWonMatch ? RP_WIN : RP_LOSS;
                const placement = playerWonMatch ? 1 : 2;
                onMatchEnd(result, goldChange, rankPointsChange, playerCharacter.id, placement, totalKills);
            }
        }
    }, [score, isMatchOver, onMatchEnd, playerCharacter.id, totalKills]);

    if (isMatchOver) {
        const playerWonMatch = score.player >= 4;
        return (
            <div className="flex flex-col items-center justify-center text-center animate-fade-in">
                <h1 className={`text-6xl sm:text-8xl font-bold tracking-widest animate-victory ${playerWonMatch ? 'text-orange-400' : 'text-gray-400'}`}>
                    {playerWonMatch ? 'VICTORY' : 'DEFEAT'}
                </h1>
                <p className="mt-4 text-xl text-white">
                    Final Score: {score.player} - {score.enemy}
                </p>
                 <p className="mt-2 text-lg text-gray-300">
                    Total Kills: {totalKills}
                </p>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-between bg-black bg-opacity-60 p-4 rounded-xl border-2 border-purple-600 animate-fade-in">
            <div className="w-full flex justify-between items-center text-white text-center">
                 <div>
                    <p className="text-xl font-bold">Your Team</p>
                    <p className="text-5xl font-bold text-blue-400">{score.player}</p>
                 </div>
                 <div className="text-2xl font-bold">
                    <p>Round</p>
                    <p>{round}</p>
                 </div>
                 <div>
                    <p className="text-xl font-bold">Enemy Team</p>
                    <p className="text-5xl font-bold text-red-400">{score.enemy}</p>
                 </div>
            </div>
            
            <div className="h-40 flex items-center justify-center">
                {roundResult ? (
                    <h2 className={`text-5xl font-bold animate-pulse ${roundResult === 'WON' ? 'text-green-400' : 'text-red-500'}`}>
                        ROUND {roundResult}!
                    </h2>
                ) : (
                     <div className="text-6xl my-8 drop-shadow-lg">
                        {playerCharacter.emoji}
                    </div>
                )}
            </div>

            <div className="w-full h-24 bg-black/30 rounded p-2 text-sm text-gray-300 text-center">
                {log.map((l, i) => <p key={i} className={i === 0 ? 'text-white animate-fade-in' : 'opacity-50'}>{l}</p>)}
            </div>
        </div>
    );
};

export default ClashSquadMatch;
