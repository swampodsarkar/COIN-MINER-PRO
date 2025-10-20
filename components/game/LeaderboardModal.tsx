import React, { useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { LeaderboardEntry } from '../../types';
import { Spinner } from '../ui/Spinner';
// FIX: Use DIVISIONS config which is available, instead of RANKS which is not.
import { DIVISIONS } from '../../gameConfig';

interface LeaderboardProps {
    onBack: () => void;
}

const LeaderboardModal: React.FC<LeaderboardProps> = ({ onBack }) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // FIX: Order by 'divisionPoints' which exists on the LeaderboardEntry type.
        const leaderboardRef = database.ref('leaderboard').orderByChild('divisionPoints').limitToLast(100);
        leaderboardRef.once('value', snapshot => {
            const data: { [key: string]: LeaderboardEntry } = snapshot.val();
            if (data) {
                const sortedData = Object.keys(data)
                    .map(key => ({
                        uid: key,
                        username: data[key].username,
                        // FIX: Use 'divisionPoints' and 'division' which exist on LeaderboardEntry type.
                        divisionPoints: data[key].divisionPoints || 0,
                        division: data[key].division || 'Division 10',
                    }))
                    // FIX: Sort by 'divisionPoints'.
                    .sort((a, b) => b.divisionPoints - a.divisionPoints);
                setLeaderboard(sortedData);
            }
            setLoading(false);
        });
    }, []);

    return (
        <div className="w-full h-full flex flex-col bg-black bg-opacity-70 p-4 rounded-lg border-2 border-orange-600 relative">
            <button onClick={onBack} className="absolute top-4 left-4 text-2xl bg-gray-700 hover:bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors transform hover:scale-110 z-10">
                ⬅️
            </button>
            <h3 className="text-center text-3xl font-bold text-orange-300 mb-6">GLOBAL RANKINGS</h3>
            {loading ? (
                <div className="flex justify-center items-center h-64"><Spinner /></div>
            ) : (
                <div className="flex-grow overflow-y-auto pr-2">
                    <ul className="space-y-2">
                        {leaderboard.map((entry, index) => {
                             // FIX: Use DIVISIONS config to get division color.
                             const divisionConfig = DIVISIONS[entry.division] || DIVISIONS['Division 10'];
                             return (
                                <li key={entry.uid} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-md">
                                    <div className="flex items-center">
                                        <span className={`font-bold w-10 text-lg ${index < 3 ? 'text-orange-400' : 'text-gray-400'}`}>{index + 1}.</span>
                                        <div className="flex flex-col ml-2">
                                            <span className="text-white text-lg font-semibold">{entry.username}</span>
                                            {/* FIX: Display division name with its color. */}
                                            <span className="text-xs font-bold" style={{ color: divisionConfig.color }}>{entry.division}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center bg-gray-900/50 px-3 py-1 rounded-full">
                                        {/* FIX: Display divisionPoints and use "pts" suffix. */}
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

export default LeaderboardModal;
