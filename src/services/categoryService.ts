import { api } from "../functions/axios";
import { Category, Product } from "../interfaces";


export class CategoryService {

    async create(data: Category): Promise<Category> {
        try {
            const response = await api.post("/category", data);

            return response.data;
        } catch (error: any) {
            console.error("Erro ao criar o category:", error);
            throw new Error(error.response?.data?.message || "Erro ao criar o produto");
        }
    }

    async get(): Promise<Category[]> {
        try {
            const response = await api.get("/category");
            return response.data;

        } catch (error: any) {
            console.error("Erro ao obter as categoruas:", error);
            throw new Error(error.response?.data?.message || "Erro ao obter as categorias");
        }
    }

    async getCategoryById(id: string): Promise<Category | void> {
        try {
            const response = await api.get(`/category/${id}`);
            return response.data;

        } catch (error: any) {
            console.error("Erro ao obter a categoria:", error);
            throw new Error(error.response?.data?.message || "Erro ao obter a categoria:");
        }
    }


    async update(id: string, data: Category): Promise<Category> {
        try {
            const response = await api.put(`/category/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao atualizar a categoria:", error);
            throw new Error(error.response?.data?.message || "Erro ao atualizar a categoria")
        }
    }

    async deleteCategory(id: string): Promise<Category> {
        try {
            const response = await api.delete(`/category/${id}`);
            return response.data;

        } catch (error: any) {
            console.error("Erro ao deletar a categoria:", error);
            throw new Error(error.response?.data?.message || "Erro ao deletar")
        }
    }
}
