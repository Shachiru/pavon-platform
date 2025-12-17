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
