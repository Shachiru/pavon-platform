import React from "react"

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description: string
    action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {icon && (
                <div className="text-gray-300 mb-4">
                    {icon}
                </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">{description}</p>
            {action && <div>{action}</div>}
        </div>
    )
}

