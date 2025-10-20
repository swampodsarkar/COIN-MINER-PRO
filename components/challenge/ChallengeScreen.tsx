// FIX: Added component implementation to manage challenge views.
import React, { useState } from 'react';
import { Player, Rank, MatchHistory } from '../../types';
import ChallengeLobby from './ChallengeLobby';
import ChallengeMatch from './ChallengeMatch';
import ChallengeHistory from './ChallengeHistory';
import { database } from '../../services/firebase';
import { Spinner } from '../ui/Spinner';

interface ChallengeScreenProps {
    player: Player;
    onBack: () => void;
    onBalanceUpdate: (newGold: number) => void;
    onRankUpdate: (newRank: Rank, newRankPoints: number) => void;
}

type ChallengeView = 'lobby' | 'finding_match' | 'in_match' | 'history';

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ player, onBack, onBalanceUpdate, onRankUpdate }) => {
    const [view, setView] = useState<ChallengeView>('lobby');
    const [matchResult, setMatchResult] = useState<'win' | 'loss' | null>(null);

    const handleFindMatch = () => {
        setView('finding_match');
        // Simulate finding a match
        setTimeout(() => {
            // Simulate a random match result
            const result = Math.random() > 0.5 ? 'win' : 'loss';
            setMatchResult(result);
            setView('in_match');
        }, 3000);
    };

    const handleMatchEnd = (result: 'win' | 'loss', goldChange: number, rankPointsChange: number) => {
        const newGold = player.gold + goldChange;
        onBalanceUpdate(newGold);
        
        const newRankPoints = Math.max(0, player.rankPoints + rankPointsChange);
        // This logic should be more robust, but for a mock, it's fine
        onRankUpdate(player.rank, newRankPoints);

        // Save match history
        const matchHistoryRef = database.ref(`users/${player.uid}/matchHistory`).push();
        const newMatch: Omit<MatchHistory, 'id'> = {
            opponentName: "Bot Player",
            result,
            rankPointsChange,
            timestamp: Date.now(),
        };
        matchHistoryRef.set(newMatch);

        // Reset for next match
        setTimeout(() => {
            setMatchResult(null);
            setView('lobby');
        }, 4000); // show result screen for 4s
    };

    const renderContent = () => {
        switch (view) {
            case 'finding_match':
                return (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <Spinner />
                        <h2 className="text-2xl text-yellow-300 mt-4 animate-pulse">Finding Opponent...</h2>
                    </div>
                );
            case 'in_match':
                return <ChallengeMatch player={player} opponent={null} result={matchResult!} onMatchEnd={handleMatchEnd} />;
            case 'history':
                return <ChallengeHistory playerId={player.uid} onBack={() => setView('lobby')} />;
            case 'lobby':
            default:
                return <ChallengeLobby player={player} onFindMatch={handleFindMatch} onShowHistory={() => setView('history')} onBack={onBack} />;
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
            {renderContent()}
        </div>
    );
};

export default ChallengeScreen;
