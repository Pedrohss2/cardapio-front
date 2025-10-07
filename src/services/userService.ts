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

    async loginUser(data: LoginUser): Promise<LoginUser> {
        try {
            const response = await api.post("/auth/login", data);
            return response.data;
        }
        catch (error: any) {
            console.error("Erro ao fazer login:", error);
            throw new Error(error.response?.data?.message || "Erro ao fazer login");
        }
    }
}