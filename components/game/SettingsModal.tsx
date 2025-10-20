
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import PrivacyPolicyModal from './PrivacyPolicyModal';

interface SettingsModalProps {
    onClose: () => void;
}

type GraphicsQuality = 'Low' | 'Medium' | 'High';

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const [graphics, setGraphics] = useState<GraphicsQuality>('High');
    const [volume, setVolume] = useState(80);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

    const GraphicsButton: React.FC<{ quality: GraphicsQuality }> = ({ quality }) => {
        const isActive = graphics === quality;
        return (
            <button
                onClick={() => setGraphics(quality)}
                className={`flex-1 py-2 px-4 text-sm rounded-md transition-colors ${
                    isActive ? 'bg-yellow-500 text-black font-bold' : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
            >
                {quality}
            </button>
        );
    };
    
    if (showPrivacyPolicy) {
        return <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />;
    }

    return (
        <Modal title="Settings" onClose={onClose}>
            <div className="p-2 sm:p-4 space-y-6 text-white">
                {/* Graphics Settings */}
                <div>
                    <label className="block text-lg text-yellow-300 mb-2">Graphics Quality</label>
                    <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
                        <GraphicsButton quality="Low" />
                        <GraphicsButton quality="Medium" />
                        <GraphicsButton quality="High" />
                    </div>
                </div>

                {/* Volume Settings */}
                <div>
                    <label htmlFor="volume-slider" className="block text-lg text-yellow-300 mb-2">
                        Volume: <span className="font-bold">{volume}%</span>
                    </label>
                    <input
                        id="volume-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                </div>
                
                {/* About/Privacy Policy */}
                <div>
                    <button 
                        onClick={() => setShowPrivacyPolicy(true)}
                        className="w-full text-left text-yellow-400 hover:text-yellow-300 hover:underline"
                    >
                        About & Privacy Policy
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;
