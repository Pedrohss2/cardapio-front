'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserService } from '@/src/services/userService';
import { User } from '@/src/interfaces';
import { useAuth } from '@/src/contexts/AuthContext';
import { Input } from '@/src/components/Input';
import Button from '@/src/components/Button';
import Swal from 'sweetalert2';
import { MdPersonAdd } from 'react-icons/md';

export default function RegisterUser() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const userService = new UserService();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({ icon: 'error', title: 'Erro', text: 'As senhas não coincidem.' });
            return;
        }

        setIsLoading(true);

        try {
            const userData: User = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            await userService.registerUser(userData);

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Usuário cadastrado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });

            setFormData({ name: '', email: '', password: '', confirmPassword: '' });

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.message || 'Erro ao cadastrar usuário'
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
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <MdPersonAdd size={28} />
                            Novo Usuário (Funcionário)
                        </h1>
                        <p className="text-indigo-100 mt-2">Cadastre novos usuários para acessar o sistema.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <Input
                            label="Nome Completo"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Nome do funcionário"
                        />

                        <Input
                            label="Email de Acesso"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="funcionario@empresa.com"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Senha"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />

                            <Input
                                label="Confirmar Senha"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                            <Button
                                text="Cancelar"
                                className='cursor-pointer'
                                variant="secondary"
                                onClick={() => router.back()}
                            />
                            <Button
                                text="Cadastrar Usuário"
                                type="submit"
                                className='cursor-pointer'
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
