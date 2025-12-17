"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { ProfileModal } from "./ProfileModal"

export const Navbar = () => {
    const { user, logout } = useAuth()
    const { itemCount } = useCart()
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
                                    className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            {user && (
                                <>
                                    <button
                                        onClick={() => navigate("/home")}
                                        className="relative px-6 py-2.5 text-gray-700 font-medium hover:text-purple-600 transition-colors duration-300 group"
                                    >
                                        <span className="relative z-10">Products</span>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </button>

                                    <button
                                        onClick={() => navigate("/orders")}
                                        className="relative px-6 py-2.5 text-gray-700 font-medium hover:text-purple-600 transition-colors duration-300 group"
                                    >
                                        <span className="relative z-10">Orders</span>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </button>

                                    <button
                                        onClick={() => navigate("/cart")}
                                        className="relative p-2.5 text-gray-700 hover:text-purple-600 transition-colors duration-300 group"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        {itemCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                                {itemCount}
                                            </span>
                                        )}
                                    </button>
                                </>
                            )}
                            {!user ? (
                                <>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="relative px-6 py-2.5 text-gray-700 font-medium hover:text-purple-600 transition-colors duration-300 group"
                                    >
                                        <span className="relative z-10">Login</span>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </button>
                                    <button
                                        onClick={() => navigate("/signup")}
                                        className="relative px-6 py-2.5 text-white font-medium rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 overflow-hidden group"
                                    >
                                        <span className="relative z-10">Sign Up</span>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                                        className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Profile Modal */}
            {user && (
                <ProfileModal
                    user={user}
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    onLogout={handleLogout}
                    onDashboardClick={() => {
                        navigate("/dashboard")
                        setIsProfileOpen(false)
                    }}
                />
            )}
        </>
    )
}
