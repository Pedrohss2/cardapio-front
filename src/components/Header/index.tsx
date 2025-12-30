"use client"

import { useAuth } from "@/src/contexts/AuthContext"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { MdLogout, MdBusiness, MdMenu, MdClose, MdDashboard, MdInventory, MdAddBox, MdPersonAdd, MdCategory, MdSettings, MdChevronLeft, MdChevronRight } from "react-icons/md"

export default function Header() {
    const { isAuthenticated, logout, company, loading } = useAuth()
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Persist collapsed state
    useEffect(() => {
        const savedState = localStorage.getItem("sidebarCollapsed");
        if (savedState) setIsCollapsed(JSON.parse(savedState));
    }, []);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
    };

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    if (loading) return null;
    if (pathname === '/login' || pathname === '/register-company') return null;

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: <MdDashboard size={24} /> },
        { href: '/products', label: 'Produtos', icon: <MdInventory size={24} /> },
        { href: '/register-products', label: 'Novo Produto', icon: <MdAddBox size={24} /> },
        { href: '/register-user', label: 'Equipe', icon: <MdPersonAdd size={24} /> },
        { href: '/register-category', label: 'Categorias', icon: <MdCategory size={24} /> },
        { href: '/settings', label: 'Configurações', icon: <MdSettings size={24} /> },
    ];

    if (!isAuthenticated) {
        return (
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Cardápio Digital
                    </Link>
                    <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                        Login
                    </Link>
                </div>
            </header>
        )
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                data-collapsed={isCollapsed}
                className={`hidden md:flex flex-col fixed inset-y-0 left-0 bg-white border-r border-gray-100 shadow-xl z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
            >
                <div className="p-4 flex items-center justify-between border-b border-gray-50 h-16">
                    {!isCollapsed && (
                        <Link href="/dashboard" className="block text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap overflow-hidden">
                            Cardápio
                        </Link>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className={`p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
                    >
                        {isCollapsed ? <MdChevronRight size={24} /> : <MdChevronLeft size={24} />}
                    </button>
                </div>

                <div className={`px-4 py-4 ${isCollapsed ? 'px-2' : ''}`}>
                    {company && !isCollapsed && (
                        <div className="mb-6 flex items-center gap-3 p-3 bg-gray-50 rounded-xl overflow-hidden animate-in fade-in duration-300">
                            <div className="bg-white p-1.5 rounded-lg shadow-sm shrink-0">
                                <MdBusiness className="text-indigo-600" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Loja</p>
                                <p className="font-semibold text-gray-900 truncate text-sm">{company.name}</p>
                            </div>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                title={isCollapsed ? link.label : ''}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-indigo-50 text-indigo-600 shadow-sm font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                    ${isCollapsed ? 'justify-center' : ''}
                                `}
                            >
                                <span className={`transition-transform duration-200 shrink-0 ${isActive && !isCollapsed ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {link.icon}
                                </span>

                                {!isCollapsed && (
                                    <span className="whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200">
                                        {link.label}
                                    </span>
                                )}

                                {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                        {link.label}
                                    </div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center cursor-pointer gap-3 w-full px-3 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? "Sair" : ""}
                    >
                        <MdLogout size={24} />
                        {!isCollapsed && <span className="font-medium animate-in fade-in">Sair</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center shadow-sm">
                <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Cardápio
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600">
                    {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                </button>
            </header>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-6 animate-in slide-in-from-right-10 duration-200">
                    {company && (
                        <div className="mb-8 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <MdBusiness className="text-indigo-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Empresa</p>
                                <p className="font-semibold text-gray-900">{company.name}</p>
                            </div>
                        </div>
                    )}

                    <nav className="space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-colors
                                    ${pathname === link.href ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="mt-8 w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-4 text-red-600 bg-red-50 rounded-xl font-medium"
                    >
                        <MdLogout /> Sair da conta
                    </button>
                </div>
            )}
        </>
    )
}