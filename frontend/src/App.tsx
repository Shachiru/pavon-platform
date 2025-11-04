import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import {useAuth} from './context/AuthContext';
import type {ReactNode} from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    adminOnly?: boolean;
}

function ProtectedRoute({children, adminOnly}: ProtectedRouteProps) {
    const {user, loading} = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace/>;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace/>;

    return <>{children}</>;
}

export default function App() {
    return (
        <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignupPage/>}/>
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute adminOnly>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}