import { api } from '@/src/functions/axios';

export class UserService {

    async registerUser(data: any): Promise<any> { // Updated to accept companyId in payload
        try {
            const response = await api.post("/users/register", data);
            return response.data;
        }
        catch (error: any) {
            console.error("Erro ao criar o usuario:", error);
            throw new Error(error.response?.data?.message || "Erro ao criar o usuario");
        }
    }

    async loginUser(data: any): Promise<{ access_token: string }> {
        try {
            const response = await api.post("/auth/login", data);
            return response.data;
        }
        catch (error: any) {
            console.error("Erro ao fazer login:", error);
            throw new Error(error.response?.data?.message || "Erro ao fazer login");
        }
    }

    async getUserCompanies(userId: string): Promise<any[]> {
        try {
            const response = await api.get(`/user-company/user/${userId}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao buscar empresas do usuario:", error);
            return [];
        }
    }

    async getUsersByCompany(companyId: string): Promise<any[]> {
        try {
            const response = await api.get(`/user-company`);
            const allAssociations = response.data;

            return allAssociations.filter((item: any) => item.companyId === companyId);
        } catch (error: any) {
            console.error("Erro ao buscar usuários da empresa:", error);
            return [];
        }
    }

    async associateUserToCompany(userId: string, companyId: string): Promise<any> {
        try {
            const response = await api.post("/user-company", {
                userId,
                companyId
            });
            return response.data;
        } catch (error: any) {
            console.error("Erro ao associar usuário à empresa:", error);
            throw new Error(error.response?.data?.message || "Erro ao associar usuário");
        }
    }
}