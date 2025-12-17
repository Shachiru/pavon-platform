import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import {AuthProvider} from "./context/AuthContext"
import {CartProvider} from "./context/CartContext"
import {Navbar} from "./components/Navbar"
import {LandingPage} from "./pages/LandingPage"
import {LoginPage} from "./pages/LoginPage"
import {SignupPage} from "./pages/SignupPage"
import {Dashboard} from "./pages/Dashboard"
import {HomePage} from "./pages/HomePage"
import {AddProductPage} from "./pages/AddProductPage"
import {EditProductPage} from "./pages/EditProductPage"
import {CartPage} from "./pages/CartPage"
import {OrdersPage} from "./pages/OrdersPage"
import {OrderDetailsPage} from "./pages/OrderDetailsPage"
import {AdminOrdersPage} from "./pages/AdminOrdersPage"

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
                        <Navbar/>
                        <Routes>
                            <Route path="/" element={<LandingPage/>}/>
                            <Route path="/home" element={<HomePage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/signup" element={<SignupPage/>}/>
                            <Route path="/dashboard" element={<Dashboard/>}/>
                            <Route path="/products/add" element={<AddProductPage/>}/>
                            <Route path="/products/edit/:id" element={<EditProductPage/>}/>
                            <Route path="/cart" element={<CartPage/>}/>
                            <Route path="/orders" element={<OrdersPage/>}/>
                            <Route path="/orders/:id" element={<OrderDetailsPage/>}/>
                            <Route path="/admin/orders" element={<AdminOrdersPage/>}/>
                            <Route path="*" element={<Navigate to="/" replace/>}/>
                        </Routes>
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    )
}

export default App
