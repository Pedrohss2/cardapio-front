'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryService } from '@/src/services/categoryService';
import { useAuth } from '@/src/contexts/AuthContext';
import { Input } from '@/src/components/Input';
import Button from '@/src/components/Button';
import Swal from 'sweetalert2';
import { MdCategory } from 'react-icons/md';

export default function RegisterCategory() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const categoryService = new CategoryService();

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await categoryService.create({ name });

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Categoria cadastrada com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });

            router.push('/products');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.message || 'Erro ao cadastrar categoria'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        if (typeof window !== 'undefined') router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <MdCategory size={28} />
                            Nova Categoria
                        </h1>
                        <p className="text-indigo-100 mt-2">Organize seu cardápio com categorias.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <Input
                            label="Nome da Categoria"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Ex: Lanches, Bebidas, Sobremesas"
                        />

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                            <Button
                                text="Cancelar"
                                variant="secondary"
                                className='cursor-pointer'

                                onClick={() => router.back()}
                            />
                            <Button
                                text="Salvar Categoria"
                                className='cursor-pointer'
                                type="submit"
                                isLoading={isLoading}
                                variant="primary"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
