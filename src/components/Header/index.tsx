"use client"

import { useAuth } from "@/src/contexts/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
    const { isAuthenticated } = useAuth()
    const pathname = usePathname();

    return (
        <header className="fixed top-0 w-full z-50 bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">
                        <Link href="/">
                            Cardápio Digital
                        </Link>
                    </div>

                    {isAuthenticated && pathname !== "/register" && (
                        <Link href="/register">Registrar um produto</Link>
                    )}

                    {isAuthenticated && (
                        <Link href="/products">Produtos</Link>
                    )}
                </div>
            </div>
        </header>
    )

}