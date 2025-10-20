import React, { useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { ChallengeHistoryEntry } from '../../types';
import { Spinner } from '../ui/Spinner';

interface ChallengeHistoryProps {
    playerUid: string;
    onBack: () => void;
}

const ChallengeHistory: React.FC<ChallengeHistoryProps> = ({ playerUid, onBack }) => {
    const [history, setHistory] = useState<ChallengeHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const historyRef = database.ref(`users/${playerUid}/challengeHistory`).orderByChild('timestamp').limitToLast(50);
        historyRef.once('value', snapshot => {
            const data = snapshot.val();
            if (data) {
                const historyList = Object.values(data) as ChallengeHistoryEntry[];
                setHistory(historyList.reverse()); // Show most recent first
            }
            setLoading(false);
        });
    }, [playerUid]);

    const getResultIndicator = (result: 'win' | 'loss' | 'draw') => {
        switch(result) {
            case 'win': return <span className="text-green-500 font-bold text-lg">WIN</span>;
            case 'loss': return <span className="text-red-500 font-bold text-lg">LOSS</span>;
            case 'draw': return <span className="text-yellow-500 font-bold text-lg">DRAW</span>;
        }
    }

    return (
        <div className="w-full max-w-3xl h-full flex flex-col bg-black bg-opacity-60 p-4 rounded-xl border-2 border-yellow-600 relative">
            <button onClick={onBack} className="absolute top-3 left-3 text-2xl bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10 transform hover:scale-110">
                ⬅️
            </button>
            <h3 className="text-center text-2xl text-yellow-300 mb-6">MATCH HISTORY</h3>
            {loading ? (
                <div className="flex justify-center items-center h-full"><Spinner /></div>
            ) : history.length === 0 ? (
                 <div className="flex justify-center items-center h-full">
                    <p className="text-gray-400">No matches played yet.</p>
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto pr-2">
                    <ul className="space-y-2">
                        {history.map((entry, index) => (
                            <li key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-md">
                                <div className="flex flex-col">
                                    <span className="text-white text-base">vs {entry.opponentUsername}</span>
                                     <span className="text-yellow-400 text-sm">💰 {entry.betAmount.toLocaleString()}</span>
                                </div>
                                {getResultIndicator(entry.result)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ChallengeHistory;