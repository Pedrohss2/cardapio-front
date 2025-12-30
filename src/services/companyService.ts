import { api } from '@/src/functions/axios';

export interface CreateCompanyDto {
    name: string;
    address: string;
    phone: string;
    email: string;
    ownerName?: string;
    ownerPassword?: string;
}

export interface UpdateCompanyDto {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
}

export class CompanyService {
    async createCompany(data: CreateCompanyDto) {
        try {
            const response = await api.post('/company', data);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao criar empresa:", error);
            throw new Error(error.response?.data?.message || "Erro ao criar empresa");
        }
    }

    async getCompanyById(id: string) {
        try {
            const response = await api.get(`/company/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar empresa:", error);
            return null;
        }
    }

    async updateCompany(id: string, data: UpdateCompanyDto) {
        try {
            const response = await api.put(`/company/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao atualizar empresa:", error);
            throw new Error(error.response?.data?.message || "Erro ao atualizar empresa");
        }
    }
}
