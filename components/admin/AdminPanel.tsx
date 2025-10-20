
import React, { useState } from 'react';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import GameSettings from './GameSettings';

type AdminTab = 'dashboard' | 'users' | 'settings';

const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'users':
                return <UserManagement />;
            case 'settings':
                return <GameSettings />;
            default:
                return <Dashboard />;
        }
    };
    
    const TabButton: React.FC<{tab: AdminTab, label: string}> = ({tab, label}) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tab 
                ? 'bg-yellow-500 text-black' 
                : 'text-yellow-300 hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="h-screen w-screen bg-gray-900 text-white p-4 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl text-yellow-400 mb-6">Admin Panel</h1>
                <div className="flex space-x-2 border-b border-gray-700 mb-6">
                   <TabButton tab="dashboard" label="Dashboard" />
                   <TabButton tab="users" label="User Management" />
                   <TabButton tab="settings" label="Game Settings" />
                </div>
                <div>{renderTabContent()}</div>
            </div>
        </div>
    );
};

export default AdminPanel;
