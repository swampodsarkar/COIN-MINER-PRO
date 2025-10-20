import React, { useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { MatchHistory } from '../../types';
import { Spinner } from '../ui/Spinner';

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

    const resultStyles = {
        WIN: { color: 'text-green-400', borderColor: 'border-green-500', bgColor: 'bg-green-500/10' },
        DEFEAT: { color: 'text-red-400', borderColor: 'border-red-500', bgColor: 'bg-red-500/10' },
        DRAW: { color: 'text-yellow-400', borderColor: 'border-yellow-500', bgColor: 'bg-yellow-500/10' },
    };

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
                            const styles = resultStyles[match.result] || resultStyles.DRAW;
                            const modeName = match.mode === 'ai' ? 'Tour Event' : 'Division Match';
                            return (
                                <li key={match.id} className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${styles.borderColor} ${styles.bgColor}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{match.mode === 'ai' ? '🤖' : '🌐'}</div>
                                        <div>
                                            <p className={`font-bold text-lg ${styles.color}`}>
                                                {match.result} ({match.score})
                                            </p>
                                            <p className="text-xs text-gray-400">{modeName} - {new Date(match.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                         <p className="font-semibold text-yellow-400">
                                            +{Math.floor(match.gpChange).toLocaleString()} GP
                                        </p>
                                        <p className={`text-sm font-semibold ${match.divisionPointsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {match.divisionPointsChange >= 0 ? `+${match.divisionPointsChange}` : match.divisionPointsChange} pts
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
