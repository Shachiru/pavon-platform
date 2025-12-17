import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Product } from "../types"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
    withCredentials: true,
})

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true)
            const response = await api.get("/products")
            setProducts(response.data.data.products)
            setError(null)
        } catch (err) {
            setError("Failed to load products")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const deleteProduct = async (productId: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return
        }

        try {
            setDeleteLoading(productId)
            await api.delete(`/products/${productId}`)
            // Remove product from state
            setProducts(prev => prev.filter(p => p._id !== productId))
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete product")
            console.error(err)
        } finally {
            setDeleteLoading(null)
        }
    }

    return {
        products,
        loading,
        error,
        deleteLoading,
        deleteProduct,
        refreshProducts: fetchProducts
    }
}
