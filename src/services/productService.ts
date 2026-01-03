import { api } from "../functions/axios";
import { Product } from "../interfaces";

export class ProductService {

    async createProduct(data: any): Promise<Product> {
        try {
            const response = await api.post("/product", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            return response.data;
        } catch (error: any) {
            console.error("Erro ao criar o produto:", error);
            throw new Error(error.response?.data?.message || "Erro ao criar o produto");
        }
    }

    async getProducts(): Promise<Product[]> {
        try {
            const response = await api.get("/product");
            return response.data;
        } catch (error: any) {
            console.error("Erro ao obter os produtos:", error);
            throw new Error(error.response?.data?.message || "Erro ao obter os produtos");
        }
    }

    async getProductById(id: string): Promise<Product> {
        try {
            const response = await api.get(`/product/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao obter o produto:", error);
            throw new Error(error.response?.data?.message || "Erro ao obter o produto");
        }
    }

    async updateProduct(id: string, data: any): Promise<Product> {
        try {
            const response = await api.put(`/product/products/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data;
        } catch (error: any) {
            console.error("Erro ao atualizar o produto:", error);
            throw new Error(error.response?.data?.message || "Erro ao atualizar o produto")
        }
    }

    async deleteProduct(id: string): Promise<void> {
        try {
            const response = await api.delete(`/product/products/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao deletar o produto:", error);
            throw new Error(error.response?.data?.message || "Erro ao deletar")
        }
    }
    async getProductsByCompany(companyId: string): Promise<Product[]> {
        try {
            const response = await api.get(`/product/company/${companyId}`);
            return response.data;
        } catch (error: any) {
            console.error("Erro ao obter produtos da empresa:", error);
            return [];
        }
    }
}
