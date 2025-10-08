"use client"

import Header from "@/src/components/Header";
import { CategoryService } from "@/src/services/categoryService";
import { ProductService } from "@/src/services/productService";
import { useEffect, useState, useRef } from "react";

export default function Register() {
    const [category, setCategories] = useState<any[]>([])
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'product' | 'category'>('product');
    const [editingCategory, setEditingCategory] = useState<{ id: string, name: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formProduct, setFormProduct] = useState({
        name: "",
        description: "",
        imagem: "",
        price: "",
        category: "",
    });

    const [formCategory, setFormCategory] = useState({
        name: "",
    });

    const handleChangeProduct = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormProduct((prev) => ({ ...prev, [id]: value }));
    };

    const handleChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormCategory((prev) => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const service = new CategoryService();
            try {
                service.get().then((data: any) => {
                    setCategories(data)
                })
            } catch (error: any) {
                console.log(error)
            }
        }
        fetchCategories()
    }, [])


    const submitCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        const categoryData = {
            name: formCategory.name,
        };
        if (categoryData.name === '') {
            alert('Por favor, preencha um valor no campo de nome da categoria.');
            return;
        }

        const service = new CategoryService();

        try {
            if (editingCategory) {
                await service.update(editingCategory.id, categoryData);
                setEditingCategory(null);
            } else {
                await service.create(categoryData);
            }
            setFormCategory({
                name: "",
            });

            const updatedCategories = await service.get();
            setCategories(updatedCategories);
        } catch (error) {
            console.log("Error", error)
        }
    }

    const submitProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            name: formProduct.name,
            description: formProduct.description,
            price: parseFloat(formProduct.price) || 0,
            categoryId: formProduct.category,
        };


        const service = new ProductService();

        try {
            const response = await service.createProduct(productData, image || undefined);
            setFormProduct({
                name: "",
                description: "",
                imagem: "",
                price: "",
                category: "",
            });
            setImage(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    const handleEditCategory = (cat: { id: string, name: string }) => {
        setEditingCategory(cat);
        setFormCategory({
            name: cat.name,
        });
    }

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
            try {
                const service = new CategoryService();
                await service.deleteCategory(id);

                const updatedCategories = await service.get();
                setCategories(updatedCategories);
            } catch (error) {
                console.log("Error deleting category", error);
                alert("Erro ao excluir categoria");
            }
        }
    }

    const cancelEdit = () => {
        setEditingCategory(null);
        setFormCategory({
            name: "",
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br mt-10 from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Header />
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="bg-indigo-600 py-6 px-8 text-center">
                    <h1 className="text-3xl font-bold text-white">Cadastrar</h1>
                    <p className="text-indigo-200 mt-2">Adicionar novos produtos e categorias</p>
                </div>

                <div className="flex border-b">
                    <button
                        className={`flex-1 py-4 font-medium ${activeTab === 'product' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('product')}
                    >
                        Produto
                    </button>
                    <button
                        className={`flex-1 py-4 font-medium ${activeTab === 'category' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('category')}
                    >
                        Categoria
                    </button>
                </div>

                <div className="py-6 px-8">
                    {activeTab === 'product' && (
                        <form onSubmit={submitProduct}>
                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Produto
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formProduct.name}
                                    onChange={handleChangeProduct}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Descrição
                                </label>
                                <input
                                    id="description"
                                    type="text"
                                    value={formProduct.description}
                                    onChange={handleChangeProduct}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="Enter product description"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                    Categoria
                                </label>
                                <select
                                    id="category"
                                    value={formProduct.category}
                                    onChange={handleChangeProduct}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                >
                                    <option value="">Select a category</option>
                                    {
                                        category.map((valor) => (
                                            <option key={valor.id} value={valor.id}>{valor.name}</option>
                                        ))
                                    }

                                </select>
                            </div>

                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                    Preço (R$)
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formProduct.price}
                                    onChange={handleChangeProduct}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Imagem do Produto
                                </label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    value={formProduct.imagem}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                {!imagePreview ? (
                                    <div
                                        onClick={triggerFileInput}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 transition"
                                    >
                                        <div className="text-indigo-600 mx-auto mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600">Clique para selecionar uma imagem</p>
                                        <p className="text-gray-400 text-sm mt-1">PNG, JPG, GIF até 10MB</p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="rounded-lg w-full h-48 object-cover border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            >
                                Registrar produto
                            </button>
                        </form>
                    )}

                    {activeTab === 'category' && (
                        <form onSubmit={submitCategory}>
                            <div className="mb-5">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryName">
                                    {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formCategory.name}
                                    onChange={handleChangeCategory}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="Nome da categoria"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 hover:scale-105 hover:cursor-pointer hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                                >
                                    {editingCategory ? "Atualizar" : "Registrar"} categoria
                                </button>
                                {editingCategory && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Categorias</h3>
                                <div className="border rounded-lg">
                                    {category.length > 0 ? (
                                        <ul className="divide-y">
                                            {category.map((cat) => (
                                                <li key={cat.id} className="p-4 flex justify-between items-center hover:bg-gray-100">
                                                    <span className="font-medium">{cat.name}</span>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="text-indigo-600 hover:text-indigo-800 hover:cursor-pointer mr-3"
                                                            onClick={() => handleEditCategory(cat)}
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                                                            onClick={() => handleDeleteCategory(cat.id)}
                                                        >
                                                            Excluir
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="p-4 text-gray-500 text-center">Nenhuma categoria cadastrada</p>
                                    )}
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}