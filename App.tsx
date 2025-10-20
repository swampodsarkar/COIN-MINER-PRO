
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './components/LoginScreen';
import GameScreen from './components/game/GameScreen';
import AdminPanel from './components/admin/AdminPanel';
import { ADMIN_EMAILS } from './constants';
import { Spinner } from './components/ui/Spinner';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();
    const [showAdmin, setShowAdmin] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <Spinner />
            </div>
        );
    }

    if (!user) {
        return <LoginScreen />;
    }

    const isAdmin = ADMIN_EMAILS.includes(user.email || '');

    return (
        <div className="h-screen w-screen">
            {isAdmin && (
                <div className="absolute top-4 right-4 z-50">
                    <button 
                        onClick={() => setShowAdmin(!showAdmin)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg border-2 border-yellow-700 shadow-lg transition duration-200"
                    >
                        {showAdmin ? 'Go to Game' : 'Admin Panel'}
                    </button>
                </div>
            )}
            {showAdmin && isAdmin ? <AdminPanel /> : <GameScreen />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
