import React from "react"
import { Product } from "../types"

interface ProductCardProps {
    product: Product
    userRole?: "user" | "admin"
    onDelete?: (id: string) => void
    onAddToCart?: (id: string) => void
    onEdit?: (id: string) => void
    isDeleting?: boolean
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    userRole,
    onDelete,
    onAddToCart,
    onEdit,
    isDeleting
}) => {
    return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Product Image */}
            <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    {product.featured && (
                        <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                            ⭐ Featured
                        </div>
                    )}
                    <div className="flex-1"></div>
                    {product.discount > 0 && (
                        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                            -{product.discount}% OFF
                        </div>
                    )}
                </div>
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white/95 px-6 py-3 rounded-full">
                            <span className="text-gray-900 text-sm font-bold">Out of Stock</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-5">
                {/* Category & Brand */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                        {product.category}
                    </span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{product.brand}</span>
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] leading-snug">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                    {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="ml-2 text-sm font-semibold text-gray-700">
                        {product.rating.toFixed(1)}
                    </span>
                    <span className="ml-1 text-xs text-gray-500">
                        ({product.reviewCount})
                    </span>
                </div>

                {/* Price & Stock */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                        {product.discount > 0 ? (
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-purple-600">
                                        ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-400 line-through">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>
                        ) : (
                            <span className="text-2xl font-bold text-gray-900">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full ${product.stock > 10
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : product.stock > 0
                                ? "bg-orange-50 text-orange-700 border border-orange-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        {product.stock > 0 ? `${product.stock} left` : "Out"}
                    </div>
                </div>

                {/* Action Buttons - Role Based */}
                {userRole === "admin" ? (
                    // Admin sees Edit and Delete buttons
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit?.(product._id)
                            }}
                            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete?.(product._id)
                            }}
                            disabled={isDeleting}
                            className="px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isDeleting ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                ) : (
                    // Customers see Add to Cart button
                    <button
                        disabled={product.stock === 0}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${product.stock > 0
                                ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 hover:shadow-xl"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddToCart?.(product._id)
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>
                )}
            </div>
        </div>
    )
}
