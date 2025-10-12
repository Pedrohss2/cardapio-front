"use client"

import { useAuth } from "@/src/contexts/AuthContext"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MdLogout } from "react-icons/md"

export default function Header() {
    const { isAuthenticated, logout } = useAuth()
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/products");
    };

    return (
        <header className="fixed top-0 text-2xl w-full z-50 bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center ">
                    <div className="text-xl font-bold text-gray-800">
                        <Link href="/">
                            Cardápio Digital
                        </Link>
                    </div>
                    <div className="flex  items-center justify-between gap-10 uppercase">

                        {!isAuthenticated && (
                            <div className="flex items-center gap-2 hover:cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md">
                                <Link href="/login">Login</Link>
                            </div>
                        )}

                        {isAuthenticated && (
                            <div className="hover:text-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105">
                                <Link href="/products">Produtos</Link>
                            </div>
                        )}

                        {isAuthenticated && pathname !== "/register" && (
                            <div className=" hover:text-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 ">
                                <Link href="/register">Registrar</Link>
                            </div>
                        )}

                        {isAuthenticated && (
                            <div className="flex items-center gap-2 hover:cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-md">
                                <span>
                                    <MdLogout size={25} color="black" />
                                </span>
                                <button className=" text-gray-800" onClick={handleLogout}>Sair</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}