"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { ProductService } from "@/src/services/productService";
import { useEffect, useState } from "react";
import { MdAdd, MdDeleteOutline, MdEdit, MdInventory } from "react-icons/md";
import Swal from "sweetalert2";
import Button from "@/src/components/general/Button";
import Modal from "@/src/components/general/Modal";
import ProductForm from "@/src/components/forms/ProductForm";
import { Product } from "@/src/interfaces";

export default function RegisterProductPage() {
    const { isAuthenticated, loading } = useAuth();
    const productService = new ProductService();
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProducts = async () => {
        try {
            const data = await productService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você não poderá reverter isso!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, deletar!",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await productService.deleteProduct(id);
                    setProducts(prev => prev.filter(p => p.id !== id));
                    Swal.fire("Deletado!", "O produto foi deletado.", "success");
                } catch (error) {
                    Swal.fire("Erro!", "Erro ao deletar produto.", "error");
                }
            }
        });
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    if (loading) return null;
    if (!isAuthenticated) return null;

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-8 min-h-screen bg-gray-50/50 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-in fly-in-bottom duration-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
                            <MdInventory size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Produtos</h1>
                            <p className="text-gray-500">Lista completa do seu inventário</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <Button
                            text="Novo Produto"
                            variant="primary"
                            className="cursor-pointer shadow-lg hover:shadow-indigo-200"
                            icon={<MdAdd size={20} />}
                            onClick={handleNew}
                        />
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <MdInventory size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
                        <p className="text-gray-500 mt-1">Cadastre produtos para começar a vender.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 delay-150">
                        {filteredProducts.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col">
                                <div className="relative h-40 bg-gray-100 rounded-xl overflow-hidden mb-4">
                                    {item.image ? (
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <MdInventory size={40} />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-bold text-gray-900 line-clamp-1" title={item.name}>{item.name}</h3>
                                    <p className="text-indigo-600 font-bold">R$ {item.price.toFixed(2)}</p>
                                </div>

                                <div className="mt-auto flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 py-2 flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer text-sm font-medium"
                                    >
                                        <MdEdit size={16} /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id!)}
                                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                        title="Excluir"
                                    >
                                        <MdDeleteOutline size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? "Editar Produto" : "Novo Produto"}
            >
                <ProductForm
                    initialData={editingProduct}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchProducts();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}