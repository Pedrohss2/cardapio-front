import { api } from '@/src/functions/axios';
import { LoginUser, User } from "../interfaces";

export class UserService {

    async registerUser(data: User): Promise<User> {

        try {
            const response = await api.post("/users/register", data);
            return response.data;
        }
        catch (error: any) {
            console.error("Erro ao criar o usuario:", error);
            throw new Error(error.response?.data?.message || "Erro ao criar o usuario");
        }
    }

    async loginUser(data: LoginUser): Promise<{ access_token: string }> {
        try {
            const response = await api.post("/auth/login", data);
            console.log(response.data);
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
            // Return empty array if fails or throw
            return [];
        }
    }
}