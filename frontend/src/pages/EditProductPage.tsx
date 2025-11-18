"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
    withCredentials: true,
})

export const EditProductPage = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        images: [""],
        specifications: {
            processor: "",
            ram: "",
            storage: "",
            display: "",
            battery: "",
            camera: "",
            os: "",
            color: "",
            warranty: "",
        },
        rating: "0",
        reviewCount: "0",
        featured: false,
        discount: "0",
    })

    // Redirect if not admin
    if (!user || user.role !== "admin") {
        navigate("/")
        return null
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setFetchLoading(true)
                const response = await api.get(`/products/${id}`)
                const product = response.data.data.product

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price?.toString() || "",
                    category: product.category || "",
                    brand: product.brand || "",
                    stock: product.stock?.toString() || "",
                    images: product.images && product.images.length > 0 ? product.images : [""],
                    specifications: {
                        processor: product.specifications?.processor || "",
                        ram: product.specifications?.ram || "",
                        storage: product.specifications?.storage || "",
                        display: product.specifications?.display || "",
                        battery: product.specifications?.battery || "",
                        camera: product.specifications?.camera || "",
                        os: product.specifications?.os || "",
                        color: product.specifications?.color || "",
                        warranty: product.specifications?.warranty || "",
                    },
                    rating: product.rating?.toString() || "0",
                    reviewCount: product.reviewCount?.toString() || "0",
                    featured: product.featured || false,
                    discount: product.discount?.toString() || "0",
                })
                setError(null)
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load product")
                console.error(err)
            } finally {
                setFetchLoading(false)
            }
        }

        if (id) {
            fetchProduct()
        }
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        if (type === "checkbox") {
            const target = e.target as HTMLInputElement
            setFormData((prev) => ({ ...prev, [name]: target.checked }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSpecificationChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [field]: value,
            },
        }))
    }

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images]
        newImages[index] = value
        setFormData((prev) => ({ ...prev, images: newImages }))
    }

    const addImageField = () => {
        setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }))
    }

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index)
        setFormData((prev) => ({ ...prev, images: newImages.length > 0 ? newImages : [""] }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            // Filter out empty specification fields
            const specs: any = {}
            Object.entries(formData.specifications).forEach(([key, value]) => {
                if (value.trim() !== "") {
                    specs[key] = value
                }
            })

            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                brand: formData.brand,
                stock: parseInt(formData.stock),
                images: formData.images.filter((img) => img.trim() !== ""),
                specifications: specs,
                rating: parseFloat(formData.rating),
                reviewCount: parseInt(formData.reviewCount),
                featured: formData.featured,
                discount: parseFloat(formData.discount),
            }

            await api.put(`/products/${id}`, productData)
            setSuccess(true)

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/home")
            }, 2000)
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update product")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (fetchLoading) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading product...</p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center text-purple-600 hover:text-purple-700 font-medium mb-4"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Products
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                <p className="mt-2 text-gray-600">Update product details</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    Product updated successfully! Redirecting...
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
                {/* Basic Information */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Basic Information
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter product name"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter product description"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select a category</option>
                                    <option value="Phones">Phones</option>
                                    <option value="Laptops">Laptops</option>
                                    <option value="Tablets">Tablets</option>
                                    <option value="Smartwatches">Smartwatches</option>
                                    <option value="Headphones">Headphones</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                                    Brand *
                                </label>
                                <input
                                    type="text"
                                    id="brand"
                                    name="brand"
                                    required
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Enter brand name"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Pricing & Stock
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Price ($) *
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                id="discount"
                                name="discount"
                                min="0"
                                max="100"
                                step="0.01"
                                value={formData.discount}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Product Images
                    </h2>

                    <div className="space-y-3">
                        {formData.images.map((image, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="url"
                                    value={image}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    placeholder="Enter image URL"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {formData.images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImageField(index)}
                                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImageField}
                            className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                        >
                            + Add Another Image
                        </button>
                    </div>
                </div>

                {/* Device Specifications */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Device Specifications
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="processor" className="block text-sm font-medium text-gray-700 mb-2">
                                Processor
                            </label>
                            <input
                                type="text"
                                id="processor"
                                value={formData.specifications.processor}
                                onChange={(e) => handleSpecificationChange("processor", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Snapdragon 8 Gen 2"
                            />
                        </div>

                        <div>
                            <label htmlFor="ram" className="block text-sm font-medium text-gray-700 mb-2">
                                RAM
                            </label>
                            <input
                                type="text"
                                id="ram"
                                value={formData.specifications.ram}
                                onChange={(e) => handleSpecificationChange("ram", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 8GB"
                            />
                        </div>

                        <div>
                            <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-2">
                                Storage
                            </label>
                            <input
                                type="text"
                                id="storage"
                                value={formData.specifications.storage}
                                onChange={(e) => handleSpecificationChange("storage", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 256GB"
                            />
                        </div>

                        <div>
                            <label htmlFor="display" className="block text-sm font-medium text-gray-700 mb-2">
                                Display
                            </label>
                            <input
                                type="text"
                                id="display"
                                value={formData.specifications.display}
                                onChange={(e) => handleSpecificationChange("display", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 6.7 inch AMOLED"
                            />
                        </div>

                        <div>
                            <label htmlFor="battery" className="block text-sm font-medium text-gray-700 mb-2">
                                Battery
                            </label>
                            <input
                                type="text"
                                id="battery"
                                value={formData.specifications.battery}
                                onChange={(e) => handleSpecificationChange("battery", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 5000mAh"
                            />
                        </div>

                        <div>
                            <label htmlFor="camera" className="block text-sm font-medium text-gray-700 mb-2">
                                Camera
                            </label>
                            <input
                                type="text"
                                id="camera"
                                value={formData.specifications.camera}
                                onChange={(e) => handleSpecificationChange("camera", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 50MP + 12MP + 10MP"
                            />
                        </div>

                        <div>
                            <label htmlFor="os" className="block text-sm font-medium text-gray-700 mb-2">
                                Operating System
                            </label>
                            <input
                                type="text"
                                id="os"
                                value={formData.specifications.os}
                                onChange={(e) => handleSpecificationChange("os", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Android 14, iOS 17"
                            />
                        </div>

                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                                Color
                            </label>
                            <input
                                type="text"
                                id="color"
                                value={formData.specifications.color}
                                onChange={(e) => handleSpecificationChange("color", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Midnight Black"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="warranty" className="block text-sm font-medium text-gray-700 mb-2">
                                Warranty
                            </label>
                            <input
                                type="text"
                                id="warranty"
                                value={formData.specifications.warranty}
                                onChange={(e) => handleSpecificationChange("warranty", e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 1 Year Manufacturer Warranty"
                            />
                        </div>
                    </div>
                </div>

                {/* Rating & Reviews */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        Rating & Reviews
                    </h2>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                                    Initial Rating
                                </label>
                                <input
                                    type="number"
                                    id="rating"
                                    name="rating"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="reviewCount" className="block text-sm font-medium text-gray-700 mb-2">
                                    Review Count
                                </label>
                                <input
                                    type="number"
                                    id="reviewCount"
                                    name="reviewCount"
                                    min="0"
                                    value={formData.reviewCount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="featured"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="featured" className="ml-3 text-sm font-medium text-gray-700">
                                Mark as Featured Product
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                            loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating Product...
                            </span>
                        ) : (
                            "Update Product"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                        className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    )
}

