import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../services/firebase';
import { Player, SystemData } from '../../types';
import { INITIAL_PLAYER_STATE } from '../../constants';
import Miner from './Miner';
import LeaderboardView from './LeaderboardModal';
import DailyRewardModal from './DailyRewardModal';
import EventAnnouncer from './EventAnnouncer';
import ChallengeScreen from '../challenge/ChallengeScreen';
import { auth } from '../../services/firebase';
import Store from './Store';
import LuckRoyale from './LuckRoyale';
import AutoMinerPanel from './AutoMinerPanel';
import { AXES, LUCK_ROYALE_COST, LUCK_ROYALE_GUARANTEED_SPINS, LUCK_ROYALE_REWARDS, Axe, AUTO_MINER_CONFIG } from '../../gameConfig';

type GameView = 'mine' | 'store' | 'luckRoyale' | 'leaderboard' | 'challenge';

const daysBetween = (dateStr1: string, dateStr2: string): number => {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    // Discard time and time-zone information.
    const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
    const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

const GameScreen: React.FC = () => {
    const { user } = useAuth();
    const [player, setPlayer] = useState<Player | null>(null);
    const [system, setSystem] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<GameView>('mine');
    const [showDailyReward, setShowDailyReward] = useState(false);
    const [pulseGold, setPulseGold] = useState(false);
    const [pulseGems, setPulseGems] = useState(false);
    const [spinResult, setSpinResult] = useState<{ message: string } | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const playerRef = useRef(player);
    playerRef.current = player;
    
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (player?.gold !== playerRef.current?.gold) {
                setPulseGold(true);
                const timer = setTimeout(() => setPulseGold(false), 400);
                return () => clearTimeout(timer);
            }
        }
    }, [player?.gold]);

    useEffect(() => {
        if (!isInitialMount.current) {
            if (player?.gems !== playerRef.current?.gems) {
                setPulseGems(true);
                const timer = setTimeout(() => setPulseGems(false), 400);
                return () => clearTimeout(timer);
            }
        }
    }, [player?.gems]);


    const initializePlayer = useCallback(async () => {
        if (!user) return;
        const playerDbRef = database.ref(`users/${user.uid}`);
        const snapshot = await playerDbRef.get();
        if (snapshot.exists()) {
            let playerData: Player = snapshot.val();
            const today = new Date().toISOString().split('T')[0];
            
            // Migration for older players
            if (!playerData.equipment) {
                playerData = {
                    ...playerData,
                    ...INITIAL_PLAYER_STATE,
                    gold: playerData.gold,
                    gems: playerData.gems,
                }
            }
            if (playerData.autoMinerLevel === undefined) {
                playerData.autoMinerLevel = 0;
            }


            if (playerData.lastLogin !== today) {
                const dayDifference = daysBetween(playerData.lastLogin, today);
                
                if (dayDifference === 1) {
                    playerData.loginStreak = (playerData.loginStreak || 1) + 1;
                } else if (dayDifference > 1) {
                    playerData.loginStreak = 1;
                }
                
                playerData.lastLogin = today;
                playerData.dailyRewardClaimed = false;
                setShowDailyReward(true);
            }

            if (!playerData.loginStreak) {
                playerData.loginStreak = 1;
            }

            setPlayer(playerData);
        } else {
            const newPlayer: Player = {
                ...INITIAL_PLAYER_STATE,
                uid: user.uid,
                username: user.displayName || user.email?.split('@')[0] || 'Miner',
                email: user.email || '',
                lastLogin: new Date().toISOString().split('T')[0],
                dailyRewardClaimed: true,
                loginStreak: 1,
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

    // Passive Gold Generation
    useEffect(() => {
        if (!player || player.autoMinerLevel <= 0) {
            return;
        }
    
        const goldPerSecond = player.autoMinerLevel * AUTO_MINER_CONFIG.baseGoldPerSecond;
    
        const interval = setInterval(() => {
            setPlayer(p => {
                if (!p) return null;
                return { ...p, gold: p.gold + goldPerSecond };
            });
        }, 1000);
    
        return () => clearInterval(interval);
    }, [player?.autoMinerLevel]);

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
    

    const handleMine = (amount: number) => {
        setPlayer(p => p ? { ...p, gold: p.gold + amount } : null);
    };

    const handleUpgradeAutoMiner = () => {
        setPlayer(p => {
            if (!p) return null;
            const cost = AUTO_MINER_CONFIG.baseCost * Math.pow(AUTO_MINER_CONFIG.costMultiplier, p.autoMinerLevel);
            if (p.gold >= cost) {
                return {
                    ...p,
                    gold: p.gold - cost,
                    autoMinerLevel: p.autoMinerLevel + 1,
                };
            }
            return p;
        });
    };

    const handleBuyAxe = (axe: Axe & { id: string }, cost: number, currency: 'gold' | 'gems') => {
        setPlayer(p => {
            if (!p) return null;
            if (currency === 'gold' && p.gold < cost) return p;
            if (currency === 'gems' && p.gems < cost) return p;
    
            return {
                ...p,
                gold: currency === 'gold' ? p.gold - cost : p.gold,
                gems: currency === 'gems' ? p.gems - cost : p.gems,
                inventory: {
                    ...p.inventory,
                    axes: [...p.inventory.axes, axe.id],
                }
            };
        });
    };
    
    const handleEquipAxe = (axeId: string) => {
        setPlayer(p => p ? { ...p, equipment: { ...p.equipment, equippedAxe: axeId } } : null);
    };

    const handleSpin = () => {
        if(!player || player.gold < LUCK_ROYALE_COST || isSpinning) return;
    
        setIsSpinning(true);
        
        const newGold = player.gold - LUCK_ROYALE_COST;
        const newSpinCount = (player.luckRoyaleSpins || 0) + 1;
        
        setPlayer(p => p ? { ...p, gold: newGold, luckRoyaleSpins: newSpinCount } : null);
    
        setTimeout(() => {
            setPlayer(p => {
                if(!p) return null;
    
                let finalPlayerState = {...p};
                let resultMessage = "";
    
                if (newSpinCount >= LUCK_ROYALE_GUARANTEED_SPINS) {
                    const rareAxes = Object.entries(AXES).filter(([, axe]) => axe.type === 'rare').map(([id]) => id);
                    const unownedRareAxes = rareAxes.filter(id => !p.inventory.axes.includes(id));
                    const prizeId = unownedRareAxes.length > 0 ? unownedRareAxes[Math.floor(Math.random() * unownedRareAxes.length)] : rareAxes[0];
                    
                    finalPlayerState.inventory.axes.push(prizeId);
                    finalPlayerState.luckRoyaleSpins = 0;
                    resultMessage = `Guaranteed Prize! You won a ${AXES[prizeId].name}! ${AXES[prizeId].emoji}`;
                } else {
                    const totalWeight = LUCK_ROYALE_REWARDS.reduce((sum, r) => sum + r.weight, 0);
                    let random = Math.random() * totalWeight;
                    let chosenReward = LUCK_ROYALE_REWARDS[LUCK_ROYALE_REWARDS.length - 1];
    
                    for(const reward of LUCK_ROYALE_REWARDS) {
                        if(random < reward.weight) {
                            chosenReward = reward;
                            break;
                        }
                        random -= reward.weight;
                    }
    
                    switch(chosenReward.type) {
                        case 'gold':
                            finalPlayerState.gold += chosenReward.value as number;
                            break;
                        case 'gems':
                            finalPlayerState.gems += chosenReward.value as number;
                            break;
                        case 'axe':
                            const axeId = chosenReward.value as string;
                            if(!p.inventory.axes.includes(axeId)) {
                                finalPlayerState.inventory.axes.push(axeId);
                            } else {
                                finalPlayerState.gold += 25;
                                chosenReward = { ...chosenReward, message: () => `You already own that! Here's 25 Gold instead. 💰` };
                            }
                            break;
                    }
                    resultMessage = chosenReward.message(chosenReward.value);
                }
                setSpinResult({ message: resultMessage });
                return finalPlayerState;
            });
            setIsSpinning(false);
        }, 2000);
    };
    
    const handleClaimDailyReward = (gems: number) => {
        setPlayer(p => p ? { ...p, gems: p.gems + gems, dailyRewardClaimed: true } : null);
        setShowDailyReward(false);
    };

    const renderView = () => {
        switch(activeView) {
            case 'store':
                return <Store player={player!} onBuyAxe={handleBuyAxe} onEquipAxe={handleEquipAxe} onBack={() => setActiveView('mine')}/>;
            case 'luckRoyale':
                return <LuckRoyale player={player!} onSpin={handleSpin} onBack={() => setActiveView('mine')} spinResult={spinResult} clearSpinResult={() => setSpinResult(null)} isSpinning={isSpinning} />;
            case 'leaderboard':
                return <LeaderboardView onBack={() => setActiveView('mine')} />;
            case 'challenge':
                return <ChallengeScreen player={player!} onBack={() => setActiveView('mine')} onBalanceUpdate={(newGold) => setPlayer(p => p ? {...p, gold: newGold} : null)} />;
            case 'mine':
            default:
                const effectiveMiningPower = AXES[player!.equipment.equippedAxe]?.power || 1;
                const autoMinerLevel = player!.autoMinerLevel || 0;
                const autoMinerUpgradeCost = AUTO_MINER_CONFIG.baseCost * Math.pow(AUTO_MINER_CONFIG.costMultiplier, autoMinerLevel);
                const goldPerSecond = autoMinerLevel * AUTO_MINER_CONFIG.baseGoldPerSecond;
                return (
                    <>
                        <Miner player={player!} onMine={handleMine} system={system} effectiveMiningPower={effectiveMiningPower}/>
                        <AutoMinerPanel 
                            level={autoMinerLevel}
                            goldPerSecond={goldPerSecond}
                            upgradeCost={autoMinerUpgradeCost}
                            playerGold={player!.gold}
                            onUpgrade={handleUpgradeAutoMiner}
                        />
                        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 mt-4">
                             <button 
                                onClick={() => setActiveView('store')}
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 sm:py-3 sm:px-6 rounded-lg border-b-4 border-yellow-700 shadow-lg transition-transform active:scale-95 text-sm sm:text-lg transform hover:-translate-y-1 hover:brightness-110"
                            >
                                Store 🏪
                            </button>
                             <button 
                                onClick={() => setActiveView('luckRoyale')}
                                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-3 sm:py-3 sm:px-6 rounded-lg border-b-4 border-purple-700 shadow-lg transition-transform active:scale-95 text-sm sm:text-lg transform hover:-translate-y-1 hover:brightness-110"
                            >
                                Luck Royale ✨
                            </button>
                            <button 
                                onClick={() => setActiveView('leaderboard')}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 sm:py-3 sm:px-6 rounded-lg border-b-4 border-blue-700 shadow-lg transition-transform active:scale-95 text-sm sm:text-lg transform hover:-translate-y-1 hover:brightness-110"
                            >
                                Leaders 🏆
                            </button>
                             <button 
                                onClick={() => setActiveView('challenge')}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 sm:py-3 sm:px-6 rounded-lg border-b-4 border-red-700 shadow-lg transition-transform active:scale-95 text-sm sm:text-lg transform hover:-translate-y-1 hover:brightness-110"
                            >
                                Challenge ⚔️
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
            {showDailyReward && !player.dailyRewardClaimed && <DailyRewardModal onClaim={handleClaimDailyReward} loginStreak={player.loginStreak} />}

            <EventAnnouncer system={system} />

            <header className="w-full max-w-5xl flex justify-between items-center bg-black bg-opacity-50 p-2 sm:p-4 rounded-b-xl border-b-2 border-l-2 border-r-2 border-yellow-600">
                <div className="flex items-center space-x-2 sm:space-x-4 text-sm sm:text-lg">
                    <div className={`flex items-center bg-gray-800/70 px-2 py-1 sm:px-3 rounded-full border border-yellow-800 ${pulseGold ? 'animate-pulse-update' : ''}`}>
                        <span className="text-2xl sm:text-3xl mr-2">💰</span>
                        <span className="text-yellow-400 font-bold">{Math.floor(player.gold).toLocaleString()}</span>
                    </div>
                    <div className={`flex items-center bg-gray-800/70 px-2 py-1 sm:px-3 rounded-full border border-blue-800 ${pulseGems ? 'animate-pulse-update' : ''}`}>
                         <span className="text-2xl sm:text-3xl mr-2">💎</span>
                        <span className="text-blue-400 font-bold">{player.gems.toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex items-center">
                    <p className="text-yellow-300 mr-4 hidden sm:block">{player.username}</p>
                    <button onClick={() => auth.signOut()} className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm py-2 px-3 rounded-lg border-2 border-red-800 transform hover:-translate-y-0.5">Logout</button>
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