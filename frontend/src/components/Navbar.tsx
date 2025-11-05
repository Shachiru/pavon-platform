"use client"

import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

export const Navbar = () => {
    const {user, logout} = useAuth()
    const navigate = useNavigate()
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const handleLogout = async () => {
        try {
            await logout()
            navigate("/")
            setIsProfileOpen(false)
        } catch {
            console.error("Logout failed")
        }
    }

    return (
        <>
            <nav
                className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-lg shadow-purple-500/5">
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
                                <div
                                    className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
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
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                    </button>
                                    <button
                                        onClick={() => navigate("/signup")}
                                        className="relative px-6 py-2.5 text-white font-medium rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 overflow-hidden group"
                                    >
                                        <span className="relative z-10">Sign Up</span>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsProfileOpen(true)}
                                    className="relative group focus:outline-none"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-200 group-hover:ring-purple-400 group-hover:scale-110 transition-all duration-300 cursor-pointer"
                                        />
                                    ) : (
                                        <div
                                            className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center ring-2 ring-purple-200 group-hover:ring-purple-400 group-hover:scale-110 transition-all duration-300 cursor-pointer">
                                            <span className="text-white font-bold text-base">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    {/* Online indicator */}
                                    <div
                                        className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"/>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Profile Modal */}
            {isProfileOpen && user && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsProfileOpen(false)}
                >
                    <div
                        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md m-4 animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsProfileOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>

                        {/* Header with gradient background */}
                        <div
                            className="h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-t-3xl"/>

                        {/* Profile content */}
                        <div className="px-8 pb-8">
                            {/* Avatar - overlapping header */}
                            <div className="flex justify-center -mt-16 mb-4">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-32 h-32 rounded-full object-cover ring-4 ring-white dark:ring-gray-900 shadow-xl"
                                    />
                                ) : (
                                    <div
                                        className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center ring-4 ring-white dark:ring-gray-900 shadow-xl">
                                        <span className="text-white font-bold text-5xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* User details */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {user.name}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {user.email}
                                </p>
                            </div>

                            {/* Role badge */}
                            <div className="flex justify-center mb-6">
                                <div
                                    className={`px-4 py-2 rounded-full ${
                                        user.role === "admin"
                                            ? "bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200"
                                            : "bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200"
                                    }`}
                                >
                                    <span
                                        className={`text-sm font-semibold ${
                                            user.role === "admin"
                                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                                                : "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                                        }`}
                                    >
                                        {user.role === "admin" ? "👑 Administrator" : "👤 User"}
                                    </span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-3">
                                {user.role === "admin" && (
                                    <button
                                        onClick={() => {
                                            navigate("/dashboard")
                                            setIsProfileOpen(false)
                                        }}
                                        className="w-full px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300"
                                    >
                                        📊 Go to Dashboard
                                    </button>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-6 py-3 text-red-600 dark:text-red-400 font-semibold border-2 border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:scale-[1.02] transition-all duration-300"
                                >
                                    🚪 Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
