import React from "react"
import { clsx } from "clsx"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    size?: "sm" | "md" | "lg" | "xl"
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md"
}) => {
    if (!isOpen) return null

    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className={clsx(
                    "bg-white rounded-2xl shadow-2xl w-full animate-scale-in",
                    sizes[size]
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                    >
                        ×
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}

