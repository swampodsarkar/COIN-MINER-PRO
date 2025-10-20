
import React, { useState, useEffect } from 'react';
import { SystemData, Notification } from '../../types';
import { database } from '../../services/firebase';

interface EventAnnouncerProps {
    system: SystemData | null;
}

const EventAnnouncer: React.FC<EventAnnouncerProps> = ({ system }) => {
    const [notification, setNotification] = useState<Notification | null>(null);

    useEffect(() => {
        const notificationRef = database.ref('notifications').limitToLast(1);
        const listener = notificationRef.on('child_added', (snapshot) => {
            const notifData = snapshot.val();
            const newNotif = { id: snapshot.key!, ...notifData };
            setNotification(newNotif);

            setTimeout(() => {
                setNotification(null);
            }, 10000);
        });

        return () => notificationRef.off('child_added', listener);
    }, []);

    const isGoldenRushActive = system?.events.goldenRush && system.events.goldenRushEnds > Date.now();

    return (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-md z-40">
            {isGoldenRushActive && (
                <div className="bg-yellow-500 text-black p-3 rounded-lg shadow-lg text-center animate-pulse">
                    GOLDEN RUSH HOUR! 2x GOLD!
                </div>
            )}
            {notification && (
                <div className="bg-blue-500 text-white p-3 rounded-lg shadow-lg text-center mt-2 flex items-center justify-center">
                    <span className="mr-2">📢</span>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default EventAnnouncer;
