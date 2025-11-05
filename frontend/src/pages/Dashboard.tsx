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
            <h1 className="mb-8 text-3xl font-bold text-gray-900">Welcome, Admin</h1>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Manage Products</h2>
                    <p className="mt-2 text-gray-600">Create, edit, and delete products</p>
                    <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Go to
                        Products
                    </button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">View Orders</h2>
                    <p className="mt-2 text-gray-600">Monitor and manage customer orders</p>
                    <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Go to
                        Orders
                    </button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
                    <p className="mt-2 text-gray-600">Manage users and their roles</p>
                    <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Go to Users
                    </button>
                </div>
            </div>
        </main>
    )
}
