import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Order, OrderStatus } from "../types"
import axios from "axios"
import {Badge, Button, Modal, Toast} from "../components/ui";

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

const orderStatusSteps: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"]

export const OrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
    const [cancellingOrder, setCancellingOrder] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)

    useEffect(() => {
        fetchOrder()
    }, [id])

    const fetchOrder = async () => {
        try {
            setLoading(true)
            const response = await api.get(`/orders/${id}`)
            setOrder(response.data.data.order)
        } catch (error: any) {
            setToast({
                message: error.response?.data?.message || "Failed to fetch order",
                type: "error"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCancelOrder = async () => {
        if (!order) return

        setCancellingOrder(true)
        try {
            await api.post(`/orders/${order._id}/cancel`)
            setToast({ message: "Order cancelled successfully! Stock has been restored.", type: "success" })
            setShowCancelModal(false)
            await fetchOrder()
        } catch (error: any) {
            setToast({
                message: error.response?.data?.message || "Failed to cancel order",
                type: "error"
            })
        } finally {
            setCancellingOrder(false)
        }
    }

    const canCancelOrder = (status: OrderStatus) => {
        return status === "pending" || status === "confirmed"
    }

    const getStatusStepIndex = (status: OrderStatus) => {
        if (status === "cancelled") return -1
        return orderStatusSteps.indexOf(status)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
                <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
            </div>
        )
    }

    const currentStepIndex = getStatusStepIndex(order.status)

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Back Button */}
            <button
                onClick={() => navigate("/orders")}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Orders
            </button>

            {/* Order Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Order #{order._id.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-purple-100">
                            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-purple-100 mb-1">Total Amount</p>
                        <p className="text-4xl font-bold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadgeVariant(order.status)} className="text-lg px-4 py-2">
                        {order.status.toUpperCase()}
                    </Badge>
                    {canCancelOrder(order.status) && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setShowCancelModal(true)}
                            isLoading={cancellingOrder}
                        >
                            Cancel Order
                        </Button>
                    )}
                </div>
            </div>

            {/* Order Status Timeline */}
            {order.status !== "cancelled" && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Progress</h2>
                    <div className="relative">
                        <div className="flex justify-between items-center">
                            {orderStatusSteps.map((step, index) => (
                                <div key={step} className="flex-1 flex flex-col items-center relative">
                                    {/* Connector Line */}
                                    {index < orderStatusSteps.length - 1 && (
                                        <div
                                            className={`absolute top-5 left-1/2 w-full h-1 ${
                                                index < currentStepIndex
                                                    ? "bg-green-500"
                                                    : "bg-gray-200"
                                            }`}
                                            style={{ zIndex: 0 }}
                                        />
                                    )}

                                    {/* Step Circle */}
                                    <div
                                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                                            index <= currentStepIndex
                                                ? "bg-green-500 text-white shadow-lg"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                    >
                                        {index < currentStepIndex ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </div>

                                    {/* Step Label */}
                                    <p
                                        className={`mt-2 text-sm font-semibold text-center ${
                                            index <= currentStepIndex
                                                ? "text-gray-900"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {step.charAt(0).toUpperCase() + step.slice(1)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Cancelled Status */}
            {order.status === "cancelled" && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-bold text-red-900 mb-1">Order Cancelled</h3>
                            <p className="text-red-700">
                                This order was cancelled on {new Date(order.updatedAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}. Product stock has been automatically restored.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {order.items.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="flex gap-6 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <img
                                    src={item.product.images[0] || "/placeholder.png"}
                                    alt={item.product.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {item.product.category} • {item.product.brand}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm text-gray-600">
                                            Quantity: <span className="font-semibold text-gray-900">{item.quantity}</span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Price: <span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                                    <p className="text-xl font-bold text-purple-600">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-sm p-6 border border-purple-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-2xl font-bold text-gray-900">
                            <span>Total</span>
                            <span className="text-purple-600">${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-800">
                        This order was processed using secure transactional operations to ensure data consistency.
                        Product stock was atomically updated when the order was placed.
                    </p>
                </div>
            </div>

            {/* Cancel Order Modal */}
            <Modal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                title="Cancel Order"
                size="sm"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>Important:</strong> Cancelling this order will restore the product stock automatically using a secure transaction.
                        </p>
                    </div>
                    <p className="text-gray-600">
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
                            Keep Order
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleCancelOrder}
                            isLoading={cancellingOrder}
                        >
                            Cancel Order
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

