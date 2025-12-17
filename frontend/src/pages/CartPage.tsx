import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import axios from "axios"
import {Badge, Button, EmptyState, Modal, Toast} from "../components/ui";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
    withCredentials: true,
})

export const CartPage: React.FC = () => {
    const navigate = useNavigate()
    const { cart, loading, itemCount, totalAmount, updateCartItem, removeFromCart, clearCart } = useCart()
    const [updatingItem, setUpdatingItem] = useState<string | null>(null)
    const [removingItem, setRemovingItem] = useState<string | null>(null)
    const [isCreatingOrder, setIsCreatingOrder] = useState(false)
    const [showClearModal, setShowClearModal] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return

        setUpdatingItem(itemId)
        try {
            await updateCartItem(itemId, newQuantity)
        } catch (error: any) {
            setToast({ message: error.message, type: "error" })
        } finally {
            setUpdatingItem(null)
        }
    }

    const handleRemoveItem = async (itemId: string) => {
        setRemovingItem(itemId)
        try {
            await removeFromCart(itemId)
            setToast({ message: "Item removed from cart", type: "success" })
        } catch (error: any) {
            setToast({ message: error.message, type: "error" })
        } finally {
            setRemovingItem(null)
        }
    }

    const handleClearCart = async () => {
        try {
            await clearCart()
            setShowClearModal(false)
            setToast({ message: "Cart cleared successfully", type: "success" })
        } catch (error: any) {
            setToast({ message: error.message, type: "error" })
        }
    }

    const handleCreateOrder = async () => {
        setIsCreatingOrder(true)
        try {
            const response = await api.post("/orders")
            setToast({ message: "Order created successfully!", type: "success" })
            setTimeout(() => {
                navigate("/orders")
            }, 1500)
        } catch (error: any) {
            setToast({
                message: error.response?.data?.message || "Failed to create order",
                type: "error"
            })
        } finally {
            setIsCreatingOrder(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
            </div>
        )
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <EmptyState
                    icon={
                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    }
                    title="Your cart is empty"
                    description="Add some products to your cart to get started with your shopping journey."
                    action={
                        <Button onClick={() => navigate("/home")}>
                            Continue Shopping
                        </Button>
                    }
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">
                        <Badge variant="info">{itemCount} items</Badge> in your cart
                    </p>
                </div>
                {cart.items.length > 0 && (
                    <Button variant="danger" size="sm" onClick={() => setShowClearModal(true)}>
                        Clear Cart
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                        >
                            <div className="flex gap-6">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={item.product.images[0] || "/placeholder.png"}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-2">
                                        {item.product.category} • {item.product.brand}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-bold text-purple-600">
                                            ${item.product.price.toFixed(2)}
                                        </p>
                                        {item.product.stock < 10 && (
                                            <Badge variant="warning">
                                                Only {item.product.stock} left!
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => handleRemoveItem(item._id!)}
                                        disabled={removingItem === item._id}
                                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>

                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => handleUpdateQuantity(item._id!, item.quantity - 1)}
                                            disabled={updatingItem === item._id || item.quantity <= 1}
                                            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-semibold">
                                            {updatingItem === item._id ? "..." : item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item._id!, item.quantity + 1)}
                                            disabled={updatingItem === item._id || item.quantity >= item.product.stock}
                                            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="text-lg font-bold text-gray-900">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg p-6 border border-purple-100 sticky top-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({itemCount} items)</span>
                                <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="font-semibold text-green-600">FREE</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span className="text-purple-600">${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full mb-3"
                            onClick={handleCreateOrder}
                            isLoading={isCreatingOrder}
                        >
                            Proceed to Checkout
                        </Button>

                        <Button
                            variant="outline"
                            size="md"
                            className="w-full"
                            onClick={() => navigate("/home")}
                        >
                            Continue Shopping
                        </Button>

                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800 flex items-start gap-2">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>
                                    All prices are final. Stock is reserved after checkout with secure transaction processing.
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clear Cart Modal */}
            <Modal
                isOpen={showClearModal}
                onClose={() => setShowClearModal(false)}
                title="Clear Cart"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to remove all items from your cart? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setShowClearModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleClearCart}>
                            Clear Cart
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

