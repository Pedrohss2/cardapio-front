"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { UserService } from "@/src/services/userService";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Button from "../../general/Button";
import { Input } from "../../general/Input";

interface UserFormProps {
    initialData?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function UserForm({ initialData, onSuccess, onCancel }: UserFormProps) {
    const { company } = useAuth();
    const userService = new UserService();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        // Validação de senha apenas se estiver preenchida ou se for novo usuário
        if (!initialData && (!formData.password || !formData.confirmPassword)) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Senha é obrigatória para novos usuários.'
            });
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'As senhas não coincidem.'
            });
            return;
        }

        if (!company?.id && !initialData) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Empresa não identificada.'
            });
            return;
        }

        setIsLoading(true);

        try {
            if (initialData?.id) {
                // Modo de edição
                const userData: any = {
                    name: formData.name,
                    email: formData.email,
                };

                // Só inclui senha se foi preenchida
                if (formData.password) {
                    userData.password = formData.password;
                }

                await userService.updateUser(initialData.id, userData);

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                })
                Toast.fire({ icon: 'success', title: 'Usuário atualizado com sucesso' })

                onSuccess();
            } else {
                // Modo de criação
                const userData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    companyId: company?.id
                };

                const newUser = await userService.registerUser(userData);

                if (newUser?.id && company?.id) {
                    await userService.associateUserToCompany(newUser.id, company.id);
                }

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                })
                Toast.fire({ icon: 'success', title: 'Usuário cadastrado com sucesso' })

                onSuccess();
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : (initialData ? 'Erro ao atualizar usuário' : 'Erro ao cadastrar usuário');

            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            })
            Toast.fire({ icon: 'error', title: errorMessage })
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
                    label={initialData ? "Nova Senha (opcional)" : "Senha"}
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!initialData}
                    placeholder="••••••••"
                />

                <Input
                    label={initialData ? "Confirmar Nova Senha" : "Confirmar Senha"}
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!initialData}
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
                    text={initialData ? "Atualizar" : "Cadastrar"}
                    type="submit"
                    className='cursor-pointer w-auto px-6'
                    isLoading={isLoading}
                    variant="primary"
                />
            </div>
        </form>
    );
}
