import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { database } from '../../services/firebase';
import { Player, ChallengeMatch, ChallengeHistoryEntry } from '../../types';

interface ChallengeMatchProps {
    player: Player;
    match: ChallengeMatch;
    onBalanceUpdate: (newGold: number) => void;
    onFinish: () => void;
}

const ChallengeMatchView: React.FC<ChallengeMatchProps> = ({ player, match, onBalanceUpdate, onFinish }) => {
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
            // Update balance
            if (match.winner === player.uid) {
                onBalanceUpdate(player.gold + match.betAmount);
            } else if (match.winner !== 'draw' && match.winner !== undefined) {
                onBalanceUpdate(player.gold - match.betAmount);
            }

            // Write history for both players
            const historyRefP1 = database.ref(`users/${match.player1.uid}/challengeHistory/${match.matchId}`);
            const historyRefP2 = database.ref(`users/${match.player2.uid}/challengeHistory/${match.matchId}`);
            
            let resultP1: 'win' | 'loss' | 'draw' = 'draw';
            if (match.winner === match.player1.uid) resultP1 = 'win';
            else if (match.winner !== 'draw') resultP1 = 'loss';

            let resultP2: 'win' | 'loss' | 'draw' = 'draw';
            if (match.winner === match.player2.uid) resultP2 = 'win';
            else if (match.winner !== 'draw') resultP2 = 'loss';

            const historyEntryP1: ChallengeHistoryEntry = {
                opponentUsername: match.player2.username,
                betAmount: match.betAmount,
                result: resultP1,
                timestamp: Date.now(),
            };
            historyRefP1.set(historyEntryP1);

            const historyEntryP2: ChallengeHistoryEntry = {
                opponentUsername: match.player1.username,
                betAmount: match.betAmount,
                result: resultP2,
                timestamp: Date.now(),
            };
            historyRefP2.set(historyEntryP2);

            setIsFinished(true);
        }
    }, [match.status, match.winner, player, match.betAmount, onBalanceUpdate, match.matchId, match.player1, match.player2, isFinished]);


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
                    Back to Mine
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
                <p className="text-sm text-yellow-500">Winner takes {match.betAmount.toLocaleString()} 💰</p>
            </div>
        </div>
    );
};

export default ChallengeMatchView;