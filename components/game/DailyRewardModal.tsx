
import React, { useState, useMemo } from 'react';
import Modal from '../ui/Modal';

interface DailyRewardModalProps {
    onClaim: (gems: number) => void;
}

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClaim }) => {
    const [claimed, setClaimed] = useState(false);
    const rewardAmount = useMemo(() => Math.floor(Math.random() * 10) + 5, []);

    const handleClaim = () => {
        onClaim(rewardAmount);
        setClaimed(true);
    };

    return (
        <Modal title="Daily Reward!" onClose={() => { if(claimed) onClaim(0)}}>
            <div className="text-center p-4">
                <h2 className="text-2xl text-yellow-300 mb-4">Welcome Back, Miner!</h2>
                <p className="text-gray-300 mb-6">Here's your daily reward. Come back tomorrow for more!</p>
                <div className="flex justify-center items-center text-4xl font-bold text-blue-400 mb-8">
                    <span className="text-4xl mr-3">💎</span>
                    <span>{rewardAmount}</span>
                </div>
                <button
                    onClick={handleClaim}
                    disabled={claimed}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg border-2 border-yellow-700 shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                    {claimed ? 'Claimed!' : 'Claim Reward'}
                </button>
            </div>
        </Modal>
    );
};

export default DailyRewardModal;
