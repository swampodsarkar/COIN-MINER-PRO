
import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
    onLoaded: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onLoaded, 500); // Wait half a second before fading out
                    return 100;
                }
                return prev + 1;
            });
        }, 30); // ~3 seconds to load

        return () => clearInterval(interval);
    }, [onLoaded]);

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900 text-white animate-fade-in">
            <h1 className="text-3xl sm:text-5xl text-orange-400 font-bold mb-2">BATTLE ROYALE</h1>
            <h2 className="text-xl text-gray-300 mb-8">SURVIVAL GROUNDS</h2>
            <div className="w-full max-w-md bg-gray-700 rounded-full h-4 border-2 border-gray-600 mt-4">
                <div 
                    className="bg-orange-500 h-full rounded-full transition-all duration-150 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="mt-2 text-orange-200">{progress}% Loading Assets...</p>
        </div>
    );
};

export default LoadingScreen;
