"use client";

import { useAuth } from "@/src/contexts/AuthContext";
import { CompanyService, UpdateCompanyDto } from "@/src/services/companyService";
import { useEffect, useState } from "react";
import { MdBusiness, MdSave, MdSettings } from "react-icons/md";
import Swal from "sweetalert2";

export default function Settings() {
    const { company, updateCompany: updateCompanyContext } = useAuth();
    const companyService = new CompanyService();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<UpdateCompanyDto>({
        name: "",
        address: "",
        phone: "",
        email: ""
    });

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || "",
                address: company.address || "",
                phone: company.phone || "",
                email: company.email || ""
            });
        }
    }, [company]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company?.id) return;

        setIsLoading(true);

        try {
            const updatedCompany = await companyService.updateCompany(company.id, formData);

            updateCompanyContext({ ...company, ...updatedCompany });

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Configurações da empresa atualizadas.',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.message || 'Falha ao atualizar configurações.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-8 min-h-screen bg-gray-50/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
                        <MdSettings size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
                        <p className="text-gray-500">Gerencie os detalhes da sua loja</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <MdBusiness className="text-indigo-500" />
                            Dados da Empresa
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Essas informações serão exibidas no seu cardápio digital.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Loja</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ex: Pizzaria do João"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Endereço completo"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone (WhatsApp)</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="(00) 00000-0000"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contato</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex cursor-pointer items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <MdSave size={20} />
                                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
