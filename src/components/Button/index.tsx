import Link from "next/link"

interface ButtonProps {
    text: string
    link?: any
    onClick?: () => void
}


export default function Button({ text, link, onClick }: ButtonProps) {

    return (
        <div className="flex justify-center">
            <div className="relative group">
                <Link
                    href={link || '#'}
                    onClick={onClick}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md"
                >
                    <span className="relative z-10">{text}</span>
                </Link>
            </div>
        </div>
    )
}