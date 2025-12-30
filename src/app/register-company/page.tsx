'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompanyService, CreateCompanyDto } from '@/src/services/companyService';
import { Input } from '@/src/components/Input';
import Button from '@/src/components/Button';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useAuth } from '@/src/contexts/AuthContext';
import { UserService } from '@/src/services/userService';
import { jwtDecode } from 'jwt-decode';

export default function RegisterCompany() {
    const router = useRouter();
    const { login } = useAuth();
    const companyService = new CompanyService();
    const userService = new UserService();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<CreateCompanyDto>({
        name: '',
        address: '',
        phone: '',
        email: '',
        ownerName: '',
        ownerPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await companyService.createCompany(formData);

            if (formData.email && formData.ownerPassword) {
                const loginResponse = await userService.loginUser({
                    email: formData.email,
                    password: formData.ownerPassword
                });

                if (loginResponse.access_token) {
                    const token = loginResponse.access_token;
                    const decoded: any = jwtDecode(token);

                    const companies = await userService.getUserCompanies(decoded.sub);

                    const userCompany = companies.length > 0 ? companies[0].company : null;

                    login(token, userCompany);

                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: 'Empresa cadastrada com sucesso!',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    router.push('/products');
                    return;
                }
            }

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Empresa cadastrada! Faça login para continuar.',
            });
            router.push('/login');

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.message || 'Erro ao cadastrar empresa'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Side - Hero */}
            <div className="hidden md:flex flex-col justify-center p-12 w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                <h1 className="text-5xl font-bold mb-6">Comece sua jornada digital</h1>
                <p className="text-xl opacity-90 mb-8 max-w-md">
                    Cadastre sua empresa e transforme a maneira como você gerencia seu negócio. Simples, rápido e eficiente.
                </p>
                <div className="glass p-6 rounded-xl max-w-sm">
                    <p className="font-medium italic">"A melhor decisão que tomamos para o nosso restaurante."</p>
                    <p className="mt-4 text-sm opacity-75">— Maria Silva, Cantina Italiana</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
                <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Cadastrar Empresa</h2>
                        <p className="mt-2 text-gray-600">Preencha os dados abaixo para começar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Dados da Empresa</h3>
                            <Input
                                label="Nome da Empresa"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Minha Loja"
                            />
                            <Input
                                label="Endereço"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="Rua, Número, Bairro"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Telefone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="(11) 99999-9999"
                                />
                                <Input
                                    label="Email (Empresarial)"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="contato@empresa.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Dados do Proprietário <span className="text-sm font-normal text-gray-500">(Opcional)</span></h3>
                            <Input
                                label="Nome do Proprietário"
                                name="ownerName"
                                value={formData.ownerName || ''}
                                onChange={handleChange}
                                placeholder="Seu nome completo"
                            />
                            <Input
                                label="Senha de Acesso"
                                name="ownerPassword"
                                type="password"
                                value={formData.ownerPassword || ''}
                                onChange={handleChange}
                                placeholder="Crie uma senha segura"
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                text={isLoading ? "Cadastrando..." : "Finalizar Cadastro"}
                                type="submit"
                                variant="primary"
                                fullWidth
                                isLoading={isLoading}
                            />
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Já tem uma conta?{' '}
                                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Fazer Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
