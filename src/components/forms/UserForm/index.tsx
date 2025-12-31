"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { UserService } from "@/src/services/userService";
import { useState } from "react";
import Swal from "sweetalert2";
import Button from "../../general/Button";
import { Input } from "../../general/Input";

interface UserFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function UserForm({ onSuccess, onCancel }: UserFormProps) {
    const { company } = useAuth();
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'As senhas não coincidem.'
            });
            return;
        }

        if (!company?.id) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Empresa não identificada.'
            });
            return;
        }

        setIsLoading(true);

        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                companyId: company.id
            };

            const newUser = await userService.registerUser(userData);

            if (newUser?.id) {
                await userService.associateUserToCompany(newUser.id, company.id);
            }

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Usuário cadastrado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });

            onSuccess();
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao cadastrar usuário';

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
        <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Button
                    text="Cancelar"
                    className='cursor-pointer w-auto px-6'
                    variant="secondary"
                    onClick={onCancel}
                    type="button"
                />

                <Button
                    text="Cadastrar"
                    type="submit"
                    className='cursor-pointer w-auto px-6'
                    isLoading={isLoading}
                    variant="primary"
                />
            </div>
        </form>
    );
}
