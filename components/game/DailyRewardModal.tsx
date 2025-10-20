import React, { useState, useMemo } from 'react';
import Modal from '../ui/Modal';

interface DailyRewardModalProps {
    onClaim: (gems: number) => void;
    loginStreak: number;
}

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClaim, loginStreak }) => {
    const [claimed, setClaimed] = useState(false);
    
    const baseReward = 5;
    const streakBonus = 2;
    const rewardAmount = useMemo(() => baseReward + ((loginStreak - 1) * streakBonus), [loginStreak]);


    const handleClaim = () => {
        onClaim(rewardAmount);
        setClaimed(true);
    };

    return (
        <Modal title="Daily Reward!" onClose={() => { if(claimed) onClaim(0)}}>
            <div className="text-center p-4">
                <h2 className="text-2xl text-yellow-300 mb-2">Welcome Back, Miner!</h2>
                
                <div className="bg-gray-900/50 rounded-lg p-3 my-4 border border-yellow-700">
                    <p className="text-yellow-400 text-lg flex items-center justify-center">
                        <span className="text-2xl mr-2 animate-bounce">🔥</span>
                        {loginStreak}-Day Login Streak!
                    </p>
                    {loginStreak > 1 && (
                        <p className="text-gray-300 text-sm mt-1">
                            Base: {baseReward}💎 + Streak Bonus: {(loginStreak - 1) * streakBonus}💎
                        </p>
                    )}
                </div>

                <p className="text-gray-300 mb-6">Keep the streak going for bigger bonuses!</p>
                <div className="flex justify-center items-center text-4xl font-bold text-blue-400 mb-8">
                    <span className="text-4xl mr-3">💎</span>
                    <span>{rewardAmount}</span>
                </div>
                <button
                    onClick={handleClaim}
                    disabled={claimed}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg border-2 border-yellow-700 shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 transform hover:-translate-y-1 hover:brightness-110 disabled:transform-none"
                >
                    {claimed ? 'Claimed!' : 'Claim Reward'}
                </button>
            </div>
        </Modal>
    );
};

export default DailyRewardModal;