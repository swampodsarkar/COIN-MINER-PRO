import React, { useState, useEffect } from 'react';
import { Player, Division } from '../../types';
import { database } from '../../services/firebase';
import FootballMatch from './ClashSquadMatch'; // Renamed component, this is the match simulation
import { DIVISIONS } from '../../gameConfig';
import { Spinner } from '../ui/Spinner';

interface MatchmakingScreenProps {
    player: Player;
    gameMode: 'division' | 'ai';
    onBack: () => void;
    onRankUpdate: (newDivision: Division, newDivisionPoints: number) => void;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

const MatchmakingScreen: React.FC<MatchmakingScreenProps> = ({ player, gameMode, onBack, onRankUpdate, setPlayer }) => {
    const [status, setStatus] = useState<'searching' | 'match' | 'results'>('searching');
    const [opponentStrength, setOpponentStrength] = useState(100);
    const [matchResult, setMatchResult] = useState<any>(null);

    useEffect(() => {
        if (status === 'searching') {
            const searchTimeout = setTimeout(() => {
                // Simulate finding an opponent
                // For AI mode, strength is based on division
                // For Division mode, it's a random but close strength
                const baseStrength = Object.keys(DIVISIONS).indexOf(player.division) * 10;
                setOpponentStrength(baseStrength + Math.floor(Math.random() * 20));
                setStatus('match');
            }, 3000); // 3-second search time

            return () => clearTimeout(searchTimeout);
        }
    }, [status, player.division]);

    const handleMatchEnd = (result: { result: 'WIN' | 'DEFEAT' | 'DRAW', gpChange: number, divisionPointsChange: number, score: string }) => {
        setMatchResult(result);
        setStatus('results');

        const newGp = player.gp + result.gpChange;
        
        let newDivision = player.division;
        let newDivisionPoints = player.divisionPoints;
        if (gameMode === 'division') {
            newDivisionPoints += result.divisionPointsChange;
            
            // Check for promotion/relegation
            const currentDivisionConfig = DIVISIONS[player.division];
            const divisionKeys = Object.keys(DIVISIONS) as Division[];
            const currentDivisionIndex = divisionKeys.indexOf(player.division);

            if (currentDivisionConfig.pointsToPromote !== null && newDivisionPoints >= currentDivisionConfig.pointsToPromote && currentDivisionIndex < divisionKeys.length - 1) {
                // Promotion
                const nextDivisionIndex = divisionKeys.findIndex(d => d > newDivision)
                newDivision = divisionKeys[currentDivisionIndex + 1];
                newDivisionPoints = 0; // Reset points on promotion
            } else if (currentDivisionConfig.pointsToRelegate !== null && newDivisionPoints < 0 && currentDivisionIndex > 0) {
                 // Relegation
                 newDivision = divisionKeys[currentDivisionIndex - 1];
                 newDivisionPoints = DIVISIONS[newDivision].pointsToPromote - 1; // Start just below promotion threshold of new division
            }
        }

        onRankUpdate(newDivision, newDivisionPoints);

        const newMatchHistoryEntry = {
            result: result.result,
            score: result.score,
            mode: gameMode,
            timestamp: Date.now(),
            gpChange: result.gpChange,
            divisionPointsChange: gameMode === 'division' ? result.divisionPointsChange : 0,
        };

        setPlayer(p => {
            if (!p) return null;
            const updatedPlayer = {
                ...p,
                gp: newGp,
                division: newDivision,
                divisionPoints: newDivisionPoints,
                matchHistory: {
                    ...p.matchHistory,
                    [Date.now()]: newMatchHistoryEntry
                }
            };
            // Save to Firebase immediately after a match
            database.ref(`users/${p.uid}`).set(updatedPlayer);
            return updatedPlayer;
        });
    };

    if (status === 'searching') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 p-4 rounded-xl text-white">
                <h2 className="text-3xl font-bold mb-4">Searching for Opponent...</h2>
                <Spinner />
                <button onClick={onBack} className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
            </div>
        );
    }

    if (status === 'match') {
        return <FootballMatch player={player} opponentStrength={opponentStrength} onMatchEnd={handleMatchEnd} />;
    }

    if (status === 'results' && matchResult) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 p-4 rounded-xl text-white text-center">
                <h2 className={`text-5xl font-bold mb-2 ${matchResult.result === 'WIN' ? 'text-green-400' : matchResult.result === 'DEFEAT' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {matchResult.result}
                </h2>
                <p className="text-3xl mb-8">{matchResult.score}</p>
                <div className="space-y-2 text-lg">
                    <p>GP Earned: <span className="text-yellow-400 font-bold">+{matchResult.gpChange.toLocaleString()}</span></p>
                    {gameMode === 'division' && (
                        <p>Division Points: <span className={`${matchResult.divisionPointsChange >= 0 ? 'text-green-400' : 'text-red-400'} font-bold`}>
                            {matchResult.divisionPointsChange >= 0 ? `+${matchResult.divisionPointsChange}` : matchResult.divisionPointsChange}
                        </span></p>
                    )}
                </div>
                <button onClick={onBack} className="mt-8 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-lg text-lg">Continue</button>
            </div>
        );
    }

    return null;
};

export default MatchmakingScreen;
