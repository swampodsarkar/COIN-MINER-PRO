
import React, { useState } from 'react';
import { database } from '../../services/firebase';

const GameSettings: React.FC = () => {
    const [notification, setNotification] = useState('');
    
    const handleStartNewSeason = () => {
        if(window.confirm("Are you sure you want to start a new season? This will reset the leaderboard.")) {
            database.ref('leaderboard').set(null);
            database.ref('system/season').transaction(currentSeason => (currentSeason || 0) + 1);
            alert("New season started!");
        }
    };
    
    const handleToggleGoldenRush = () => {
        const durationMinutes = 10;
        const endTime = Date.now() + durationMinutes * 60 * 1000;
        database.ref('system/events').update({
            goldenRush: true,
            goldenRushEnds: endTime
        });
        alert(`Golden Rush started for ${durationMinutes} minutes!`);
        setTimeout(() => {
             database.ref('system/events/goldenRush').set(false);
        }, durationMinutes * 60 * 1000);
    };

    const handleSendNotification = () => {
        if (!notification.trim()) return;
        database.ref('notifications').push({
            message: notification,
            timestamp: Date.now(),
        });
        setNotification('');
        alert("Notification sent!");
    };

    return (
        <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl text-yellow-300 mb-4">Season Control</h3>
                <p className="text-gray-400 mb-4">Starting a new season will reset the leaderboard for all players.</p>
                <button onClick={handleStartNewSeason} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Start New Season
                </button>
            </div>
            
             <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl text-yellow-300 mb-4">In-Game Events</h3>
                <p className="text-gray-400 mb-4">Trigger special events for all players.</p>
                <button onClick={handleToggleGoldenRush} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
                    Start Golden Rush Hour (10 Mins)
                </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl text-yellow-300 mb-4">Notification System</h3>
                <p className="text-gray-400 mb-4">Send a message to all active players.</p>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={notification}
                        onChange={(e) => setNotification(e.target.value)}
                        placeholder="Your message..."
                        className="flex-grow bg-gray-700 text-white p-2 rounded-lg border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
                    />
                    <button onClick={handleSendNotification} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameSettings;
