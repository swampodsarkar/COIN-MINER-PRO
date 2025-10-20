// FIX: Added component implementation for match history screen.
import React, { useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { MatchHistory } from '../../types';
import { Spinner } from '../ui/Spinner';

interface ChallengeHistoryProps {
    playerId: string;
    onBack: () => void;
}

const ChallengeHistory: React.FC<ChallengeHistoryProps> = ({ playerId, onBack }) => {
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
            <h3 className="text-center text-2xl font-bold text-yellow-300 mb-6">Match History</h3>
            {loading ? (
                <div className="flex justify-center items-center h-64"><Spinner /></div>
            ) : history.length === 0 ? (
                 <p className="text-center text-gray-400 mt-8">No matches played yet.</p>
            ) : (
                <div className="flex-grow overflow-y-auto pr-2">
                    <ul className="space-y-2">
                        {history.map(match => (
                            <li key={match.id} className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${match.result === 'win' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
                                <div>
                                    <p className="font-bold text-white">vs {match.opponentName}</p>
                                    <p className="text-xs text-gray-400">{new Date(match.timestamp).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                     <p className={`font-bold ${match.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                                        {match.result.toUpperCase()}
                                    </p>
                                    <p className={`text-sm font-semibold ${match.rankPointsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {match.rankPointsChange >= 0 ? `+${match.rankPointsChange}` : match.rankPointsChange} RP
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ChallengeHistory;
