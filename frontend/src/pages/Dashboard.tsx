"use client"

import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import {useEffect} from "react"

export const Dashboard = () => {
    const {user, loading} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) {
            navigate("/")
        }
    }, [user, loading, navigate])

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">Loading...</div>
            </main>
        )
    }

    if (!user || user.role !== "admin") {
        return null
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Welcome back, {user.name}!</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Manage Products</h2>
                    <p className="mt-2 text-gray-600 text-sm">Create, edit, and delete products</p>
                    <button
                        onClick={() => navigate("/products/add")}
                        className="mt-4 w-full rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors font-medium"
                    >
                        Add New Product
                    </button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Manage Orders</h2>
                    <p className="mt-2 text-gray-600 text-sm">Monitor and confirm customer orders</p>
                    <button
                        onClick={() => navigate("/admin/orders")}
                        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors font-medium"
                    >
                        Go to Orders
                    </button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                    <p className="mt-2 text-gray-600 text-sm">Manage users and their roles</p>
                    <button className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors font-medium">
                        Go to Users
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid gap-6 md:grid-cols-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">$--</p>
                </div>
            </div>
        </main>
    )
}
