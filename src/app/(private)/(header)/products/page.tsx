"use client"

import { useAuth } from "@/src/contexts/AuthContext";
import { Category, Product } from "@/src/interfaces";
import { CategoryService } from "@/src/services/categoryService";
import { ProductService } from "@/src/services/productService";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaRegEdit } from "react-icons/fa";
import { MdAdd, MdDeleteOutline, MdFastfood, MdSearch } from "react-icons/md";
import Swal from "sweetalert2";
import Button from "@/src/components/general/Button";
import Modal from "@/src/components/general/Modal";
import ProductForm from "@/src/components/forms/ProductForm";
import { TbCurrencyReal } from "react-icons/tb";

export default function Products() {
  const productService = new ProductService();
  const categoryService = new CategoryService();

  const { isAuthenticated, loading } = useAuth();

  // States
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Refs for scroll spy - simple implementation
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const fetchData = async () => {
    try {
      const categoriesData = await categoryService.get();
      setExpandedCategories(categoriesData.map(c => c.id!).filter(Boolean));
      setCategories(categoriesData);

      const productsData = await productService.getProducts();
      setProdutos(productsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleEdit = (produto: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling accordion
    setEditingProduct(produto);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const showAllertConfirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    Swal.fire({
      title: "Confirmar Exclusão",
      text: "Isso removerá o item do cardápio permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      }
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
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
      Toast.fire({ icon: 'success', title: 'Produto removido com sucesso' })
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
    }
  };

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      if (!expandedCategories.includes(categoryId)) {
        toggleCategory(categoryId);
      }
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">

      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 pt-28 pb-32 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="animate-in slide-in-from-left duration-700">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Cardápio</h1>
          </div>

          {isAuthenticated && (
            <div className="animate-in slide-in-from-right duration-700">
              <button
                onClick={handleNew}
                className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-4 rounded-2xl transition-all border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
              >
                <div className="bg-white text-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <MdAdd size={24} />
                </div>
                <div className="text-left">
                  <span className="block text-xs text-indigo-200 font-medium uppercase tracking-wider">Gerenciar</span>
                  <span className="block font-bold text-lg">Novo Produto</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">

        <div className="bg-white rounded-2xl shadow-xl p-2 mb-8 flex items-center animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="p-4 text-gray-400">
            <MdSearch size={24} />
          </div>
          <input
            type="text"
            placeholder="O que você está procurando hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-4 px-2 text-lg text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>

        <div className="sticky top-4 z-40 mb-10">
          <div className="flex gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide snap-x mask-linear-fade">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id!)}
                className={`
                    whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm snap-start cursor-pointer border
                    ${activeCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/30 scale-105'
                    : 'bg-white text-gray-600 border-gray-100 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md'}
                  `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-12 pb-20">
          {categories
            .filter(cat => {
              const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                produtos.some(p => p.categoryId === cat.id && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
              const hasProducts = produtos.some(prod => prod.categoryId === cat.id);
              return hasProducts && matchesSearch;
            })
            .map((cat, index) => {
              const categoryProducts = produtos.filter(p =>
                p.categoryId === cat.id &&
                (searchTerm === "" || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              );

              if (categoryProducts.length === 0 && searchTerm !== "") return null;

              return (
                <div
                  id={`category-${cat.id}`}
                  key={cat.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700 scroll-mt-32"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">{cat.name}</h2>
                    <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></span>
                    <span className="text-sm font-medium text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                      {categoryProducts.length} opções
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                    {categoryProducts.map(produto => (
                      <div
                        key={produto.id}
                        className="group bg-white rounded-2xl p-4 sm:p-5 border border-transparent hover:border-indigo-100 shadow-sm hover:shadow-xl transition-all duration-300 flex gap-4 sm:gap-6 relative overflow-hidden"
                      >
                        <div className="w-28 h-28 sm:w-40 sm:h-40 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden relative shadow-inner">
                          {produto.image ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${produto.image}`}
                              alt={produto.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                              <MdFastfood size={32} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{produto.name}</h3>
                              <span className="font-bold text-lg text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                                R$ {produto.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                              {produto.description}
                            </p>
                          </div>

                          {isAuthenticated && (
                            <div className="flex gap-3 mt-4  duration-300 translate-y-2 group-hover:translate-y-0">
                              <button
                                onClick={(e) => handleEdit(produto, e)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <FaRegEdit /> Editar
                              </button>
                              <button
                                onClick={(e) => showAllertConfirmDelete(produto.id!, e)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <MdDeleteOutline size={18} /> Remover
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? "Editar Produto" : "Novo Produto"}
        >
          <ProductForm
            initialData={editingProduct}
            onSuccess={() => {
              setIsModalOpen(false);
              fetchData();
            }}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>

      </div>
    </div>
  );
}
