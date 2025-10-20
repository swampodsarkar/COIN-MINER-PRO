
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../services/firebase';
import { Player, SystemData } from '../../types';
import { INITIAL_PLAYER_STATE } from '../../constants';
import Miner from './Miner';
import UpgradePanel from './UpgradePanel';
import LeaderboardView from './LeaderboardModal';
import DailyRewardModal from './DailyRewardModal';
import EventAnnouncer from './EventAnnouncer';
import { auth } from '../../services/firebase';

type GameView = 'mine' | 'upgrades' | 'leaderboard';

const GameScreen: React.FC = () => {
    const { user } = useAuth();
    const [player, setPlayer] = useState<Player | null>(null);
    const [system, setSystem] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<GameView>('mine');
    const [showDailyReward, setShowDailyReward] = useState(false);

    const playerRef = useRef(player);
    playerRef.current = player;

    const initializePlayer = useCallback(async () => {
        if (!user) return;
        const playerDbRef = database.ref(`users/${user.uid}`);
        const snapshot = await playerDbRef.get();
        if (snapshot.exists()) {
            const playerData = snapshot.val();
            const today = new Date().toISOString().split('T')[0];
            if(playerData.lastLogin !== today) {
                setShowDailyReward(true);
                playerData.lastLogin = today;
                playerData.dailyRewardClaimed = false;
            }
            setPlayer(playerData);
        } else {
            const newPlayer: Player = {
                ...INITIAL_PLAYER_STATE,
                uid: user.uid,
                username: user.displayName || user.email?.split('@')[0] || 'Miner',
                email: user.email || '',
                lastLogin: new Date().toISOString().split('T')[0],
                dailyRewardClaimed: true, // Claimed on first day
            };
            await playerDbRef.set(newPlayer);
            setPlayer(newPlayer);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        initializePlayer();
        const systemRef = database.ref('system');
        systemRef.on('value', snapshot => {
            setSystem(snapshot.val());
        });

        return () => systemRef.off();
    }, [initializePlayer]);

    const saveData = useCallback(() => {
        if (playerRef.current && user) {
            database.ref(`users/${user.uid}`).set(playerRef.current);
            database.ref(`leaderboard/${user.uid}`).set({
                username: playerRef.current.username,
                gold: playerRef.current.gold,
            });
        }
    }, [user]);

    useEffect(() => {
        const saveInterval = setInterval(saveData, 10000);
        window.addEventListener('beforeunload', saveData);
        
        return () => {
            clearInterval(saveInterval);
            window.removeEventListener('beforeunload', saveData);
            saveData();
        };
    }, [saveData]);
    
    useEffect(() => {
        if(!player || player.autoMinerLevel === 0) return;
        const autoMineInterval = setInterval(() => {
            setPlayer(p => {
                if(!p) return null;
                 const rushMultiplier = (system?.events.goldenRush && system.events.goldenRushEnds > Date.now()) ? 2 : 1;
                const goldGained = p.autoMinerLevel * p.miningPower * 0.5 * rushMultiplier;
                return {...p, gold: p.gold + goldGained };
            });
        }, 1000 / player.miningSpeed);

        return () => clearInterval(autoMineInterval);
    }, [player?.autoMinerLevel, player?.miningSpeed, player?.miningPower, system]);

    const handleMine = (amount: number) => {
        setPlayer(p => p ? { ...p, gold: p.gold + amount } : null);
    };
    
    const handleUpgrade = (type: 'miningPower' | 'miningSpeed' | 'autoMinerLevel', cost: number) => {
        setPlayer(p => {
            if(!p || p.gems < cost) return p;
            return {
                ...p,
                gems: p.gems - cost,
                [type]: p[type] + 1,
            };
        });
    };

    const handleClaimDailyReward = (gems: number) => {
        setPlayer(p => p ? { ...p, gems: p.gems + gems, dailyRewardClaimed: true } : null);
        setShowDailyReward(false);
    };

    const renderView = () => {
        switch(activeView) {
            case 'upgrades':
                return <UpgradePanel player={player!} onUpgrade={handleUpgrade} onBack={() => setActiveView('mine')}/>;
            case 'leaderboard':
                return <LeaderboardView onBack={() => setActiveView('mine')} />;
            case 'mine':
            default:
                return (
                    <>
                        <Miner player={player!} onMine={handleMine} system={system}/>
                        <div className="flex items-center justify-center space-x-4 mt-8">
                            <button 
                                onClick={() => setActiveView('upgrades')}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg border-b-4 border-yellow-700 shadow-lg transition-transform active:scale-95 text-lg"
                            >
                                Upgrades 📈
                            </button>
                            <button 
                                onClick={() => setActiveView('leaderboard')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg border-b-4 border-blue-700 shadow-lg transition-transform active:scale-95 text-lg"
                            >
                                Leaders 🏆
                            </button>
                        </div>
                    </>
                );
        }
    };

    if (loading || !player) {
        return <div className="flex items-center justify-center h-screen"><span className="text-2xl">Loading Mine...</span></div>;
    }

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-between overflow-hidden">
            {showDailyReward && !player.dailyRewardClaimed && <DailyRewardModal onClaim={handleClaimDailyReward} />}

            <EventAnnouncer system={system} />

            <header className="w-full max-w-5xl flex justify-between items-center bg-black bg-opacity-50 p-2 sm:p-4 rounded-b-xl border-b-2 border-l-2 border-r-2 border-yellow-600">
                <div className="flex items-center space-x-2 sm:space-x-4 text-sm sm:text-lg">
                    <div className="flex items-center bg-gray-800/70 px-2 py-1 sm:px-3 rounded-full border border-yellow-800">
                        <span className="text-2xl sm:text-3xl mr-2">💰</span>
                        <span className="text-yellow-400 font-bold">{Math.floor(player.gold).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center bg-gray-800/70 px-2 py-1 sm:px-3 rounded-full border border-blue-800">
                         <span className="text-2xl sm:text-3xl mr-2">💎</span>
                        <span className="text-blue-400 font-bold">{player.gems.toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex items-center">
                    <p className="text-yellow-300 mr-4 hidden sm:block">{player.username}</p>
                    <button onClick={() => auth.signOut()} className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm py-2 px-3 rounded-lg border-2 border-red-800">Logout</button>
                </div>
            </header>
            
            <main className="flex-grow w-full flex flex-col items-center justify-center p-4">
                {renderView()}
            </main>
            
             {/* Ad Placeholder */}
            <div className="w-full max-w-md bg-gray-800 bg-opacity-90 border-t-2 border-yellow-600 rounded-t-xl text-center py-2 text-xs">
                [BANNER AD PLACEHOLDER]
            </div>
        </div>
    );
};

export default GameScreen;
