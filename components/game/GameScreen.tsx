
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../services/firebase';
import { Player, Division } from '../../types';
import { INITIAL_PLAYER_STATE, TEAM_LOGOS } from '../../constants';
import MatchmakingScreen from '../challenge/ChallengeScreen';
import ShopScreen from './HeroStore';
import MyTeamScreen from './LuckRoyale';
import GamePlanScreen from './PetStore';
import DivisionRankingsModal from './ClanScreen';
import SettingsModal from './SettingsModal';
import MatchSelectionScreen from './HomeScreen';
import BottomNavBar from './BottomNavBar';
import { DIVISIONS } from '../../gameConfig';

export type GameView = 'match' | 'plan' | 'team' | 'shop' | 'extras';

const GameScreen: React.FC = () => {
    const { user } = useAuth();
    const [player, setPlayer] = useState<Player | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<GameView>('match');
    const [showSettings, setShowSettings] = useState(false);
    const [showMatchmaking, setShowMatchmaking] = useState(false);
    const [selectedGameMode, setSelectedGameMode] = useState<'division' | 'ai'>('division');

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
                    avatar: dbData.avatar || TEAM_LOGOS[Math.floor(Math.random() * TEAM_LOGOS.length)],
                };
                setPlayer(playerData);
            } else {
                const newPlayer: Player = {
                    ...INITIAL_PLAYER_STATE,
                    uid: user.uid,
                    username: user.displayName || user.email?.split('@')[0] || 'Manager',
                    email: user.email || '',
                    avatar: TEAM_LOGOS[Math.floor(Math.random() * TEAM_LOGOS.length)],
                };
                await playerDbRef.set(newPlayer);
                setPlayer(newPlayer);
            }
            setLoading(false);
        });

        return () => playerDbRef.off();
    }, [user]);

    useEffect(() => {
        const unsubscribePromise = initializePlayer();
        return () => {
            unsubscribePromise.then(off => off && off());
        }
    }, [initializePlayer]);

    const saveData = useCallback(() => {
        if (playerRef.current && user) {
            database.ref(`users/${user.uid}`).set(playerRef.current);
            database.ref(`leaderboard/${user.uid}`).set({
                username: playerRef.current.username,
                divisionPoints: playerRef.current.divisionPoints,
                division: playerRef.current.division,
            });
        }
    }, [user]);

    useEffect(() => {
        const saveInterval = setInterval(saveData, 20000);
        window.addEventListener('beforeunload', saveData);
        return () => {
            clearInterval(saveInterval);
            window.removeEventListener('beforeunload', saveData);
            saveData();
        };
    }, [saveData]);

    const handleRankUpdate = (newDivision: Division, newDivisionPoints: number) => {
        setPlayer(p => p ? {...p, division: newDivision, divisionPoints: newDivisionPoints } : null);
    };
    
    const handlePlay = (mode: 'division' | 'ai') => {
        setSelectedGameMode(mode);
        setShowMatchmaking(true);
    };

    const renderView = () => {
        if (showMatchmaking) {
             return <MatchmakingScreen 
                player={player!} 
                gameMode={selectedGameMode}
                onBack={() => setShowMatchmaking(false)} 
                onRankUpdate={handleRankUpdate} 
                setPlayer={setPlayer}
            />;
        }
        switch(activeView) {
            case 'plan':
                return <GamePlanScreen player={player!} setPlayer={setPlayer} />;
            case 'team':
                return <MyTeamScreen player={player!} />;
            case 'shop':
                return <ShopScreen player={player!} setPlayer={setPlayer} />;
            case 'extras':
                return <DivisionRankingsModal />;
            case 'match':
            default:
                return <MatchSelectionScreen player={player!} onPlay={handlePlay} />;
        }
    };

    if (loading || !player) {
        return <div className="flex items-center justify-center h-screen"><span className="text-2xl">Loading Pitch...</span></div>;
    }
    
    const divisionConfig = DIVISIONS[player.division];

    return (
        <div 
            className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-cover bg-center" 
            style={{backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/gen-z-airdrop.appspot.com/o/backgrounds%2Fstadium_bg.jpg?alt=media&token=e82a3c7c-c9f2-4384-90a6-163e7587747e')`}}
        >
             <div className="absolute inset-0 bg-black/60"></div>
             {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

             <header className="absolute top-0 left-0 right-0 w-full flex justify-between items-center bg-black bg-opacity-40 p-2 sm:p-3 z-20">
                 <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cyan-400 bg-gray-800 flex items-center justify-center text-3xl">
                        {player.avatar}
                    </div>
                    <div>
                        <p className="text-white text-sm sm:text-lg font-bold">{player.username}</p>
                        <p className="text-xs sm:text-sm" style={{color: divisionConfig.color}}>{player.division} ({player.divisionPoints} pts)</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-2 sm:space-x-4">
                     <div className="flex items-center bg-gray-800/70 px-2 py-1 sm:px-3 rounded-full border border-yellow-800">
                         <span className="text-lg sm:text-xl mr-1 sm:mr-2">GP</span>
                         <span className="text-yellow-400 font-bold text-sm sm:text-base">{Math.floor(player.gp).toLocaleString()}</span>
                     </div>
                     <div className="flex items-center bg-gray-800/70 px-2 py-1 sm:px-3 rounded-full border border-purple-800">
                         <span className="text-lg sm:text-xl mr-1 sm:mr-2">©</span>
                         <span className="text-purple-400 font-bold text-sm sm:text-base">{player.coins.toLocaleString()}</span>
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
