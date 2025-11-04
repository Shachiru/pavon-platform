import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    googleLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5001/api';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check auth on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
                setUser(res.data.data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
        const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        setUser(res.data.data.user);
    };

    const signup = async (name: string, email: string, password: string) => {
        await axios.post(`${API_URL}/auth/signup`, { name, email, password }, { withCredentials: true });
        const res = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        setUser(res.data.data.user);
    };

    const logout = async () => {
        await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
        setUser(null);
    };

    const googleLogin = () => {
        window.location.href = `${API_URL}/auth/google`;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, googleLogin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};