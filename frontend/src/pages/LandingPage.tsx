"use client"

import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

export const LandingPage = () => {
    const {user} = useAuth()
    const navigate = useNavigate()

    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 animated-gradient opacity-10" />

            {/* Floating Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center animate-slide-up">
                    <div className="inline-block mb-6 px-6 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200/50">
                        <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            ✨ Welcome to the Future of Shopping
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 perspective-1000">
                        <span className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 card-3d">
                            Pavon
                        </span>
                        <br />
                        <span className="inline-block text-gray-900 dark:text-white mt-2">
                            Marketplace
                        </span>
                    </h1>

                    <p className="mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Your modern e-commerce platform for buying and selling.
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 font-semibold">
                            Experience shopping reimagined.
                        </span>
                    </p>

                    {!user ? (
                        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-scale-in" style={{animationDelay: '0.2s'}}>
                            <button
                                onClick={() => navigate("/login")}
                                className="group relative px-8 py-4 text-lg font-semibold rounded-2xl bg-white border-2 border-gray-200 text-gray-900 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10 group-hover:text-purple-600 transition-colors">Login</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                className="group relative px-8 py-4 text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10">Get Started</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>
                        </div>
                    ) : (
                        <div className="mt-12 animate-scale-in">
                            <div className="inline-block p-8 rounded-3xl bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-2xl shadow-purple-500/10">
                                <p className="text-xl text-gray-700 mb-6">
                                    👋 Welcome back, <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{user.name}</span>!
                                </p>
                                <p className="text-gray-600 mb-6">
                                    Explore our products and start shopping today!
                                </p>
                                {user.role === "admin" && (
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className="px-8 py-4 text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
                                    >
                                        🚀 Go to Dashboard
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Feature Cards */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
                    <div className="group perspective-1000">
                        <div className="card-3d p-8 rounded-3xl bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                            <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl float">
                                🛍️
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Shop Smart</h3>
                            <p className="text-gray-600">
                                Discover amazing products from trusted sellers worldwide.
                            </p>
                        </div>
                    </div>

                    <div className="group perspective-1000">
                        <div className="card-3d p-8 rounded-3xl bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300" style={{animationDelay: '0.1s'}}>
                            <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl float">
                                ⚡
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
                            <p className="text-gray-600">
                                Seamless checkout and instant order confirmation.
                            </p>
                        </div>
                    </div>

                    <div className="group perspective-1000">
                        <div className="card-3d p-8 rounded-3xl bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300" style={{animationDelay: '0.2s'}}>
                            <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl float">
                                🔒
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Payments</h3>
                            <p className="text-gray-600">
                                Your transactions are protected with industry-leading security.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
