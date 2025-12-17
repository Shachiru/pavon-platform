import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Order, OrderStatus } from "../types"
import axios from "axios"
import { Badge, Button, EmptyState, Modal, Toast } from "../components/ui"

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

interface OrderWithUser extends Omit<Order, 'user'> {
    user: {
        _id: string
        name: string
        email: string
    }
}

export const AdminOrdersPage: React.FC = () => {
    const navigate = useNavigate()
    const { user, loading: authLoading } = useAuth()
    const [orders, setOrders] = useState<OrderWithUser[]>([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
    const [confirmingOrder, setConfirmingOrder] = useState<string | null>(null)
    const [showConfirmModal, setShowConfirmModal] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all")

    useEffect(() => {
        // Redirect non-admin users
        if (!authLoading && (!user || user.role !== "admin")) {
            navigate("/")
        }
    }, [user, authLoading, navigate])

    useEffect(() => {
        if (user && user.role === "admin") {
            fetchOrders()
        }
    }, [user])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const response = await api.get("/orders")
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

    const handleConfirmOrder = async (orderId: string) => {
        setConfirmingOrder(orderId)
        try {
            await api.post(`/orders/${orderId}/confirm`)
            setToast({ message: "Order confirmed successfully!", type: "success" })
            setShowConfirmModal(null)
            await fetchOrders()
        } catch (error: any) {
            setToast({
                message: error.response?.data?.message || "Failed to confirm order",
                type: "error"
            })
        } finally {
            setConfirmingOrder(null)
        }
    }

    const filteredOrders = filterStatus === "all"
        ? orders
        : orders.filter(order => order.status === filterStatus)

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
            </div>
        )
    }

    if (!user || user.role !== "admin") {
        return null
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
                    description="There are no customer orders in the system yet."
                    action={
                        <Button onClick={() => navigate("/dashboard")}>
                            Back to Dashboard
                        </Button>
                    }
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Management</h1>
                        <p className="text-gray-600">Manage and confirm customer orders</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/dashboard")}>
                        Back to Dashboard
                    </Button>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterStatus === "all"
                                ? "bg-purple-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        All ({orders.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("pending")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterStatus === "pending"
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Pending ({orders.filter(o => o.status === "pending").length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("confirmed")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterStatus === "confirmed"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Confirmed ({orders.filter(o => o.status === "confirmed").length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("shipped")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterStatus === "shipped"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Shipped ({orders.filter(o => o.status === "shipped").length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("delivered")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterStatus === "delivered"
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Delivered ({orders.filter(o => o.status === "delivered").length})
                    </button>
                    <button
                        onClick={() => setFilterStatus("cancelled")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filterStatus === "cancelled"
                                ? "bg-red-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        Cancelled ({orders.filter(o => o.status === "cancelled").length})
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {filteredOrders.map((order) => (
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
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">
                                            Customer: <span className="font-semibold text-gray-900">{order.user.name}</span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Email: <span className="font-semibold text-gray-900">{order.user.email}</span>
                                        </p>
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
                            <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                            <div className="space-y-3 mb-4">
                                {order.items.map((item, index) => {
                                    const productName = item.product?.name || "Product Unavailable"
                                    const productImage = item.product?.images?.[0] || "/placeholder.png"

                                    return (
                                        <div key={item._id || index} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
                                            <img
                                                src={productImage}
                                                alt={productName}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/placeholder.png"
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h5 className="font-semibold text-gray-900">{productName}</h5>
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
                                {order.status === "pending" && (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => setShowConfirmModal(order._id)}
                                        isLoading={confirmingOrder === order._id}
                                    >
                                        Confirm Order
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirm Order Modal */}
            {showConfirmModal && (
                <Modal
                    isOpen={!!showConfirmModal}
                    onClose={() => setShowConfirmModal(null)}
                    title="Confirm Order"
                    size="sm"
                >
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> Confirming this order will change its status from "Pending" to "Confirmed". The customer will be notified of the confirmation.
                            </p>
                        </div>
                        <p className="text-gray-600">
                            Are you sure you want to confirm this order?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={() => setShowConfirmModal(null)}>
                                Cancel
                            </Button>
                            <Button
                                variant="success"
                                onClick={() => handleConfirmOrder(showConfirmModal)}
                                isLoading={confirmingOrder === showConfirmModal}
                            >
                                Confirm Order
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

