import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { database } from '../../services/firebase';
import { Player, ChallengeMatch, ChallengeHistoryEntry, Rank } from '../../types';
import { RANKS, getRankFromRP } from '../../gameConfig';

interface ChallengeMatchProps {
    player: Player;
    match: ChallengeMatch;
    onBalanceUpdate: (newGold: number) => void;
    onRankUpdate: (newRank: Rank, newRankPoints: number) => void;
    onFinish: () => void;
}

const ChallengeMatchView: React.FC<ChallengeMatchProps> = ({ player, match, onBalanceUpdate, onRankUpdate, onFinish }) => {
    const [timeLeft, setTimeLeft] = useState(15);
    const [countdown, setCountdown] = useState(3);
    const [isFinished, setIsFinished] = useState(false);
    
    const { isPlayer1, self, opponent } = useMemo(() => {
        const p1 = player.uid === match.player1.uid;
        return {
            isPlayer1: p1,
            self: p1 ? match.player1 : match.player2,
            opponent: p1 ? match.player2 : match.player1,
        }
    }, [player.uid, match]);

    const handleTap = () => {
        if (match.status !== 'inprogress' || isFinished) return;
        const scoreRef = database.ref(`challenges/matches/${match.matchId}/${isPlayer1 ? 'player1' : 'player2'}/score`);
        scoreRef.transaction(currentScore => (currentScore || 0) + 1);
    };

    const determineWinner = useCallback(() => {
        if(isPlayer1) { // Only player 1 determines the winner to avoid race conditions
            database.ref(`challenges/matches/${match.matchId}`).transaction(currentMatch => {
                if (currentMatch && currentMatch.status !== 'finished') {
                    if (currentMatch.player1.score > currentMatch.player2.score) {
                        currentMatch.winner = currentMatch.player1.uid;
                    } else if (currentMatch.player2.score > currentMatch.player1.score) {
                        currentMatch.winner = currentMatch.player2.uid;
                    } else {
                        currentMatch.winner = 'draw';
                    }
                    currentMatch.status = 'finished';
                }
                return currentMatch;
            });
        }
    }, [isPlayer1, match.matchId]);

    useEffect(() => {
        if (match.status === 'countdown') {
            const interval = setInterval(() => {
                setCountdown(c => c - 1);
            }, 1000);
            setTimeout(() => {
                if(isPlayer1) {
                    database.ref(`challenges/matches/${match.matchId}/status`).set('inprogress');
                }
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [match.status, isPlayer1, match.matchId]);
    
    useEffect(() => {
        if (match.status === 'inprogress') {
            const timer = setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);

            const matchTimeout = setTimeout(determineWinner, 15000);

            return () => {
                clearInterval(timer);
                clearTimeout(matchTimeout);
            };
        }
    }, [match.status, determineWinner]);

    useEffect(() => {
        if (match.status === 'finished' && !isFinished) {
            const isWinner = match.winner === player.uid;
            const isDraw = match.winner === 'draw';

            let goldChange = 0;
            if (!isDraw) {
                goldChange = isWinner ? match.goldAtStake : -match.goldAtStake;
            }
            onBalanceUpdate(player.gold + goldChange);

            // Client-side rank update for immediate feedback
            const playerRankInfo = RANKS[player.rank];
            const [rpWin, rpLoss] = playerRankInfo.rpChange;
            let rpChange = 0;
            if (!isDraw) {
                rpChange = isWinner ? rpWin : rpLoss;
            }
            const newRankPoints = Math.max(0, player.rankPoints + rpChange);
            const newRank = getRankFromRP(newRankPoints);
            onRankUpdate(newRank, newRankPoints);

            // Authoritative update by player 1
            if(isPlayer1) {
                const p1Ref = database.ref(`users/${match.player1.uid}`);
                const p2Ref = database.ref(`users/${match.player2.uid}`);

                Promise.all([p1Ref.get(), p2Ref.get()]).then(([p1Snap, p2Snap]) => {
                    const p1Data = p1Snap.val();
                    const p2Data = p2Snap.val();
                    
                    const p1Result = match.winner === p1Data.uid ? 'win' : (match.winner === 'draw' ? 'draw' : 'loss');
                    const p2Result = match.winner === p2Data.uid ? 'win' : (match.winner === 'draw' ? 'draw' : 'loss');

                    const p1RankInfo = RANKS[p1Data.rank];
                    const [p1RpWin, p1RpLoss] = p1RankInfo.rpChange;
                    const p1RpChange = p1Result === 'win' ? p1RpWin : p1Result === 'loss' ? p1RpLoss : 0;
                    const p1GoldChange = p1Result === 'win' ? match.goldAtStake : p1Result === 'loss' ? -match.goldAtStake : 0;
                    const p1NewRp = Math.max(0, p1Data.rankPoints + p1RpChange);

                    const p2RankInfo = RANKS[p2Data.rank];
                    const [p2RpWin, p2RpLoss] = p2RankInfo.rpChange;
                    const p2RpChange = p2Result === 'win' ? p2RpWin : p2Result === 'loss' ? p2RpLoss : 0;
                    const p2GoldChange = p2Result === 'win' ? match.goldAtStake : p2Result === 'loss' ? -match.goldAtStake : 0;
                    const p2NewRp = Math.max(0, p2Data.rankPoints + p2RpChange);
                    
                    // DB Updates
                    p1Ref.update({ gold: p1Data.gold + p1GoldChange, rankPoints: p1NewRp, rank: getRankFromRP(p1NewRp) });
                    p2Ref.update({ gold: p2Data.gold + p2GoldChange, rankPoints: p2NewRp, rank: getRankFromRP(p2NewRp) });
                    
                    // History entries
                    const historyP1: ChallengeHistoryEntry = { opponentUsername: p2Data.username, goldChange: p1GoldChange, result: p1Result, timestamp: Date.now(), rankPointsChange: p1RpChange };
                    const historyP2: ChallengeHistoryEntry = { opponentUsername: p1Data.username, goldChange: p2GoldChange, result: p2Result, timestamp: Date.now(), rankPointsChange: p2RpChange };

                    database.ref(`users/${p1Data.uid}/challengeHistory/${match.matchId}`).set(historyP1);
                    database.ref(`users/${p2Data.uid}/challengeHistory/${match.matchId}`).set(historyP2);
                });
            }

            setIsFinished(true);
        }
    }, [match.status, match.winner, player, onBalanceUpdate, onRankUpdate, isPlayer1, isFinished, match]);


    const renderResult = () => {
        let message = "It's a Draw!";
        let color = 'text-yellow-400';
        if (match.winner === player.uid) {
            message = 'You Win!';
            color = 'text-green-400';
        } else if (match.winner !== 'draw') {
            message = 'You Lose!';
            color = 'text-red-500';
        }

        return (
             <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-10 p-4">
                <h2 className={`text-4xl sm:text-6xl font-bold ${color} mb-4 text-center`}>{message}</h2>
                <p className="text-lg sm:text-xl text-white mb-8 text-center">You mined {self.score} vs {opponent.username}'s {opponent.score}</p>
                <button onClick={onFinish} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg text-xl transform hover:-translate-y-1 hover:brightness-110">
                    Back to Lobby
                </button>
            </div>
        )
    }

    if (match.status === 'countdown') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                 <p className="text-lg sm:text-xl text-yellow-200">Opponent Found!</p>
                 <p className="text-2xl sm:text-4xl my-4 text-center">{self.username} <span className="text-red-500">VS</span> {opponent.username}</p>
                 <p className="text-5xl sm:text-6xl text-yellow-400">{countdown > 0 ? countdown : 'Go!'}</p>
            </div>
        );
    }
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-between relative p-4">
            {isFinished && match.status === 'finished' && renderResult()}
            
            <div className="w-full flex justify-between items-center text-base sm:text-lg">
                <div className="text-left">
                    <p className="text-blue-400">{self.username} (You)</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{self.score}</p>
                </div>
                <div className="text-center">
                    <p className="text-yellow-300 text-3xl sm:text-4xl">{timeLeft >= 0 ? timeLeft : 0}</p>
                    <p className="text-xs sm:text-sm">SECONDS LEFT</p>
                </div>
                <div className="text-right">
                    <p className="text-red-400">{opponent.username}</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{opponent.score}</p>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center">
                 <button onClick={handleTap} disabled={isFinished} className="w-48 h-48 sm:w-64 sm:h-64 bg-gray-700 rounded-full border-8 border-red-600 flex items-center justify-center focus:outline-none transition-transform duration-100 active:scale-95 disabled:opacity-50">
                    <span className={`text-7xl`}>
                        ⚔️
                    </span>
                </button>
            </div>

            <div className="text-center">
                <p className="text-yellow-200 text-lg">Tap as fast as you can!</p>
                <p className="text-sm text-yellow-500">Winner takes {match.goldAtStake.toLocaleString()} 💰</p>
            </div>
        </div>
    );
};

export default ChallengeMatchView;