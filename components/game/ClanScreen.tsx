
import React, { useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { LeaderboardEntry } from '../../types';
import { Spinner } from '../ui/Spinner';
import { DIVISIONS } from '../../gameConfig';

const DivisionRankingsModal: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const leaderboardRef = database.ref('leaderboard').orderByChild('divisionPoints').limitToLast(100);
        leaderboardRef.once('value', snapshot => {
            const data: { [key: string]: LeaderboardEntry } = snapshot.val();
            if (data) {
                const sortedData = Object.keys(data)
                    .map(key => ({
                        uid: key,
                        username: data[key].username,
                        divisionPoints: data[key].divisionPoints || 0,
                        division: data[key].division || 'Division 10',
                    }))
                    .sort((a, b) => b.divisionPoints - a.divisionPoints);
                setLeaderboard(sortedData);
            }
            setLoading(false);
        });
    }, []);

    return (
        <div className="w-full h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-lg border-2 border-cyan-600 relative">
            <h3 className="text-center text-3xl font-bold text-cyan-300 mb-6">DIVISION RANKINGS</h3>
            {loading ? (
                <div className="flex justify-center items-center h-64"><Spinner /></div>
            ) : (
                <div className="flex-grow overflow-y-auto pr-2">
                    <ul className="space-y-2">
                        {leaderboard.map((entry, index) => {
                             const divisionConfig = DIVISIONS[entry.division] || DIVISIONS['Division 10'];
                             return (
                                <li key={entry.uid} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-md">
                                    <div className="flex items-center">
                                        <span className={`font-bold w-10 text-lg ${index < 3 ? 'text-cyan-400' : 'text-gray-400'}`}>{index + 1}.</span>
                                        <div className="flex flex-col ml-2">
                                            <span className="text-white text-lg font-semibold">{entry.username}</span>
                                            <span className="text-xs font-bold" style={{ color: divisionConfig.color }}>{entry.division}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-900/50 px-3 py-1 rounded-full">
                                        <span className="text-blue-300 font-semibold">{entry.divisionPoints.toLocaleString()} pts</span>
                                    </div>
                                </li>
                             )
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DivisionRankingsModal;
