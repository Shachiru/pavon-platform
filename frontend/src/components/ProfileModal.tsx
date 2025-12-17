import React from "react"
import { User } from "../types"

interface ProfileModalProps {
    user: User
    isOpen: boolean
    onClose: () => void
    onLogout: () => void
    onDashboardClick?: () => void
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
    user,
    isOpen,
    onClose,
    onLogout,
    onDashboardClick
}) => {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md m-4 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header with gradient background */}
                <div
                    className="h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-t-3xl" />

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
                            className={`px-4 py-2 rounded-full ${user.role === "admin"
                                    ? "bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200"
                                    : "bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200"
                                }`}
                        >
                            <span
                                className={`text-sm font-semibold ${user.role === "admin"
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
                                onClick={onDashboardClick}
                                className="w-full px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-300"
                            >
                                📊 Go to Dashboard
                            </button>
                        )}
                        <button
                            onClick={onLogout}
                            className="w-full px-6 py-3 text-red-600 dark:text-red-400 font-semibold border-2 border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 hover:scale-[1.02] transition-all duration-300"
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
