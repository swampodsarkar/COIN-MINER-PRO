
import React from 'react';
import { GameView } from './GameScreen';

interface SideNavProps {
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
        <li>
            <button
                onClick={() => onClick(view)}
                className={`w-full flex items-center justify-center sm:justify-start p-2 sm:p-3 my-1 rounded-lg text-left transition-all duration-200 ${
                    isActive
                        ? 'bg-yellow-500 text-black shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                <span className="text-2xl mr-0 sm:mr-4">{icon}</span>
                <span className="hidden sm:inline font-bold">{label}</span>
            </button>
        </li>
    );
};

const SideNav: React.FC<SideNavProps> = ({ activeView, setActiveView }) => {
    return (
        <nav className="w-16 sm:w-48 bg-black bg-opacity-40 h-full p-2 border-r-2 border-yellow-600 flex flex-col transition-all duration-300">
            <h2 className="text-yellow-400 text-lg text-center mt-2 mb-4 hidden sm:block">Click2Mine</h2>
            <ul className="flex-grow">
                <NavItem label="Mine" icon="⛏️" view="mine" activeView={activeView} onClick={setActiveView} />
                <NavItem label="Store" icon="🏪" view="store" activeView={activeView} onClick={setActiveView} />
                <NavItem label="Heroes" icon="🦸" view="heroes" activeView={activeView} onClick={setActiveView} />
                <NavItem label="Luck Royale" icon="✨" view="luckRoyale" activeView={activeView} onClick={setActiveView} />
                <NavItem label="Leaders" icon="🏆" view="leaderboard" activeView={activeView} onClick={setActiveView} />
                <NavItem label="Rank Match" icon="⚔️" view="challenge" activeView={activeView} onClick={setActiveView} />
            </ul>
        </nav>
    );
};

export default SideNav;
