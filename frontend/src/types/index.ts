export interface User {
    id: string
    name: string
    email: string
    role: "user" | "admin"
    avatar?: string
}

export interface Product {
    _id: string
    name: string
    description: string
    price: number
    category: string
    brand: string
    stock: number
    images: string[]
    rating: number
    reviewCount: number
    featured: boolean
    discount: number
}

export interface CartItem {
    _id?: string
    product: Product
    quantity: number
}

export interface Cart {
    _id: string
    user: string
    items: CartItem[]
    createdAt: string
    updatedAt: string
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

export interface OrderItem {
    product: Product
    quantity: number
    price: number
    _id?: string
}

export interface Order {
    _id: string
    user: string
    items: OrderItem[]
    totalAmount: number
    status: OrderStatus
    createdAt: string
    updatedAt: string
}

export interface ApiResponse<T> {
    status: "success" | "error"
    message: string
    data?: T
}

