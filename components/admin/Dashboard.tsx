
import React, { useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { Player, LeaderboardEntry } from '../../types';
import { Spinner } from '../ui/Spinner';

const StatCard: React.FC<{title: string; value: string | number}> = ({ title, value }) => (
    <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-gray-400 text-sm font-medium uppercase">{title}</h3>
        <p className="text-3xl font-bold text-yellow-400 mt-2">{value}</p>
    </div>
);


const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ totalPlayers: 0, totalGold: 0 });
    const [topMiners, setTopMiners] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const usersRef = database.ref('users');
            const usersSnapshot = await usersRef.get();
            const usersData: {[key: string]: Player} = usersSnapshot.val() || {};
            const totalPlayers = Object.keys(usersData).length;
            const totalGold = Object.values(usersData).reduce((sum, player) => sum + player.gold, 0);
            
            setStats({ totalPlayers, totalGold: Math.floor(totalGold) });

            const leaderboardRef = database.ref('leaderboard').orderByChild('gold').limitToLast(10);
            const leaderboardSnapshot = await leaderboardRef.get();
            const leaderboardData = leaderboardSnapshot.val() || {};
            const sortedMiners = Object.values(leaderboardData as {[key: string]: LeaderboardEntry})
                .sort((a, b) => b.gold - a.gold);

            setTopMiners(sortedMiners);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Registered Players" value={stats.totalPlayers.toLocaleString()} />
                <StatCard title="Total Gold Mined" value={stats.totalGold.toLocaleString()} />
            </div>

            <div className="mt-8 bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl text-yellow-300 mb-4">Top 10 Miners</h3>
                <ul className="space-y-2">
                    {topMiners.map((miner, index) => (
                        <li key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                            <span>{index + 1}. {miner.username}</span>
                            <span className="text-yellow-400">{Math.floor(miner.gold).toLocaleString()} Gold</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
