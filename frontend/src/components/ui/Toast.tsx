import React, { useEffect } from "react"
import { clsx } from "clsx"

interface ToastProps {
    message: string
    type?: "success" | "error" | "info" | "warning"
    onClose: () => void
    duration?: number
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = "info",
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    const types = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-blue-500 text-white",
        warning: "bg-yellow-500 text-white",
    }

    const icons = {
        success: "✓",
        error: "✕",
        info: "ℹ",
        warning: "⚠",
    }

    return (
        <div className={clsx(
            "fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl animate-slide-in-right flex items-center gap-3 min-w-[300px]",
            types[type]
        )}>
            <span className="text-2xl font-bold">{icons[type]}</span>
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="text-xl hover:opacity-70 transition-opacity">
                ×
            </button>
        </div>
    )
}

