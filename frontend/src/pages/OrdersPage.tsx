import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Order, OrderStatus } from "../types"
import axios from "axios"
import {Badge, Button, EmptyState, Modal, Toast} from "../components/ui";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
    withCredentials: true,
})

const getStatusBadgeVariant = (status: OrderStatus): "default" | "success" | "warning" | "danger" | "info" => {
    switch (status) {
        case "pending": return "warning"
        case "confirmed": return "info"
        case "shipped": return "info"
        case "delivered": return "success"
        case "cancelled": return "danger"
        default: return "default"
    }
}

export const OrdersPage: React.FC = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
    const [cancellingOrder, setCancellingOrder] = useState<string | null>(null)
    const [showCancelModal, setShowCancelModal] = useState<string | null>(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await api.get("/orders/my")
            setOrders(response.data.data.orders)
        } catch (error: any) {
            setToast({
                message: error.response?.data?.message || "Failed to fetch orders",
                type: "error"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCancelOrder = async (orderId: string) => {
        setCancellingOrder(orderId)
        try {
            await api.post(`/orders/${orderId}/cancel`)
            setToast({ message: "Order cancelled successfully! Stock has been restored.", type: "success" })
            setShowCancelModal(null)
            await fetchOrders()
        } catch (error: any) {
            setToast({
                message: error.response?.data?.message || "Failed to cancel order",
                type: "error"
            })
        } finally {
            setCancellingOrder(null)
        }
    }

    const canCancelOrder = (status: OrderStatus) => {
        return status === "pending" || status === "confirmed"
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                <EmptyState
                    icon={
                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                    title="No orders yet"
                    description="You haven't placed any orders yet. Start shopping to see your orders here."
                    action={
                        <Button onClick={() => navigate("/home")}>
                            Start Shopping
                        </Button>
                    }
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
                <p className="text-gray-600">Track and manage your orders</p>
            </div>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                    >
                        {/* Order Header */}
                        <div className="bg-gradient-to-r from-purple-50 to-white p-6 border-b border-gray-100">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </h3>
                                        <Badge variant={getStatusBadgeVariant(order.status)}>
                                            {order.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            ${order.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6">
                            <div className="space-y-4 mb-4">
                                {order.items.map((item, index) => {
                                    const productName = item.product?.name || "Product Unavailable"
                                    const productImage = item.product?.images?.[0] || "/placeholder.png"

                                    return (
                                        <div key={item._id || index} className="flex gap-4 items-center">
                                            <img
                                                src={productImage}
                                                alt={productName}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/placeholder.png"
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{productName}</h4>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-bold text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                >
                                    View Details
                                </Button>
                                {canCancelOrder(order.status) && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => setShowCancelModal(order._id)}
                                        isLoading={cancellingOrder === order._id}
                                    >
                                        Cancel Order
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cancel Order Modal */}
            {showCancelModal && (
                <Modal
                    isOpen={!!showCancelModal}
                    onClose={() => setShowCancelModal(null)}
                    title="Cancel Order"
                    size="sm"
                >
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Important:</strong> Cancelling this order will restore the product stock automatically.
                            </p>
                        </div>
                        <p className="text-gray-600">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setShowCancelModal(null)}>
                                Keep Order
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => handleCancelOrder(showCancelModal)}
                                isLoading={cancellingOrder === showCancelModal}
                            >
                                Cancel Order
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

