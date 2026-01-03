"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { CategoryService } from "@/src/services/categoryService";
import { useEffect, useState } from "react";
import { MdAdd, MdCategory, MdDeleteOutline, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import Button from "@/src/components/general/Button";
import Modal from "@/src/components/general/modals/general";
import CategoryForm from "@/src/components/forms/CategoryForm";
import ConfirmDeleteModal from "@/src/components/general/modals/confirmDeleteModal.tsx";
import { Category } from "@/src/interfaces";

export default function RegisterCategory() {
    const { isAuthenticated, loading } = useAuth();
    const categoryService = new CategoryService();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.get();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (category: Category) => {
        setCategoryToDelete({ id: category.id!, name: category.name });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;

        setIsDeleting(true);
        try {
            await categoryService.delete(categoryToDelete.id);
            setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));

            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            })
            Toast.fire({ icon: 'success', title: 'Categoria removida com sucesso' })

            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);

        } catch (error) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            })

            Toast.fire({ icon: 'error', title: 'Erro ao remover categoria' })
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    if (loading) return null;
    if (!isAuthenticated) return null;

    return (
        <div className="pt-8 min-h-screen bg-gray-50/50 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">


                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-in fly-in-bottom duration-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
                            <MdCategory size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
                            <p className="text-gray-500">Organize seus produtos em categorias</p>
                        </div>
                    </div>
                    <Button
                        text="Nova Categoria"
                        variant="primary"
                        className="w-full md:w-auto cursor-pointer shadow-lg hover:shadow-indigo-200"
                        icon={<MdAdd size={20} />}
                        onClick={handleNew}
                    />
                </div>

                {categories.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <MdCategory size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Nenhuma categoria encontrada</h3>
                        <p className="text-gray-500 mt-1">Cadastre categorias para organizar seu cardápio.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 delay-150">
                        {categories.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                        title="Editar"
                                    >
                                        <MdEdit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
                title={editingCategory ? "Editar Categoria" : "Nova Categoria"}
            >
                <CategoryForm
                    initialData={editingCategory}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchCategories();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setCategoryToDelete(null);
                }}
                onConfirm={confirmDelete}
                itemName={categoryToDelete?.name}
                description="Você não poderá reverter isso!"
                isLoading={isDeleting}
            />
        </div>
    );
}
