"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { UserService } from "@/src/services/userService";
import { useEffect, useState } from "react";
import { MdAdd, MdPerson, MdPersonAdd } from "react-icons/md";
import Button from "@/src/components/general/Button";
import Modal from "@/src/components/general/modals/general";
import UserForm from "@/src/components/forms/UserForm";

export default function RegisterUser() {
    const { isAuthenticated, company, loading } = useAuth();
    const userService = new UserService();
    const [users, setUsers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        if (company?.id) {
            const usersData = await userService.getUsersByCompany(company.id);
            setUsers(usersData);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [company]);

    if (loading) return null;
    if (!isAuthenticated) return null;

    return (
        <div className="pt-8 min-h-screen bg-gray-50/50 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-in fly-in-bottom duration-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
                            <MdPersonAdd size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Equipe</h1>
                            <p className="text-gray-500">Gerencie os usuários que têm acesso à sua loja</p>
                        </div>
                    </div>
                    <Button
                        text="Novo Usuário"
                        variant="primary"
                        className="w-full md:w-auto cursor-pointer shadow-lg hover:shadow-indigo-200"
                        icon={<MdAdd size={20} />}
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>

                {users.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <MdPerson size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Nenhum usuário encontrado</h3>
                        <p className="text-gray-500 mt-1">Sua empresa ainda não tem outros usuários cadastrados.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 delay-150">
                        {users.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                                            {item.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.user.name}</h3>
                                            <p className="text-sm text-gray-500">{item.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium text-xs">Ativo</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Novo Usuário"
            >
                <UserForm
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchUsers();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
