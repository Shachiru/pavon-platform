/// <reference types="vite/client" />
"use client"

import type React from "react"
import {createContext, useContext, useState, useEffect, type ReactNode} from "react"
import axios from "axios"

interface User {
    id: string
    name: string
    email: string
    role: "user" | "admin"
}

interface AuthContextType {
    user: User | null
    loading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    googleLogin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
    withCredentials: true,
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const response = await api.get("/auth/me")
                setUser(response.data)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        fetchMe()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            setError(null)
            const response = await api.post("/auth/login", {email, password})
            setUser(response.data)
        } catch (err: unknown) {
            const message = axios.isAxiosError(err) ? err.response?.data?.message : "Login failed"
            setError(message || "Login failed")
            throw err
        }
    }

    const signup = async (name: string, email: string, password: string) => {
        try {
            setError(null)
            const response = await api.post("/auth/signup", {name, email, password})
            setUser(response.data)
        } catch (err: unknown) {
            const message = axios.isAxiosError(err) ? err.response?.data?.message : "Signup failed"
            setError(message || "Signup failed")
            throw err
        }
    }

    const logout = async () => {
        try {
            setError(null)
            await api.post("/auth/logout")
            setUser(null)
        } catch (err: unknown) {
            const message = axios.isAxiosError(err) ? err.response?.data?.message : "Logout failed"
            setError(message || "Logout failed")
            throw err
        }
    }

    const googleLogin = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"
        window.location.href = `${baseUrl}/api/auth/google`
    }

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        googleLogin,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
