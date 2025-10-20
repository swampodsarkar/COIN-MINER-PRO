
import React from 'react';
import Modal from '../ui/Modal';

type Reward = { type: 'gold' | 'diamonds'; value: number, emoji: string };

const DAILY_REWARDS: Reward[] = [
    { type: 'gold', value: 500, emoji: '💰' },
    { type: 'gold', value: 750, emoji: '💰' },
    { type: 'gold', value: 1000, emoji: '💰' },
    { type: 'diamonds', value: 20, emoji: '💎' },
    { type: 'gold', value: 1500, emoji: '💰' },
    { type: 'gold', value: 2000, emoji: '💰' },
    { type: 'diamonds', value: 100, emoji: '💎' }
];

interface DailyRewardModalProps {
    loginStreak: number;
    onClaim: (reward: Reward) => void;
    onClose: () => void;
}


const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ loginStreak, onClaim, onClose }) => {
    
    const currentDayIndex = loginStreak;
    const rewardToClaim = DAILY_REWARDS[currentDayIndex];

    const handleClaim = () => {
        onClaim(rewardToClaim);
    };

    const RewardCard: React.FC<{ day: number; reward: Reward; isClaimed: boolean; isToday: boolean }> = ({ day, reward, isClaimed, isToday }) => {
        const cardClasses = `
            relative flex flex-col items-center justify-center p-2 rounded-lg border-2 text-center
            transition-all duration-300
            ${isToday ? 'bg-orange-500/20 border-orange-400 scale-110 shadow-lg shadow-orange-500/20' : 'bg-gray-700 border-gray-600'}
            ${isClaimed ? 'opacity-50' : ''}
        `;

        return (
            <div className={cardClasses}>
                {isClaimed && <div className="absolute top-1 right-1 text-2xl">✅</div>}
                <p className={`font-bold ${isToday ? 'text-orange-300' : 'text-gray-400'}`}>Day {day}</p>
                <span className="text-4xl my-2">{reward.emoji}</span>
                <p className="text-sm font-semibold text-white">
                    {reward.value.toLocaleString()}
                </p>
            </div>
        );
    };

    return (
        <Modal title="Daily Login Bonus" onClose={onClose}>
            <div className="text-center p-2 sm:p-4">
                <h2 className="text-2xl text-orange-300 mb-2">Welcome Back, Survivor!</h2>
                <p className="text-gray-300 mb-6">Claim your reward for logging in. Keep the streak going for a special prize on Day 7!</p>
                
                <div className="grid grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4 mb-8">
                    {DAILY_REWARDS.map((reward, index) => (
                        <RewardCard 
                            key={index}
                            day={index + 1}
                            reward={reward}
                            isClaimed={index < currentDayIndex}
                            isToday={index === currentDayIndex}
                        />
                    ))}
                </div>

                <button
                    onClick={handleClaim}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-4 rounded-lg border-2 border-orange-700 shadow-lg transform hover:-translate-y-1 hover:brightness-110"
                >
                    Claim Day {currentDayIndex + 1} Reward
                </button>
            </div>
        </Modal>
    );
};

export default DailyRewardModal;
