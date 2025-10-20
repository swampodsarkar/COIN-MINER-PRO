import React from 'react';

const PrepScreen: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-70 p-4 rounded-xl border-2 border-purple-600">
            <span className="text-6xl mb-4">🎒</span>
            <h3 className="text-center text-3xl font-bold text-yellow-300 mb-2">Preparation</h3>
            <p className="text-center text-gray-400">This feature is coming soon!</p>
            <p className="text-center text-gray-400">Customize your emblems and equipment here before battle.</p>
        </div>
    );
};

export default PrepScreen;
