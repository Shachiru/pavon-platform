import React from "react"
import { clsx } from "clsx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "success" | "outline" | "ghost"
    size?: "sm" | "md" | "lg"
    isLoading?: boolean
    children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    size = "md",
    isLoading = false,
    className,
    children,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
        primary: "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-xl",
        secondary: "bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-700 hover:to-gray-600 shadow-lg hover:shadow-xl",
        danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl",
        success: "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-lg hover:shadow-xl",
        outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-50",
        ghost: "text-gray-700 hover:bg-gray-100",
    }

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    }

    return (
        <button
            className={clsx(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    )
}

