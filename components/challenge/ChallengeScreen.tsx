
import React, { useState } from 'react';
import { Player, Rank, MatchHistory } from '../../types';
import ChallengeMatch from './ChallengeMatch';
import ChallengeHistory from './ChallengeHistory';
import { database } from '../../services/firebase';
import { Spinner } from '../ui/Spinner';
import { RANKS } from '../../gameConfig';
import ClashSquadMatch from './ClashSquadMatch';

interface ChallengeScreenProps {
    player: Player;
    gameMode: 'br' | 'cs';
    onBack: () => void;
    onBalanceUpdate: (newGold: number) => void;
    onRankUpdate: (newRank: Rank, newRankPoints: number) => void;
    setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
}

type ChallengeView = 'finding_match' | 'in_match' | 'history';

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ player, gameMode, onBack, onBalanceUpdate, onRankUpdate, setPlayer }) => {
    const [view, setView] = useState<ChallengeView>('finding_match');

    // Simulate finding a match
    useState(() => {
        const timer = setTimeout(() => {
            setView('in_match');
        }, 3000);
        return () => clearTimeout(timer);
    });

    const handleMatchEnd = (result: 'VICTORY' | 'DEFEAT', goldChange: number, rankPointsChange: number, playerCharacterId: string, placement: number, kills: number) => {
        
        setPlayer(p => {
            if (!p) return null;

            const newGold = p.gold + goldChange;
            const newRankPoints = Math.max(0, p.rankPoints + rankPointsChange);
            
            // Check for rank up/down
            let currentRank = p.rank;
            const rankConfig = RANKS[currentRank];
            if (rankConfig.pointsToAdvance !== null && newRankPoints >= rankConfig.pointsToAdvance) {
                const rankKeys = Object.keys(RANKS) as Rank[];
                const currentRankIndex = rankKeys.indexOf(currentRank);
                if (currentRankIndex < rankKeys.length - 1) {
                    currentRank = rankKeys[currentRankIndex + 1];
                }
            }
            onRankUpdate(currentRank, newRankPoints);

            // Save match history
            const matchHistoryRef = database.ref(`users/${p.uid}/matchHistory`).push();
            const newMatch: Omit<MatchHistory, 'id'> = {
                placement,
                kills,
                result,
                rankPointsChange,
                timestamp: Date.now(),
                playerCharacterId,
                mode: gameMode,
            };
            matchHistoryRef.set(newMatch);

            return {
                ...p,
                gold: newGold,
                rank: currentRank,
                rankPoints: newRankPoints
            };
        });
        
        // Go back to lobby after showing result
        setTimeout(() => {
            onBack();
        }, 4000); // show result screen for 4s
    };

    const renderContent = () => {
        switch (view) {
            case 'in_match':
                if (gameMode === 'cs') {
                    return <ClashSquadMatch player={player} onMatchEnd={handleMatchEnd} />;
                }
                return <ChallengeMatch player={player} onMatchEnd={handleMatchEnd} />;
            case 'history':
                return <ChallengeHistory playerId={player.uid} onBack={onBack} />;
            case 'finding_match':
            default:
                 return (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <Spinner />
                        <h2 className="text-2xl text-orange-300 mt-4 animate-pulse">
                             {gameMode === 'cs' ? 'Assembling Teams...' : 'Entering Battleground...'}
                        </h2>
                        <button onClick={onBack} className="mt-8 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg">Cancel</button>
                    </div>
                );
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in bg-black/70">
            {renderContent()}
        </div>
    );
};

export default ChallengeScreen;