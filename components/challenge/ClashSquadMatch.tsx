
import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../../types';
import { PLAYERS } from '../../gameConfig';

interface FootballMatchProps {
    player: Player;
    opponentStrength: number;
    onMatchEnd: (result: { result: 'WIN' | 'DEFEAT' | 'DRAW', gpChange: number, divisionPointsChange: number, score: string }) => void;
}

const GP_PER_GOAL = 100;
const GP_WIN = 1000;
const GP_DRAW = 400;
const GP_LOSS = 200;
const DP_WIN = 3;
const DP_DRAW = 1;
const DP_LOSS = 0; // No loss of points in this version

const FootballMatch: React.FC<FootballMatchProps> = ({ player, opponentStrength, onMatchEnd }) => {
    const [score, setScore] = useState({ player: 0, enemy: 0 });
    const [time, setTime] = useState(0);
    const [log, setLog] = useState<string[]>(["0' - Kick Off!"]);
    const [isMatchOver, setIsMatchOver] = useState(false);
    
    const playerTeamStrength = player.squad.reduce((acc, playerId) => acc + (PLAYERS[playerId]?.overall || 75), 0) / 11;
    const opponentTeamStrength = (opponentStrength / 10) + 70; // Scale opponent strength

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTime(t => t + 1);
        }, 200); // 90 minutes in ~18 seconds

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (isMatchOver) return;

        // Simulate match event
        const totalStrength = playerTeamStrength + opponentTeamStrength;
        const chanceOfEvent = 0.3; // 30% chance of an event each "minute"

        if (Math.random() < chanceOfEvent) {
            const isPlayerEvent = Math.random() < (playerTeamStrength / totalStrength);
            if (isPlayerEvent) {
                // Player team event
                const scorer = PLAYERS[player.squad[Math.floor(Math.random() * 11)]];
                setLog(prev => [`${time}' - GOAL! ${scorer.name} scores for your team!`, ...prev].slice(0, 5));
                setScore(s => ({ ...s, player: s.player + 1 }));
            } else {
                // Opponent team event
                setLog(prev => [`${time}' - Goal for the opponent...`, ...prev].slice(0, 5));
                setScore(s => ({ ...s, enemy: s.enemy + 1 }));
            }
        }

        if (time >= 90) {
            setIsMatchOver(true);
            if (intervalRef.current) clearInterval(intervalRef.current);

            const { player: pScore, enemy: eScore } = score;
            let result: 'WIN' | 'DEFEAT' | 'DRAW';
            let gpChange = 0;
            let divisionPointsChange = 0;

            if (pScore > eScore) {
                result = 'WIN';
                gpChange = GP_WIN + (pScore * GP_PER_GOAL);
                divisionPointsChange = DP_WIN;
            } else if (pScore < eScore) {
                result = 'DEFEAT';
                gpChange = GP_LOSS + (pScore * GP_PER_GOAL);
                divisionPointsChange = DP_LOSS;
            } else {
                result = 'DRAW';
                gpChange = GP_DRAW + (pScore * GP_PER_GOAL);
                divisionPointsChange = DP_DRAW;
            }

            setTimeout(() => {
                onMatchEnd({ result, gpChange, divisionPointsChange, score: `${pScore} - ${eScore}` });
            }, 2000);
        }
    }, [time, isMatchOver]);


    return (
        <div className="w-full h-full flex flex-col items-center justify-between bg-black bg-opacity-60 p-4 rounded-xl border-2 border-cyan-700 animate-fade-in">
            {/* Scoreboard */}
            <div className="w-full flex justify-between items-center text-white text-center p-4 bg-gray-900/50 rounded-lg">
                 <div className="w-1/3">
                    <p className="text-xl font-bold truncate">{player.username}</p>
                 </div>
                 <div className="text-2xl font-bold w-1/3">
                    <p className="text-5xl">{score.player} - {score.enemy}</p>
                    <p className="text-2xl mt-1">{time}'</p>
                 </div>
                 <div className="w-1/3">
                    <p className="text-xl font-bold">Opponent</p>
                 </div>
            </div>
            
            {isMatchOver && (
                <div className="my-8 text-4xl font-bold text-yellow-400 animate-pulse">
                    FULL TIME
                </div>
            )}

            {/* Match Log */}
            <div className="w-full h-48 bg-black/30 rounded p-2 text-sm text-gray-300 text-center flex flex-col-reverse overflow-hidden">
                {log.map((l, i) => <p key={i} className={i === 0 ? 'text-white animate-fade-in' : 'opacity-60'}>{l}</p>)}
            </div>
        </div>
    );
};

export default FootballMatch;
