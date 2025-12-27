"use client"

import Header from "@/src/components/Header";
import { useAuth } from "@/src/contexts/AuthContext";
import { Category, Product } from "@/src/interfaces";
import { ProductService } from "@/src/services/productService";
import { CategoryService } from "@/src/services/categoryService";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";



export default function Products() {
  const productService = new ProductService();
  const categoryService = new CategoryService();
  const data = new FormData();


  const { isAuthenticated } = useAuth();

  const [open, setOpen] = useState(false);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
    categoryId: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await categoryService.get();
        setCategories(categoriesData);

        const productsData = await productService.getProducts();
        setProdutos(productsData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [formData, selectedProduct]);

  const handleEdit = (produto: Product) => {
    setSelectedProduct(produto);
    setFormData({
      name: produto.name,
      description: produto.description,
      price: produto.price.toString(),
      image: null,
      categoryId: produto.categoryId
    });
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const showAllertConfirmDelete = (id: string) => {
    Swal.fire({
      title: "Você tem certeza de que deseja excluir este item?",
      text: "Você não poderá reverter isso!",
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
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("categoryId", formData.categoryId);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const updated = await productService.updateProduct(selectedProduct.id!, data);

      setProdutos(produtos.map(p => (p.id === selectedProduct.id ? { ...p, ...updated } : p)));

      Swal.fire({
        icon: "success",
        title: "Produto atualizado com sucesso!",
        timer: 2500,
      });

      setOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      Swal.fire("Erro", "Falha ao atualizar produto", "error");
    }
  };

  const filteredProducts = selectedCategory
    ? produtos.filter(p => p.categoryId === selectedCategory)
    : produtos;

  return (
    <div className="pt-26">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Cardápio</h2>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 hover:cursor-pointer hover:scale-105 rounded-full border ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border-gray-300'} transition`}
          >
            Todas
          </button>

          {categories
            .filter(cat => produtos.some(prod => prod.categoryId === cat.id))
            .map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id || null)
                }}
                className={`px-4 py-2 hover:cursor-pointer hover:scale-105 rounded-full border ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border-gray-300'} transition`}
              >
                {cat.name}
              </button>
            ))}
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(produto => (
            <div key={produto.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${produto.image}`}
                  alt={produto.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-5">
                <h4 className="text-lg font-semibold text-gray-900">{produto.name}</h4>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{produto.description}</p>
                <p className="text-2xl font-bold text-indigo-600 mt-3">R$ {produto.price.toFixed(2)}</p>

                {isAuthenticated && (
                  <div className="flex items-center justify-end gap-5 mt-2">
                    <div className="text-blue-500 hover:scale-105 hover:cursor-pointer" onClick={() => handleEdit(produto)}>
                      <FaRegEdit size={25} />
                    </div>
                    <div className="text-red-500 hover:scale-105 hover:cursor-pointer" onClick={() => showAllertConfirmDelete(produto.id!)}>
                      <MdDeleteOutline size={25} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {open && selectedProduct && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-105">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Editar Produto</h3>
                <button onClick={() => setOpen(false)} className="text-gray-500 hover:cursor-pointer hover:scale-105 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-all duration-200">
                  <IoMdClose size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nome do produto"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descrição detalhada"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Preço (R$)"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-indigo-700 file:hover:cursor-pointer hover:file:bg-indigo-100 transition-all duration-200"
                />
                <button
                  onClick={handleSubmit}
                  className="mt-2 bg-blue-600 text-white py-3 rounded-lg hover:cursor-pointer transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
