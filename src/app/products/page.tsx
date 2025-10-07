"use client"

import { Product } from "@/src/interfaces";
import { ProductService } from "@/src/services/productService";
import { useEffect, useState } from "react";

export default function Products() {

  const [produtos, setProdutos] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const service = new ProductService();

      try {
        service.getProducts().then((data) => {
          setProdutos(data);
        });
      }
      catch (error) {
        console.log(error);
      }
    };
    fetchProducts()

  }, [produtos]);


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Cardapio
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden"
          >
            <div className="relative h-48 bg-gray-100">
              <img
                src={"https://via.placeholder.com/300x200.png?text=Produto"}
                alt={produto.name}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900">{produto.name}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{produto.description}</p>
              <p className="text-2xl font-bold text-indigo-600 mt-3">
                R$ {produto.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}