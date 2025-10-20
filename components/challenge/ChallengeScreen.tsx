import React, { useState, useEffect, useCallback, useRef } from 'react';
import { database } from '../../services/firebase';
import { Player, ChallengeMatch, ChallengeQueueEntry, Rank } from '../../types';
import ChallengeLobby from './ChallengeLobby';
import ChallengeMatchView from './ChallengeMatch';
import ChallengeHistory from './ChallengeHistory';
import { Spinner } from '../ui/Spinner';
import { RANKS } from '../../gameConfig';

interface ChallengeScreenProps {
    player: Player;
    onBack: () => void;
    onBalanceUpdate: (newGold: number) => void;
    onRankUpdate: (newRank: Rank, newRankPoints: number) => void;
}

type ChallengeStatus = 'idle' | 'searching' | 'in_match' | 'history';

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ player, onBack, onBalanceUpdate, onRankUpdate }) => {
    const [status, setStatus] = useState<ChallengeStatus>('idle');
    const [match, setMatch] = useState<ChallengeMatch | null>(null);
    const [searchingRank, setSearchingRank] = useState<Rank | null>(null);
    
    const queueRef = useRef<any>(null);

    const cleanup = useCallback(() => {
        setStatus('idle');
        setMatch(null);
        setSearchingRank(null);
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

    const handleFindMatch = async () => {
        setStatus('searching');
        setSearchingRank(player.rank);
    
        const queuePath = `challenges/queue/${player.rank}`;
        const queueRefForTransaction = database.ref(queuePath);
    
        const { committed, snapshot } = await queueRefForTransaction.transaction((queueData) => {
            // If the queue is empty or doesn't exist, create it and add the player.
            if (queueData === null) {
                const newEntryKey = database.ref(queuePath).push().key;
                return { [newEntryKey!]: { uid: player.uid, username: player.username, rank: player.rank, timestamp: Date.now() } };
            }
    
            // Find an opponent in the queue that is not the current player.
            const opponentKey = Object.keys(queueData).find(key => queueData[key].uid !== player.uid);
    
            if (opponentKey) {
                // Found an opponent. Remove them from the queue and attach their data to the transaction result.
                const opponentEntry = queueData[opponentKey];
                delete queueData[opponentKey];
                // Use a special key to pass the opponent data out of the transaction.
                (queueData as any).__opponentFound = opponentEntry; 
                return queueData;
            } else {
                // No suitable opponent found. Add the current player to the queue.
                const newEntryKey = database.ref(queuePath).push().key;
                queueData[newEntryKey!] = { uid: player.uid, username: player.username, rank: player.rank, timestamp: Date.now() };
                return queueData;
            }
        });
    
        if (committed) {
            const finalQueueState = snapshot.val();
            const opponentEntry = finalQueueState?.__opponentFound;
    
            if (opponentEntry) {
                // An opponent was found and removed from the queue. Create the match.
                const rankConfig = RANKS[player.rank];
                const [minStake, maxStake] = rankConfig.stakeRange;
                const goldAtStake = Math.floor(Math.random() * (maxStake - minStake + 1)) + minStake;
    
                const matchId = database.ref('challenges/matches').push().key;
                if (!matchId) return;
    
                const newMatch: ChallengeMatch = {
                    matchId,
                    goldAtStake,
                    status: 'countdown',
                    startTime: Date.now() + 3000,
                    player1: { uid: opponentEntry.uid, username: opponentEntry.username, score: 0 },
                    player2: { uid: player.uid, username: player.username, score: 0 },
                };
    
                await database.ref(`challenges/matches/${matchId}`).set(newMatch);
                await database.ref(`users/${opponentEntry.uid}/activeMatch`).set(matchId);
                await database.ref(`users/${player.uid}/activeMatch`).set(matchId);
            } else {
                // Player was added to the queue. Find our entry to be able to cancel it.
                 const myQueueEntry = Object.entries(finalQueueState || {}).find(([, entry]) => (entry as ChallengeQueueEntry).uid === player.uid);
                 if(myQueueEntry){
                     queueRef.current = database.ref(`${queuePath}/${myQueueEntry[0]}`);
                 }
            }
        }
    };

    const handleCancelSearch = () => {
        if(queueRef.current) {
            queueRef.current.remove();
        }
        setStatus('idle');
        setSearchingRank(null);
    };

    if (status === 'in_match' && match) {
        return <ChallengeMatchView player={player} match={match} onBalanceUpdate={onBalanceUpdate} onRankUpdate={onRankUpdate} onFinish={cleanup} />;
    }
    
    if (status === 'history') {
        return <ChallengeHistory playerUid={player.uid} onBack={() => setStatus('idle')} />;
    }

    if (status === 'searching') {
        return (
            <div className="w-full max-w-3xl h-full flex flex-col items-center justify-center bg-black bg-opacity-60 p-4 rounded-xl border-2 border-yellow-600 relative">
                <Spinner />
                <p className="text-yellow-300 text-2xl mt-4">Searching for opponent...</p>
                <p className="text-gray-400 mt-2">Rank: {searchingRank}</p>
                <button onClick={handleCancelSearch} className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
                    Cancel
                </button>
            </div>
        );
    }
    
    return <ChallengeLobby player={player} onFindMatch={handleFindMatch} onShowHistory={() => setStatus('history')} onBack={onBack} />;
};

export default ChallengeScreen;