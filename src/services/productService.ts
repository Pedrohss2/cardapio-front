import { api } from "../functions/axios";
import { Product } from "../interfaces";

export class ProductService {

    async createProduct(data: Product, image?: File): Promise<Product> {
        try {
            if (image) {
                const formData = new FormData();
                formData.append('image', image);

                formData.append('name', data.name);
                formData.append('description', data.description);
                formData.append('price', data.price.toString());
                formData.append('categoryId', data.categoryId);

                const response = await api.post("/product", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return response.data;
            } else {
                const response = await api.post("/product", data);
                return response.data;
            }
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


    async updateProduct(id: string, data: Product): Promise<Product> {
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
