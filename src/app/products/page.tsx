"use client"

import Header from "@/src/components/Header";
import { useAuth } from "@/src/contexts/AuthContext";
import { Product } from "@/src/interfaces";
import { ProductService } from "@/src/services/productService";
import { useContext, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";

export default function Products() {
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false);

  const [produtos, setProdutos] = useState<Product[]>([]);
  const productService = new ProductService();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        productService.getProducts().then((data: Product[]) => {
          setProdutos(data);
        });
      }
      catch (error) {
        console.log(error);
      }
    };
    fetchProducts()

  }, []);

  const showAllertConfirmDelete = (id: string) => {
    Swal.fire({
      title: "Você tem certeza de que deseja excluir este item?",
      text: "Você não será podera reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!"
    }).then((result) => {
      if (result.isConfirmed) {
        excludeItem(id);
      }
    });
  };

  const excludeItem = async (id: string) => {
    try {
      await productService.deleteProduct(id);

      setProdutos(produtos.filter(produto => produto.id !== id));
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
    }
  }

  const updateItem = async (id: string, produto: any) => {
    try {
      await productService.updateProduct(id, produto);

      setProdutos(produtos.map(produto => produto.id === id ? { ...produto, ...produto } : produto));
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
    }

  }

  return (
    <div className="pt-26">
      <Header />
      <div className="max-w-6xl mx-auto p-6 ">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Cardapio
        </h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm  overflow-hidden"
            >
              <div className="relative h-48 bg-gray-100">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${produto.image}`}
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

                {isAuthenticated && (
                  <div className="flex items-center justify-end gap-5">
                    <div className="text-blue-500 hover:scale-105 hover:cursor-pointer" onClick={() => {
                      setOpen(true)
                    }}>
                      <FaRegEdit size={25} />
                    </div>
                    <div className="text-red-500 hover:scale-105 hover:cursor-pointer" onClick={() => showAllertConfirmDelete(produto.id!)}>
                      <MdDeleteOutline size={25} />
                    </div>
                  </div>
                )}

                {open && (
                  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-105">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Editar Produto</h3>
                        <button
                          onClick={() => {
                            setOpen(false);
                          }}
                          className="text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-all duration-200"
                        >
                          <IoMdClose size={24} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-5">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Nome do produto"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div className="relative">
                          <textarea
                            placeholder="Descrição detalhada"
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Preço (R$)"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-indigo-700 file:hover:cursor-pointer hover:file:bg-indigo-100 transition-all duration-200"
                          />
                        </div>

                        <button
                          className="mt-2 bg-blue-600 text-white py-3 rounded-lg  hover:cursor-pointer transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                          Salvar Alterações
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}