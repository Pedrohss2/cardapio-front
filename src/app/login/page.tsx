'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/src/interfaces';
import { UserService } from '@/src/services/userService';
import { useAuth } from '@/src/contexts/AuthContext';
import Button from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

export default function AuthForm() {
    const router = useRouter();
    const userService = new UserService();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = { email, password };
            const response = await userService.loginUser(userData);

            if (response.access_token) {
                const token = response.access_token;
                const decoded: any = jwtDecode(token);

                // Fetch companies
                const companies = await userService.getUserCompanies(decoded.sub);

                // Default to first company if available
                // Note: The backend logic for 'activeCompanyId' prioritizes 'companyId' passed in login or first linked.
                // Since this login form doesn't ask for companyId, backend uses first linked.
                // We mirror this on frontend state.
                const userCompany = companies.length > 0 ? companies[0].company : null;

                login(token, userCompany);

                Swal.fire({
                    icon: 'success',
                    title: 'Bem-vindo!',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });

                router.push('/products');
            }
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Erro de Autenticação",
                text: "Email ou senha incorretos."
            });
            console.error('Auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">

                <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-10 text-white relative overflow-hidden">
                    <div className="z-10 text-center">
                        <h2 className="text-3xl font-bold mb-4">Bem-vindo de volta!</h2>
                        <p className="opacity-90 max-w-xs mx-auto mb-8">
                            Acesse seu painel para gerenciar produtos, pedidos e muito mais.
                        </p>
                        <div className="glass p-6 rounded-xl inline-block transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <span className="text-4xl">🚀</span>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500 opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="text-center md:text-left mb-10">
                        <h2 className="text-2xl font-bold text-gray-900">Login no Sistema</h2>
                        <p className="text-sm text-gray-500 mt-2">Entre com suas credenciais abaixo.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
                        />

                        <Input
                            label="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />

                        <Button
                            text="Entrar"
                            type="submit"
                            fullWidth
                            isLoading={loading}
                        />

                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Ainda não tem uma empresa?{' '}
                                <Link href="/register-company" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Cadastre-se aqui
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}