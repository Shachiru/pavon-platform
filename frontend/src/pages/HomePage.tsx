"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { useProducts } from "../hooks/useProducts"
import { ProductCard } from "../components/ProductCard"
import { Toast } from "../components/ui/Toast"

export const HomePage = () => {
    const { products, loading, error, deleteLoading, deleteProduct } = useProducts()
    const { addToCart } = useCart()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
    const [addingToCart, setAddingToCart] = useState<string | null>(null)

    const handleAddToCart = async (productId: string) => {
        setAddingToCart(productId)
        try {
            await addToCart(productId, 1)
            setToast({ message: "Product added to cart successfully!", type: "success" })
        } catch (error: any) {
            setToast({ message: error.message || "Failed to add to cart", type: "error" })
        } finally {
            setAddingToCart(null)
        }
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
                <p className="text-lg text-gray-600">Discover amazing products at great prices</p>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-600">No products available yet.</p>
                    <p className="text-gray-500 mt-2">Check back soon for new arrivals!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            userRole={user?.role}
                            onDelete={deleteProduct}
                            onAddToCart={handleAddToCart}
                            onEdit={(id) => navigate(`/products/edit/${id}`)}
                            isDeleting={deleteLoading === product._id}
                        />
                    ))}
                </div>
            )}
        </main>
    )
}

