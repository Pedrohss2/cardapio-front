"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { CategoryService } from "@/src/services/categoryService";
import { useState } from "react";
import Swal from "sweetalert2";
import Button from "../../general/Button";
import { Input } from "../../general/Input";

interface CategoryFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: { id?: string, name: string } | null;
}

export default function CategoryForm({ onSuccess, onCancel, initialData }: CategoryFormProps) {
    const { company } = useAuth();

    const categoryService = new CategoryService();
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState(initialData?.name || "");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const isEditing = Boolean(initialData?.id);

            if (isEditing) {
                await categoryService.update(initialData!.id!, { name });
            } else {
                await categoryService.create({ name });
            }

            const successMessage = isEditing
                ? 'Categoria atualizada com sucesso!'
                : 'Categoria cadastrada com sucesso!';

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: successMessage,
                showConfirmButton: false,
                timer: 1500
            });

            onSuccess();

            if (!isEditing) {
                setName("");
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar categoria';

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
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                label="Nome da Categoria"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Bebidas, Lanches..."
            />

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <Button
                    text="Cancelar"
                    className='cursor-pointer w-auto px-6'
                    variant="secondary"
                    onClick={onCancel}
                    type="button"
                />
                <Button
                    text={initialData ? "Salvar Alterações" : "Cadastrar"}
                    type="submit"
                    className='cursor-pointer w-auto px-6'
                    isLoading={isLoading}
                    variant="primary"
                />
            </div>
        </form>
    );
}
