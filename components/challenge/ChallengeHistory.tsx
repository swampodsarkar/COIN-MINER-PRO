
import React, { useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { MatchHistory } from '../../types';
import { Spinner } from '../ui/Spinner';
import { CHARACTERS } from '../../gameConfig';

interface MatchHistoryScreenProps {
    playerId: string;
    onBack: () => void;
}

const MatchHistoryScreen: React.FC<MatchHistoryScreenProps> = ({ playerId, onBack }) => {
    const [history, setHistory] = useState<MatchHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const historyRef = database.ref(`users/${playerId}/matchHistory`).orderByChild('timestamp').limitToLast(20);
        historyRef.once('value', snapshot => {
            const data = snapshot.val();
            if (data) {
                const historyList = Object.keys(data)
                    .map(key => ({ id: key, ...data[key] }))
                    .sort((a, b) => b.timestamp - a.timestamp);
                setHistory(historyList);
            }
            setLoading(false);
        });
    }, [playerId]);

    return (
        <div className="w-full max-w-2xl h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-xl border-2 border-blue-600 relative">
            <button onClick={onBack} className="absolute top-4 left-4 text-2xl bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors transform hover:scale-110 z-10">
                ⬅️
            </button>
            <h3 className="text-center text-2xl font-bold text-orange-300 mb-6">Match History</h3>
            {loading ? (
                <div className="flex justify-center items-center h-64"><Spinner /></div>
            ) : history.length === 0 ? (
                 <p className="text-center text-gray-400 mt-8">No matches played yet.</p>
            ) : (
                <div className="flex-grow overflow-y-auto pr-2">
                    <ul className="space-y-2">
                        {history.map(match => {
                            const playerCharacter = CHARACTERS[match.playerCharacterId] || null;
                            const isVictory = match.result === 'VICTORY';
                            const modeIcon = match.mode === 'cs' ? '⚔️' : '🏝️';
                            return (
                                <li key={match.id} className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${isVictory ? 'border-orange-500 bg-orange-500/10' : 'border-gray-500 bg-gray-500/10'}`}>
                                    <div className="flex items-center gap-3">
                                        {playerCharacter && <span className="text-3xl">{playerCharacter.emoji}</span>}
                                        <div>
                                            <p className={`font-bold text-lg ${isVictory ? 'text-orange-300' : 'text-white'} flex items-center gap-2`}>
                                                <span>{modeIcon}</span>
                                                <span>{match.mode === 'br' ? `#${match.placement}` : (isVictory ? 'Victory' : 'Defeat')}</span>
                                            </p>
                                            <p className="text-xs text-gray-400">{new Date(match.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                         <p className="font-semibold text-white">
                                            {match.kills} Kills
                                        </p>
                                        <p className={`text-sm font-semibold ${match.rankPointsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {match.rankPointsChange >= 0 ? `+${match.rankPointsChange}` : match.rankPointsChange} RP
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MatchHistoryScreen;