'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductService } from '@/src/services/productService';
import { CategoryService } from '@/src/services/categoryService';
import { Category, Product } from '@/src/interfaces';
import { useAuth } from '@/src/contexts/AuthContext';
import { Input } from '@/src/components/Input';
import Button from '@/src/components/Button';
import Swal from 'sweetalert2';
import { MdCloudUpload, MdClose, MdAdd } from 'react-icons/md';

export default function RegisterProduct() {
    const router = useRouter();
    const { company, isAuthenticated } = useAuth();
    const productService = new ProductService();
    const categoryService = new CategoryService();

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

    // Modal state
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        categoryId: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        loadCategories();
    }, [isAuthenticated]);

    const loadCategories = async () => {
        try {
            const data = await categoryService.get();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsCreatingCategory(true);
        try {
            const newCategory = await categoryService.create({ name: newCategoryName });
            setCategories(prev => [...prev, newCategory]);
            setFormData(prev => ({ ...prev, categoryId: newCategory.id || '' }));
            setIsCategoryModalOpen(false);
            setNewCategoryName('');
            Swal.fire({ icon: 'success', title: 'Categoria criada!', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Erro ao criar categoria' });
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company) {
            Swal.fire({ icon: 'error', title: 'Erro', text: 'Empresa não identificada.' });
            return;
        }

        setIsLoading(true);

        try {
            const productData: Product = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                categoryId: formData.categoryId,
                companyId: company.id
            };

            await productService.createProduct(productData, selectedFile);

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Produto cadastrado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });

            router.push('/products');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.message || 'Erro ao cadastrar produto'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-3xl">+</span> Novo Produto
                        </h1>
                        <p className="text-indigo-100 mt-2">Adicione itens ao seu cardápio digital</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
                                <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] transition-all
                                    ${imagePreview ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}>

                                    {imagePreview ? (
                                        <div className="relative w-full h-full flex flex-col items-center">
                                            <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg object-contain shadow-sm mb-4" />
                                            <button
                                                type="button"
                                                onClick={() => { setImagePreview(null); setSelectedFile(undefined); }}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Remover Imagem
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center text-center">
                                            <div className="bg-indigo-100 p-4 rounded-full mb-4">
                                                <MdCloudUpload className="text-indigo-600 text-3xl" />
                                            </div>
                                            <span className="text-indigo-600 font-medium text-lg">Clique para upload</span>
                                            <span className="text-gray-500 text-sm mt-2">PNG, JPG até 5MB</span>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Input
                                    label="Nome do Produto"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: X-bacon Supremo"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Preço (R$)"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        placeholder="0.00"
                                    />

                                    <div className="w-full">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">Categoria</label>
                                            <button
                                                type="button"
                                                onClick={() => setIsCategoryModalOpen(true)}
                                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                                            >
                                                <MdAdd /> Nova Categoria
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <select
                                                name="categoryId"
                                                value={formData.categoryId}
                                                onChange={handleChange}
                                                required
                                                className="appearance-none w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
                                            >
                                                <option value="">Selecione...</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id || ''}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                                        placeholder="Descreva os ingredientes e detalhes deliciosos..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                            <Button
                                text="Cancelar"
                                className='cursor-pointer'
                                variant="secondary"
                                onClick={() => router.back()}
                            />
                            <Button
                                text="Salvar Produto"
                                type="submit"
                                className='cursor-pointer'
                                isLoading={isLoading}
                                variant="primary"
                            />
                        </div>
                    </form>
                </div>
            </div>

            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                            <h3 className="font-bold text-lg">Nova Categoria</h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                                <MdClose size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCategory} className="p-6">
                            <Input
                                label="Nome"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Ex: Bebidas"
                                autoFocus
                            />
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingCategory || !newCategoryName.trim()}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {isCreatingCategory ? 'Criando...' : 'Criar Categoria'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}