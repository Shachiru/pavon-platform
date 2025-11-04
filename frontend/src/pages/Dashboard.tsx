import {useAuth} from '../context/AuthContext';
import {Link} from 'react-router-dom';

export default function Dashboard() {
    const {user} = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                        <Link to="/" className="text-indigo-600 hover:underline">Back to Home</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
                    <p className="text-gray-600 mb-6">You are logged in as <strong>Admin</strong>.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg text-center">
                            <h3 className="text-lg font-semibold">Manage Products</h3>
                            <p className="text-gray-600">Add, edit, delete products</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg text-center">
                            <h3 className="text-lg font-semibold">View Orders</h3>
                            <p className="text-gray-600">See all customer orders</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-lg text-center">
                            <h3 className="text-lg font-semibold">User Management</h3>
                            <p className="text-gray-600">Control user roles</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}