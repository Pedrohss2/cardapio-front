'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { ProductService } from '@/src/services/productService';
import { CategoryService } from '@/src/services/categoryService';
import { Product, Category } from '@/src/interfaces';
import { MdAttachMoney, MdCategory, MdInventory, MdTrendingUp } from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const { isAuthenticated, user, company } = useAuth();
    const router = useRouter();
    const productService = new ProductService();
    const categoryService = new CategoryService();

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchData();
    }, [isAuthenticated]);

    const fetchData = async () => {
        try {
            const [productsData, categoriesData] = await Promise.all([
                productService.getProducts(),
                categoryService.get()
            ]);
            setProducts(productsData || []);
            setCategories(categoriesData || []);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalValue = products.reduce((acc, curr) => acc + Number(curr.price), 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500 mt-1">Visão geral da sua empresa {company?.name ? `"${company.name}"` : ''}</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total de Produtos</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</h3>
                            </div>
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                <MdInventory size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Categorias</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalCategories}</h3>
                            </div>
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                <MdCategory size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Valor em Produtos</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalValue)}</h3>
                            </div>
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                <MdAttachMoney size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Preço Médio</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(averagePrice)}</h3>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <MdTrendingUp size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-semibold text-gray-800">Produtos Recentes</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-6 py-3">Produto</th>
                                    <th className="px-6 py-3">Categoria</th>
                                    <th className="px-6 py-3">Preço</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.slice(0, 5).map((product) => {
                                    const catName = categories.find(c => c.id === product.categoryId)?.name || 'N/A';
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                                {product.image && (
                                                    <img src={`http://localhost:3000/product/image/${product.image}`} alt="" className="w-8 h-8 rounded object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                )}
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4">{catName}</td>
                                            <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                                        </tr>
                                    );
                                })}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-400">Nenhum produto cadastrado</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
