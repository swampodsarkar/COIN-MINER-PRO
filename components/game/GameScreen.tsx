import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../services/firebase';
import { Player, SystemData, Rank, Character, Clan } from '../../types';
import { INITIAL_PLAYER_STATE, AVATAR_EMOJIS } from '../../constants';
import LeaderboardModal from './LeaderboardModal';
import DailyRewardModal from './DailyRewardModal';
import EventAnnouncer from './EventAnnouncer';
import ChallengeScreen from '../challenge/ChallengeScreen';
import HeroStore from './HeroStore';
import SettingsModal from './SettingsModal';
import TopUpModal from './TopUpModal';
import HomeScreen from './HomeScreen';
import BottomNavBar from './BottomNavBar';
import EventsScreen from './EsportsScreen';
import LuckRoyale from './LuckRoyale';
import PetStore from './PetStore';
import ClanScreen from './ClanScreen';
import { PETS } from '../../gameConfig';

export type GameView = 'home' | 'character' | 'luck_royale' | 'events' | 'leaderboard' | 'pet' | 'clan';

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
    const [playerClan, setPlayerClan] = useState<Clan | null>(null);
    const [system, setSystem] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<GameView>('home');
    const [showDailyReward, setShowDailyReward] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [showChallengeScreen, setShowChallengeScreen] = useState(false);
    const [selectedGameMode, setSelectedGameMode] = useState<'br' | 'cs'>('br');

    const playerRef = useRef(player);
    playerRef.current = player;

    const initializePlayer = useCallback(async () => {
        if (!user) return;
        const playerDbRef = database.ref(`users/${user.uid}`);
        playerDbRef.on('value', async (snapshot) => {
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
                    ownedCharacters: dbData.ownedCharacters || [...INITIAL_PLAYER_STATE.ownedCharacters],
                    avatar: dbData.avatar || AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
                    ownedPets: dbData.ownedPets || [],
                    equippedPet: dbData.equippedPet || null,
                };
        
                if (!player) { // Only run this logic on initial load
                    const todayISO = new Date().toISOString();
                    const today = todayISO.split('T')[0];
                    const daysDiff = daysBetween(playerData.lastLogin, today);
            
                    if (daysDiff > 0) {
                        let updates: Partial<Player> = { lastLogin: today, dailyRewardClaimed: false };
                        if (daysDiff > 1) { updates.loginStreak = 0; }
                        if (!dbData.avatar) { updates.avatar = playerData.avatar; }
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
                }
                setPlayer(playerData);

            } else {
                const newPlayer: Player = {
                    ...INITIAL_PLAYER_STATE,
                    uid: user.uid,
                    username: user.displayName || user.email?.split('@')[0] || 'Player',
                    email: user.email || '',
                    avatar: AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
                };
                await playerDbRef.set(newPlayer);
                setPlayer(newPlayer);
                setShowDailyReward(true);
            }
            setLoading(false);
        });

        return () => playerDbRef.off();
    }, [user, player]);

    useEffect(() => {
        const unsubscribe = initializePlayer();
        const systemRef = database.ref('system');
        systemRef.on('value', snapshot => setSystem(snapshot.val()));
        return () => {
            unsubscribe.then(off => off && off());
            systemRef.off();
        }
    }, [initializePlayer]);

    useEffect(() => {
        if (player?.clanId) {
            const clanRef = database.ref(`clans/${player.clanId}`);
            clanRef.on('value', (snapshot) => {
                setPlayerClan(snapshot.val());
            });
            return () => clanRef.off();
        } else {
            setPlayerClan(null);
        }
    }, [player?.clanId]);

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

    const handleBuyCharacter = (character: Character) => {
         setPlayer(p => {
            if (!p || (p.gold < character.cost.gold && p.diamonds < character.cost.diamonds)) return p;
            
            const costInGold = character.cost.gold > 0;

            return {
                ...p,
                gold: costInGold ? p.gold - character.cost.gold : p.gold,
                diamonds: !costInGold ? p.diamonds - character.cost.diamonds : p.diamonds,
                ownedCharacters: [...p.ownedCharacters, character.id]
            };
        });
    }
    
    const handlePlay = (mode: 'br' | 'cs') => {
        setSelectedGameMode(mode);
        setShowChallengeScreen(true);
    };

    const renderView = () => {
        if (showChallengeScreen) {
             return <ChallengeScreen 
                player={player!} 
                gameMode={selectedGameMode}
                onBack={() => setShowChallengeScreen(false)} 
                onBalanceUpdate={(newGold) => setPlayer(p => p ? {...p, gold: newGold} : null)} 
                onRankUpdate={handleRankUpdate} 
                setPlayer={setPlayer}
            />;
        }
        switch(activeView) {
            case 'character':
                return <HeroStore player={player!} onBuyHero={handleBuyCharacter} />;
            case 'leaderboard':
                return <LeaderboardModal onBack={() => setActiveView('home')} />;
            case 'luck_royale':
                return <LuckRoyale player={player!} setPlayer={setPlayer} />;
            case 'pet':
                return <PetStore player={player!} setPlayer={setPlayer} />;
            case 'clan':
                return <ClanScreen player={player!} setPlayer={setPlayer} />;
            case 'events':
                return <EventsScreen />;
            case 'home':
            default:
                return <HomeScreen player={player!} onPlay={handlePlay} />;
        }
    };

    if (loading || !player) {
        return <div className="flex items-center justify-center h-screen"><span className="text-2xl">Entering the Battlegrounds...</span></div>;
    }

    return (
        <div 
            className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-cover bg-center" 
            style={{backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/gen-z-airdrop.appspot.com/o/backgrounds%2Ffreefire_bg.jpg?alt=media&token=c15a7b67-41a9-4566-993d-4c803a647657')`}}
        >
             <div className="absolute inset-0 bg-black/50"></div>
             {showDailyReward && !player.dailyRewardClaimed && <DailyRewardModal loginStreak={player.loginStreak} onClaim={handleClaimDailyReward} onClose={() => setShowDailyReward(false)} />}
             {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
             {showTopUpModal && <TopUpModal player={player} setPlayer={setPlayer} onClose={() => setShowTopUpModal(false)} />}

             <EventAnnouncer system={system} />

             <header className="absolute top-0 left-0 right-0 w-full flex justify-between items-center bg-black bg-opacity-30 p-2 sm:p-3 z-20">
                 <div className="flex items-center space-x-2">
                    <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-orange-400 bg-gray-800 flex items-center justify-center text-3xl">
                            {player.avatar}
                        </div>
                        {player.equippedPet && PETS[player.equippedPet] && (
                            <div className="absolute -bottom-2 -right-2 text-2xl bg-gray-700 rounded-full p-0.5 border-2 border-green-400">
                                {PETS[player.equippedPet].emoji}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-white text-sm sm:text-lg font-bold">{playerClan ? `[${playerClan.tag}] ` : ''}{player.username}</p>
                        <p className="text-orange-300 text-xs sm:text-sm">{player.rank} {player.rankPoints} RP</p>
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