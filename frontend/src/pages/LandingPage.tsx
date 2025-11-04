import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function LandingPage() {
    const {user, logout} = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-2xl font-bold text-indigo-600">Pavon</h1>
                        <div className="flex gap-4 items-center">
                            {user ? (
                                <>
                                    <span className="text-gray-700">Hi, {user.name} ({user.role})</span>
                                    {user.role === 'admin' && (
                                        <Link to="/dashboard"
                                              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                                            Dashboard
                                        </Link>
                                    )}
                                    <button onClick={logout} className="text-red-600 hover:underline">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
                                    <Link to="/signup"
                                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-5xl font-bold text-gray-900 mb-6">
                    Welcome to Pavon Marketplace
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                    Buy and sell devices with confidence.
                </p>
                {!user && (
                    <div className="space-x-4">
                        <Link to="/signup"
                              className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-indigo-700">
                            Get Started
                        </Link>
                        <Link to="/login"
                              className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg text-lg hover:bg-indigo-50">
                            Login
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}