import React from 'react';

interface FriendsPanelProps {
    onClose: () => void;
}

const MOCK_FRIENDS = [
    { name: 'ShadowStriker', online: true },
    { name: 'PhoenixRider', online: true },
    { name: 'ViperX', online: false },
    { name: 'LunaGamer', online: true },
    { name: 'CyberWolf', online: false },
    { name: 'Rebel_Rose', online: false },
    { name: 'Ghost_Ops', online: true },
    { name: 'Nighthawk', online: true },
];

const FriendsPanel: React.FC<FriendsPanelProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={onClose}>
            <div 
                className="absolute top-0 right-0 h-full w-80 bg-gray-900 border-l-2 border-orange-500 shadow-2xl p-4 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl text-orange-400 font-bold">Friends</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-2">
                    <ul className="space-y-2">
                        {MOCK_FRIENDS.map(friend => (
                            <li key={friend.name} className="flex items-center justify-between bg-gray-800 p-2 rounded-lg">
                                <div>
                                    <p className="text-white font-semibold">{friend.name}</p>
                                    <p className={`text-xs ${friend.online ? 'text-green-400' : 'text-gray-500'}`}>
                                        {friend.online ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                                {friend.online && (
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded">
                                        Invite
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FriendsPanel;
