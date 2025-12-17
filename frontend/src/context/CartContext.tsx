import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"
import { Cart, Product } from "../types"

interface CartContextType {
    cart: Cart | null
    loading: boolean
    error: string | null
    itemCount: number
    totalAmount: number
    addToCart: (productId: string, quantity: number) => Promise<void>
    updateCartItem: (itemId: string, quantity: number) => Promise<void>
    removeFromCart: (itemId: string) => Promise<void>
    clearCart: () => Promise<void>
    refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
    withCredentials: true,
})

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const refreshCart = async () => {
        try {
            setLoading(true)
            const response = await api.get("/cart")
            setCart(response.data.data.cart)
            setError(null)
        } catch (err: any) {
            if (err.response?.status !== 404) {
                setError(err.response?.data?.message || "Failed to fetch cart")
            }
            setCart(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshCart()
    }, [])

    const addToCart = async (productId: string, quantity: number) => {
        try {
            setError(null)
            const response = await api.post("/cart/add", { productId, quantity })
            setCart(response.data.data.cart)
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to add to cart"
            setError(message)
            throw new Error(message)
        }
    }

    const updateCartItem = async (itemId: string, quantity: number) => {
        try {
            setError(null)
            const response = await api.patch(`/cart/item/${itemId}`, { quantity })
            setCart(response.data.data.cart)
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to update cart"
            setError(message)
            throw new Error(message)
        }
    }

    const removeFromCart = async (itemId: string) => {
        try {
            setError(null)
            const response = await api.delete(`/cart/item/${itemId}`)
            setCart(response.data.data.cart)
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to remove item"
            setError(message)
            throw new Error(message)
        }
    }

    const clearCart = async () => {
        try {
            setError(null)
            await api.delete("/cart/clear")
            setCart(null)
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to clear cart"
            setError(message)
            throw new Error(message)
        }
    }

    const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
    const totalAmount = cart?.items.reduce(
        (sum, item) => sum + (item.product.price * item.quantity),
        0
    ) || 0

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                itemCount,
                totalAmount,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within CartProvider")
    }
    return context
}

