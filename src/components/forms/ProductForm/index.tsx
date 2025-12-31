"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { ProductService } from "@/src/services/productService";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Button from "../../general/Button";
import { Input } from "../../general/Input";
import { Category, Product } from "../../../interfaces";
import { CategoryService } from "@/src/services/categoryService";

interface ProductFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: Product | null;
}

export default function ProductForm({ onSuccess, onCancel, initialData }: ProductFormProps) {
    const { company } = useAuth();
    const productService = new ProductService();
    const categoryService = new CategoryService();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.price?.toString() || "",
        categoryId: initialData?.categoryId || ""
    });
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await categoryService.get();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!formData.categoryId) {
            Swal.fire({
                icon: 'error',
                title: 'Atenção',
                text: 'Por favor, selecione uma categoria para o produto.'
            });
            return;
        }

        setIsLoading(true);

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("categoryId", formData.categoryId);

            if (company?.id) {
                data.append("companyId", company.id);
            }

            if (image) {
                data.append("image", image);
            }

            const successMessage = initialData?.id
                ? 'Produto atualizado com sucesso!'
                : 'Produto criado com sucesso!';

            if (initialData?.id) {
                await productService.updateProduct(initialData.id, data);
            } else {
                await productService.createProduct(data);
            }

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: successMessage,
                timer: 1500,
                showConfirmButton: false
            });

            onSuccess();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar produto';

            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Input
                    label="Nome do Produto"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Descreva seu produto..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Input
                        label="Preço (R$)"
                        name="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none"
                        required
                    >
                        <option value="">Selecione...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {initialData ? "Alterar Imagem (Opcional)" : "Imagem do Produto"}
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-200 border-dashed rounded-xl text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100 cursor-pointer
                    "
                />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Button
                    text="Cancelar"
                    className='cursor-pointer w-auto px-6'
                    variant="secondary"
                    onClick={onCancel}
                    type="button"
                />
                <Button
                    text={initialData ? "Salvar Alterações" : "Cadastrar Produto"}
                    type="submit"
                    className='cursor-pointer w-auto px-6'
                    isLoading={isLoading}
                    variant="primary"
                />
            </div>
        </form>
    );
}
