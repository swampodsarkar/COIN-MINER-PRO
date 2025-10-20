
import React, { useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { GoogleIcon, EmailIcon } from './ui/icons';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        try {
            await auth.signInWithPopup(googleProvider);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (isSignUp) {
                await auth.createUserWithEmailAndPassword(email, password);
            } else {
                await auth.signInWithEmailAndPassword(email, password);
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-opacity-70 p-4">
            <div className="w-full max-w-md bg-gray-800 bg-opacity-80 rounded-2xl shadow-2xl p-8 border-2 border-yellow-500">
                <h1 className="text-4xl text-yellow-400 text-center mb-2 tracking-widest">Click2Mine</h1>
                <h2 className="text-xl text-yellow-200 text-center mb-8">The Gold Rush</h2>

                {error && <p className="text-red-500 text-center mb-4 text-xs">{error}</p>}

                <form onSubmit={handleEmailLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4 border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
                        required
                    />
                    <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg border-2 border-yellow-700 shadow-lg transition duration-200 mb-4 flex items-center justify-center">
                        <EmailIcon className="h-5 w-5 mr-2" />
                        {isSignUp ? 'Sign Up with Email' : 'Login with Email'}
                    </button>
                </form>

                <div className="text-center my-4">
                    <button onClick={() => setIsSignUp(!isSignUp)} className="text-yellow-400 hover:text-yellow-300 text-sm">
                        {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                    </button>
                </div>
                
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="flex-shrink mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg border-2 border-blue-800 shadow-lg transition duration-200 flex items-center justify-center">
                    <GoogleIcon className="h-5 w-5 mr-2" />
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default LoginScreen;
