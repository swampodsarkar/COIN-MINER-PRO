
import React, { useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { LeaderboardEntry } from '../../types';
import { Spinner } from '../ui/Spinner';

interface LeaderboardViewProps {
    onBack: () => void;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onBack }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = () => {
        setLoading(true);
        const leaderboardRef = database.ref('leaderboard').orderByChild('gold').limitToLast(100);
        leaderboardRef.once('value', snapshot => {
            const data: { [key: string]: { username: string; gold: number } } = snapshot.val();
            if (data) {
                const sortedData = Object.keys(data)
                    .map(key => ({
                        uid: key,
                        username: data[key].username,
                        gold: data[key].gold,
                    }))
                    .sort((a, b) => b.gold - a.gold);
                setLeaderboard(sortedData);
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-3xl h-full flex flex-col bg-black bg-opacity-60 p-4 rounded-xl border-2 border-yellow-600 relative">
            <button onClick={onBack} className="absolute top-3 left-3 text-2xl bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors">
                ⬅️
            </button>
            <h3 className="text-center text-2xl text-yellow-300 mb-6">TOP MINERS</h3>
            {loading ? (
                <div className="flex justify-center items-center h-64"><Spinner /></div>
            ) : (
                <div className="flex-grow overflow-y-auto">
                    <ul className="space-y-2">
                        {leaderboard.map((entry, index) => (
                            <li key={entry.uid} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-md">
                                <div className="flex items-center">
                                    <span className={`font-bold w-10 text-lg ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}`}>{index + 1}.</span>
                                    <span className="text-white text-lg">{entry.username}</span>
                                </div>
                                <div className="flex items-center bg-gray-900/50 px-3 py-1 rounded-full">
                                    <span className="text-yellow-300 font-semibold">💰 {Math.floor(entry.gold).toLocaleString()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LeaderboardView;
