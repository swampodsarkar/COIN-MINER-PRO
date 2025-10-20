import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../services/firebase';
import { Player, SystemData, Rank, MembershipInfo } from '../../types';
import { INITIAL_PLAYER_STATE } from '../../constants';
import LeaderboardModal from './LeaderboardModal';
import DailyRewardModal from './DailyRewardModal';
import EventAnnouncer from './EventAnnouncer';
import ChallengeScreen from '../challenge/ChallengeScreen';
import { auth } from '../../services/firebase';
import HeroStore from './HeroStore';
import SettingsModal from './SettingsModal';
import TopUpModal from './TopUpModal';
import HomeScreen from './HomeScreen';
import BottomNavBar from './BottomNavBar';
import { HEROES } from '../../gameConfig';

export type GameView = 'home' | 'heroes' | 'prep' | 'shop' | 'leaderboard';

const daysBetween = (dateStr1: string, dateStr2: string): number => {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

const GameScreen: React.FC = () => {
    const { user } = useAuth();
    const [player, setPlayer] = useState<Player | null>(null);
    const [system, setSystem] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<GameView>('home');
    const [showDailyReward, setShowDailyReward] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [showChallengeScreen, setShowChallengeScreen] = useState(false);

    const playerRef = useRef(player);
    playerRef.current = player;

    const initializePlayer = useCallback(async () => {
        if (!user) return;
        const playerDbRef = database.ref(`users/${user.uid}`);
        const snapshot = await playerDbRef.get();
        if (snapshot.exists()) {
            const dbData = snapshot.val();
            let playerData: Player = {
                ...INITIAL_PLAYER_STATE,
                ...dbData,
                uid: user.uid,
                username: dbData.username || user.displayName || user.email?.split('@')[0] || 'Player',
                email: user.email || '',
                gold: dbData.gold ?? INITIAL_PLAYER_STATE.gold,
                diamonds: dbData.diamonds ?? INITIAL_PLAYER_STATE.diamonds,
                rank: dbData.rank || INITIAL_PLAYER_STATE.rank,
                ownedHeroes: dbData.ownedHeroes || [...INITIAL_PLAYER_STATE.ownedHeroes],
            };
    
            const todayISO = new Date().toISOString();
            const today = todayISO.split('T')[0];
            const daysDiff = daysBetween(playerData.lastLogin, today);
    
            if (daysDiff > 0) {
                let updates: Partial<Player> = { lastLogin: today, dailyRewardClaimed: false };
                if (daysDiff > 1) { updates.loginStreak = 0; }
                await playerDbRef.update(updates);
                playerData = { ...playerData, ...updates };
            }
    
            if (playerData.activeMembership) {
                const now = Date.now();
                if (playerData.activeMembership.expiresAt < now) {
                    playerData.activeMembership = null;
                } else {
                    const lastClaimedDate = new Date(playerData.activeMembership.lastClaimedDailyDiamonds);
                    if (lastClaimedDate < new Date(today)) {
                        const diamondsPerDay = playerData.activeMembership.type === 'weekly' ? 50 : 80;
                        playerData.diamonds += diamondsPerDay;
                        playerData.activeMembership.lastClaimedDailyDiamonds = today;
                    }
                }
            }
            if (!playerData.dailyRewardClaimed) setShowDailyReward(true);
            setPlayer(playerData);
        } else {
            const newPlayer: Player = {
                ...INITIAL_PLAYER_STATE,
                uid: user.uid,
                username: user.displayName || user.email?.split('@')[0] || 'Player',
                email: user.email || '',
            };
            await playerDbRef.set(newPlayer);
            setPlayer(newPlayer);
            setShowDailyReward(true);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        initializePlayer();
        const systemRef = database.ref('system');
        systemRef.on('value', snapshot => setSystem(snapshot.val()));
        return () => systemRef.off();
    }, [initializePlayer]);

    const saveData = useCallback(() => {
        if (playerRef.current && user) {
            database.ref(`users/${user.uid}`).set(playerRef.current);
            database.ref(`leaderboard/${user.uid}`).set({
                username: playerRef.current.username,
                rankPoints: playerRef.current.rankPoints,
                rank: playerRef.current.rank,
            });
        }
    }, [user]);

    useEffect(() => {
        const saveInterval = setInterval(saveData, 15000);
        window.addEventListener('beforeunload', saveData);
        return () => {
            clearInterval(saveInterval);
            window.removeEventListener('beforeunload', saveData);
            saveData();
        };
    }, [saveData]);

    const handleClaimDailyReward = (reward: { type: string; value: number | string }) => {
        setPlayer(p => {
            if (!p) return null;
            const newStreak = (p.loginStreak % 7) + 1;
            let updatedPlayer = {...p};
            if (reward.type === 'gold') updatedPlayer.gold += reward.value as number;
            else if (reward.type === 'diamonds') updatedPlayer.diamonds += reward.value as number;
            updatedPlayer.dailyRewardClaimed = true;
            updatedPlayer.loginStreak = newStreak;
            return updatedPlayer;
        });
        setShowDailyReward(false);
    };

    const handleRankUpdate = (newRank: Rank, newRankPoints: number) => {
        setPlayer(p => p ? {...p, rank: newRank, rankPoints: newRankPoints } : null);
    };

    const handleBuyHero = (hero: { id: string, cost: { gold: number, diamonds: number }}) => {
         setPlayer(p => {
            if (!p || (p.gold < hero.cost.gold && p.diamonds < hero.cost.diamonds)) return p;
            
            const costInGold = hero.cost.gold > 0;

            return {
                ...p,
                gold: costInGold ? p.gold - hero.cost.gold : p.gold,
                diamonds: !costInGold ? p.diamonds - hero.cost.diamonds : p.diamonds,
                ownedHeroes: [...p.ownedHeroes, hero.id]
            };
        });
    }

    const renderView = () => {
        if (showChallengeScreen) {
             return <ChallengeScreen 
                player={player!} 
                onBack={() => setShowChallengeScreen(false)} 
                onBalanceUpdate={(newGold) => setPlayer(p => p ? {...p, gold: newGold} : null)} 
                onRankUpdate={handleRankUpdate} 
            />;
        }
        switch(activeView) {
            case 'heroes':
                return <HeroStore player={player!} onBuyHero={handleBuyHero} />;
            case 'leaderboard':
                return <LeaderboardModal onBack={() => setActiveView('home')} />;
            case 'home':
            default:
                return <HomeScreen player={player!} onPlay={() => setShowChallengeScreen(true)} />;
        }
    };

    if (loading || !player) {
        return <div className="flex items-center justify-center h-screen"><span className="text-2xl">Entering the Battlefield...</span></div>;
    }

    const firstHero = HEROES[player.ownedHeroes[0]] || HEROES.toro;

    return (
        <div 
            className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-cover bg-center" 
            style={{backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/gen-z-airdrop.appspot.com/o/backgrounds%2Flobby_bg.jpg?alt=media&token=85a1197a-9cb2-474c-8197-231a6136e09e')`}}
        >
             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
             {showDailyReward && !player.dailyRewardClaimed && <DailyRewardModal loginStreak={player.loginStreak} onClaim={handleClaimDailyReward} onClose={() => setShowDailyReward(false)} />}
             {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
             {showTopUpModal && <TopUpModal player={player} onClose={() => setShowTopUpModal(false)} onBuyGems={(amount) => setPlayer(p => p ? { ...p, diamonds: p.diamonds + amount } : null)} onBuyMembership={(type, days) => { /* logic */ }} />}

             <EventAnnouncer system={system} />

             <header className="absolute top-0 left-0 right-0 w-full flex justify-between items-center bg-black bg-opacity-30 p-2 sm:p-3 z-20">
                 <div className="flex items-center space-x-2">
                    <img src={firstHero.skins.find(s=>s.id === `${firstHero.id}_default`)?.iconUrl} alt="avatar" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-yellow-400"/>
                    <div>
                        <p className="text-white text-sm sm:text-lg font-bold">{player.username}</p>
                        <p className="text-yellow-300 text-xs sm:text-sm">{player.rank} {player.rankPoints} RP</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-2 sm:space-x-4">
                     <div className="flex items-center bg-gray-800/70 px-2 py-1 sm:px-3 rounded-full border border-yellow-800">
                         <span className="text-lg sm:text-xl mr-1 sm:mr-2">💰</span>
                         <span className="text-yellow-400 font-bold text-sm sm:text-base">{Math.floor(player.gold).toLocaleString()}</span>
                     </div>
                     <div className="flex items-center bg-gray-800/70 px-2 py-1 sm:px-3 rounded-full border border-blue-800">
                          <span className="text-lg sm:text-xl mr-1 sm:mr-2">💎</span>
                         <span className="text-blue-400 font-bold text-sm sm:text-base">{player.diamonds.toLocaleString()}</span>
                         <button onClick={() => setShowTopUpModal(true)} className="ml-2 bg-green-500 hover:bg-green-600 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-white font-bold text-xs transform transition-transform hover:scale-110">+</button>
                     </div>
                      <button onClick={() => setShowSettings(true)} className="text-2xl sm:text-3xl transform hover:scale-110 transition-transform">
                         ⚙️
                     </button>
                 </div>
             </header>
            
             <main className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 z-10 pt-16 sm:pt-20 pb-20 sm:pb-24">
                 <div key={activeView} className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                     {renderView()}
                 </div>
             </main>
            
             <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
        </div>
    );
};

export default GameScreen;