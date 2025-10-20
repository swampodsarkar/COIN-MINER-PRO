import React from 'react';

const EsportsScreen: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-start bg-black bg-opacity-70 p-4 rounded-xl border-2 border-yellow-500 text-white">
            <div className="text-center mb-6">
                 <h2 className="text-4xl font-bold text-yellow-300 tracking-wider">BATTLE LEGENDS ESPORTS</h2>
                 <p className="text-gray-300">The Ultimate Proving Grounds</p>
            </div>
           
            <div className="w-full max-w-2xl bg-gray-800/50 rounded-lg p-6 border border-gray-700">
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
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg py-3 px-4 rounded-lg border-b-4 border-yellow-700 shadow-lg transform active:scale-95 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Register Now
                </button>
            </div>

            <div className="mt-8 text-center">
                 <p className="text-gray-500">More tournaments and events coming soon.</p>
            </div>
        </div>
    );
};

export default EsportsScreen;