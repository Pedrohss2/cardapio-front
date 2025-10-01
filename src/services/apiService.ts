import { api } from "../functions/axios";

type Category = {
    id: string;
    name: string;
}

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    categoryId?: string | undefined;
}

export class ApiService {

    async createProduct(data: Product): Promise<void> {
        try {
            const response = await api.post("/products", {
                data
            });
            console.log("Criando produto meu amigo")
            return response.data;
        } catch (error: any) {
            console.error("Erro ao criar o produto:", error);
            throw new Error(error.response?.data?.message || "Erro ao criar o produto");
        }
    }

    async getProducts(): Promise<Product | void> {
        try {
            const response = await api.get("/products");
            return response.data;
        } catch (error: any) {
            console.error("Erro ao obter os produtos:", error);
            throw new Error(error.response?.data?.message || "Erro ao obter os produtos");
        }
    }

    async getProductById(id: string): Promise<Product | void> {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao obter o produto:", error);
            throw new Error(error.response?.data?.message || "Erro ao obter o produto");
        }
    }


    async updateProduct(id: string, data: Product): Promise<void> {
        try {
            const response = await api.put(`/products/${id}`, {
                data
            });
            return response.data;
        } catch (error: any) {
            console.error("Erro ao atualizar o produto:", error);
            throw new Error(error.response?.data?.message || "Erro ao atualizar o produto")
        }
    }

    async deleteProduct(id: string): Promise<void> {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao deletar o produto:", error);
            throw new Error(error.response?.data?.message || "Erro ao deletar")
        }
    }
}
