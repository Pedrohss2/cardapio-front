"use client";

import Modal from "../general";
import Button from "../../Button";
import { IoWarningOutline } from "react-icons/io5";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    isLoading?: boolean;
}

export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar exclusão",
    description = "Esta ação não pode ser desfeita.",
    itemName,
    isLoading = false,
}: ConfirmDeleteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-in zoom-in duration-300">
                    <IoWarningOutline className="text-red-600" size={48} />
                </div>

                <div className="space-y-2">
                    {itemName && (
                        <p className="text-lg font-semibold text-gray-800">
                            Tem certeza que deseja excluir <span className="text-red-600">"{itemName}"</span>?
                        </p>
                    )}
                    {!itemName && (
                        <p className="text-lg font-semibold text-gray-800">
                            Tem certeza que deseja excluir este item?
                        </p>
                    )}
                    <p className="text-sm text-gray-500">{description}</p>
                </div>

                <div className="flex gap-3 w-full pt-2">
                    <Button
                        text="Cancelar"
                        className="cursor-pointer"
                        variant="secondary"
                        onClick={onClose}
                        fullWidth
                        disabled={isLoading}
                    />

                    <Button
                        text={isLoading ? "Excluindo..." : "Confirmar exclusão"}
                        onClick={onConfirm}
                        fullWidth
                        isLoading={isLoading}
                        className="bg-red-400 cursor-pointer shadow-lg"
                    />

                </div>
            </div>
        </Modal>
    );
}