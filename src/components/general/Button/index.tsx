import Link from "next/link"
import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: string
    link?: string
    isLoading?: boolean
    variant?: 'primary' | 'secondary' | 'outline'
    fullWidth?: boolean
    icon?: React.ReactNode
}

export default function Button({
    text,
    link,
    onClick,
    type = 'button',
    isLoading = false,
    variant = 'primary',
    fullWidth = false,
    className = '',
    disabled,
    icon,
    ...props
}: ButtonProps) {
    const baseClasses = "inline-flex items-center justify-center font-medium py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"

    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/30",
        secondary: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
        outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
    }

    const classes = `${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`

    const content = (
        <>
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : icon ? (
                <span className="mr-2">{icon}</span>
            ) : null}
            <span>{text}</span>
        </>
    )

    if (link) {
        return (
            <Link href={link} className={classes}>
                {content}
            </Link>
        )
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {content}
        </button>
    )
}