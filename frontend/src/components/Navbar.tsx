"use client"

import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

export const Navbar = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            navigate("/")
        } catch {
            console.error("Logout failed")
        }
    }

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-lg shadow-purple-500/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => navigate("/")}
                            className="group relative hover:scale-110 transition-transform duration-300 focus:outline-none"
                        >
                            <span className="relative z-10 text-3xl font-black gradient-text">
                                Pavon
                            </span>
                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="relative px-6 py-2.5 text-gray-700 font-medium hover:text-purple-600 transition-colors duration-300 group"
                                >
                                    <span className="relative z-10">Login</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="relative px-6 py-2.5 text-white font-medium rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 overflow-hidden group"
                                >
                                    <span className="relative z-10">Sign Up</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/50">
                                    <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        {user.name}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-500">({user.role})</span>
                                </div>
                                {user.role === "admin" && (
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className="relative px-5 py-2.5 text-white font-medium rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
                                    >
                                        Dashboard
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2.5 text-gray-700 font-medium hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
