
import React from 'react';

const EventsScreen: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start bg-black bg-opacity-70 p-4 rounded-xl border-2 border-yellow-500 text-white overflow-y-auto">
            <div className="text-center mb-6">
                 <h2 className="text-4xl font-bold text-orange-300 tracking-wider">EVENTS</h2>
                 <p className="text-gray-300">Check out what's happening!</p>
            </div>
           
            <div className="w-full max-w-2xl bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Upcoming Tournament: Season 1 Open</h3>
                <p className="text-gray-400 mb-4">Compete against the best for a massive prize pool and the title of Season 1 Champion. Registrations are opening soon!</p>
                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div>
                        <p className="text-sm text-gray-400">Prize Pool</p>
                        <p className="text-xl font-bold text-green-400">💰 100,000 Gold</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-400">Starts In</p>
                        <p className="text-xl font-bold text-blue-400">7 Days</p>
                    </div>
                </div>

                <button 
                    onClick={() => alert('Registration will open soon. Stay tuned!')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold text-lg py-3 px-4 rounded-lg border-b-4 border-orange-700 shadow-lg transform active:scale-95 transition-all"
                >
                    Register Now
                </button>
            </div>
            
            <div className="w-full max-w-2xl bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h3 className="text-2xl font-semibold text-white mb-2">New Character: Hayato</h3>
                <p className="text-gray-400 mb-4">The legendary samurai, Hayato, has arrived on the battlegrounds. Unlock him in the store now and master his Bushido ability!</p>
                 <button 
                    onClick={() => alert('Redirecting to store...')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-3 px-4 rounded-lg border-b-4 border-blue-700 shadow-lg transform active:scale-95 transition-all"
                >
                    Go to Store
                </button>
            </div>

        </div>
    );
};

export default EventsScreen;
