import React from 'react';
import { GameView } from './GameScreen';

interface BottomNavBarProps {
    activeView: GameView;
    setActiveView: (view: GameView) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: string;
    view: GameView;
    activeView: GameView;
    onClick: (view: GameView) => void;
}> = ({ label, icon, view, activeView, onClick }) => {
    const isActive = activeView === view;
    return (
        <button
            onClick={() => onClick(view)}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
                isActive ? 'text-orange-400' : 'text-gray-400 hover:text-white'
            }`}
        >
            <span className="text-2xl mb-1">{icon}</span>
            <span className="text-xs font-bold">{label}</span>
        </button>
    );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
    return (
        <nav className="absolute bottom-0 left-0 right-0 h-20 bg-black bg-opacity-70 backdrop-blur-md border-t-2 border-gray-800 flex items-center justify-around z-30">
            <NavItem label="Home" icon="🏠" view="home" activeView={activeView} onClick={setActiveView} />
            <NavItem label="Character" icon="🧑" view="character" activeView={activeView} onClick={setActiveView} />
            <NavItem label="Luck Royale" icon="🎰" view="luck_royale" activeView={activeView} onClick={setActiveView} />
            <NavItem label="Pet" icon="🐾" view="pet" activeView={activeView} onClick={setActiveView} />
            <NavItem label="Clan" icon="🛡️" view="clan" activeView={activeView} onClick={setActiveView} />
            <NavItem label="Rankings" icon="🏆" view="leaderboard" activeView={activeView} onClick={setActiveView} />
        </nav>
    );
};

export default BottomNavBar;
