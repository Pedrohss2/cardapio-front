"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { User } from "@/src/interfaces";
import { UserService } from "@/src/services/userService";

const registerSchema = z
    .object({
        name: z.string().min(3, { message: "Nome é obrigatório" }),
        email: z.string().min(4, { message: "Email deve ter no minimo 4 caraceres" }),
        password: z.string().min(6, { message: "Senha deve ter ao menos 6 caracteres" }),
        confirmPassword: z.string().min(6, { message: "Confirmação de senha é obrigatória" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "As senhas não conferem",
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        const payload: User = { name: data.name, email: data.email, password: data.password };

        try {
            const service = new UserService();
            await service.registerUser(payload);

            Swal.fire(
                {
                    icon: "success",
                    title: "Usuário criado",
                    text: "Registro realizado com sucesso."
                });

            router.push("/login");
        } catch (err: any) {
            Swal.fire({ icon: "error", title: "Erro", text: "Falha ao registrar usuario." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6  bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-semibold mb-4 text-center">Criar conta</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <input {...register("name")} className="w-full border rounded px-3 py-2" />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input type="email" {...register("email")} className="w-full border rounded px-3 py-2" />
                    {errors.email &&
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Senha</label>
                    <input type="password" {...register("password")} className="w-full border rounded px-3 py-2" />
                    {errors.password &&
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Confirmar senha</label>
                    <input type="password" {...register("confirmPassword")} className="w-full border rounded px-3 py-2" />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border hover:cursor-pointer hover:scale-105 border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? "Cadastrando..." : "Criar conta"}
                    </button>
                </div>

                <div className="text-center text-sm">
                    <a href="/login" className="text-blue-600 hover:underline">
                        Já tem conta? Faça login
                    </a>
                </div>
            </form>
        </div>
    );
}