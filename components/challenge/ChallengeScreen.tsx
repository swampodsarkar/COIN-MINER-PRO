import React, { useState, useEffect, useCallback, useRef } from 'react';
import { database } from '../../services/firebase';
import { Player, ChallengeMatch, ChallengeQueueEntry } from '../../types';
import ChallengeLobby from './ChallengeLobby';
import ChallengeMatchView from './ChallengeMatch';
import ChallengeHistory from './ChallengeHistory';
import { Spinner } from '../ui/Spinner';

interface ChallengeScreenProps {
    player: Player;
    onBack: () => void;
    onBalanceUpdate: (newGold: number) => void;
}

type ChallengeStatus = 'idle' | 'searching' | 'in_match' | 'history';

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ player, onBack, onBalanceUpdate }) => {
    const [status, setStatus] = useState<ChallengeStatus>('idle');
    const [match, setMatch] = useState<ChallengeMatch | null>(null);
    const [searchBetAmount, setSearchBetAmount] = useState<number | null>(null);
    
    const queueRef = useRef<any>(null);

    const cleanup = useCallback(() => {
        setStatus('idle');
        setMatch(null);
        setSearchBetAmount(null);
        if (queueRef.current) {
            queueRef.current.remove();
            queueRef.current = null;
        }
        database.ref(`users/${player.uid}/activeMatch`).remove();
    }, [player.uid]);

    useEffect(() => {
        // Listen for active match invitations
        const activeMatchRef = database.ref(`users/${player.uid}/activeMatch`);
        activeMatchRef.on('value', (snapshot) => {
            const matchId = snapshot.val();
            if (matchId) {
                setStatus('in_match');
                const matchRef = database.ref(`challenges/matches/${matchId}`);
                matchRef.on('value', (matchSnapshot) => {
                    if(matchSnapshot.exists()) {
                        setMatch(matchSnapshot.val());
                    } else {
                        // Match was cancelled or finished
                        cleanup();
                    }
                });
            }
        });

        return () => {
            activeMatchRef.off();
            if (match?.matchId) {
                database.ref(`challenges/matches/${match.matchId}`).off();
            }
        };
    }, [player.uid, match?.matchId, cleanup]);

    const handleFindMatch = async (betAmount: number) => {
        if (player.gold < betAmount) {
            alert("Not enough gold!");
            return;
        }
        setStatus('searching');
        setSearchBetAmount(betAmount);

        const queuePath = `challenges/queue/${betAmount}`;
        const opponentQuery = database.ref(queuePath).orderByChild('timestamp').limitToFirst(1);
        const snapshot = await opponentQuery.once('value');

        if (snapshot.exists()) {
            const queueData = snapshot.val();
            const challengeId = Object.keys(queueData)[0];
            const opponentEntry: ChallengeQueueEntry = queueData[challengeId];

            if (opponentEntry.uid === player.uid) { // Found our own entry, something is wrong
                setStatus('idle');
                return;
            }
            
            // Found an opponent, create the match
            await database.ref(`${queuePath}/${challengeId}`).remove();
            
            const matchId = database.ref('challenges/matches').push().key;
            if(!matchId) return;

            const newMatch: ChallengeMatch = {
                matchId,
                betAmount,
                status: 'countdown',
                startTime: Date.now() + 3000,
                player1: { uid: opponentEntry.uid, username: opponentEntry.username, score: 0 },
                player2: { uid: player.uid, username: player.username, score: 0 },
            };

            await database.ref(`challenges/matches/${matchId}`).set(newMatch);
            // Invite opponent and self to match
            await database.ref(`users/${opponentEntry.uid}/activeMatch`).set(matchId);
            await database.ref(`users/${player.uid}/activeMatch`).set(matchId);

        } else {
            // No opponent found, create a queue entry
            queueRef.current = database.ref(`${queuePath}`).push();
            const newQueueEntry: ChallengeQueueEntry = {
                uid: player.uid,
                username: player.username,
                betAmount: betAmount,
                timestamp: Date.now(),
            };
            await queueRef.current.set(newQueueEntry);
        }
    };

    const handleCancelSearch = () => {
        if(queueRef.current) {
            queueRef.current.remove();
        }
        setStatus('idle');
        setSearchBetAmount(null);
    };

    if (status === 'in_match' && match) {
        return <ChallengeMatchView player={player} match={match} onBalanceUpdate={onBalanceUpdate} onFinish={cleanup} />;
    }
    
    if (status === 'history') {
        return <ChallengeHistory playerUid={player.uid} onBack={() => setStatus('idle')} />;
    }

    if (status === 'searching') {
        return (
            <div className="w-full max-w-3xl h-full flex flex-col items-center justify-center bg-black bg-opacity-60 p-4 rounded-xl border-2 border-yellow-600 relative">
                <Spinner />
                <p className="text-yellow-300 text-2xl mt-4">Searching for opponent...</p>
                <p className="text-gray-400 mt-2">Betting {searchBetAmount} 💰</p>
                <button onClick={handleCancelSearch} className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
                    Cancel
                </button>
            </div>
        );
    }
    
    return <ChallengeLobby player={player} onFindMatch={handleFindMatch} onShowHistory={() => setStatus('history')} onBack={onBack} />;
};

export default ChallengeScreen;