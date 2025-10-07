
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginUser, User } from '@/src/interfaces';
import { UserService } from '@/src/services/userService';
import { MdLogin, MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from 'react-icons/ri';

export default function AuthForm() {
    const router = useRouter();
    const userService = new UserService();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {

            const userData: User = {
                name,
                email,
                password,
            };

            await userService.loginUser(userData);

            setSuccess(true);
            router.push('/products/')

            setName('');
            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            console.error('Auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Entre em sua conta
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}
                    {success && (
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="text-sm text-green-700">{success}</div>
                        </div>
                    )}

                    <div className='flex items-center justify-center gap-2'>
                        <MdOutlineMailOutline size={30} />
                        <label htmlFor="email-address" className="sr-only">
                            <div>
                                Email
                            </div>
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Endereço e email"
                        />
                    </div>

                    <div className='flex items-center justify-center gap-2'>
                        <RiLockPasswordLine size={35} />
                        <label htmlFor="password" className="sr-only">
                            Senha
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={"current-password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border hover:cursor-pointer hover:scale-105 border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <span>Processing...</span>
                            ) : <span className='flex items-center gap-2'>
                                <MdLogin size={25} />
                                Entrar
                            </span>}
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
}