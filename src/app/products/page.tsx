"use client"

// import Header from "@/src/components/Header"; // Global header used now
import { useAuth } from "@/src/contexts/AuthContext";
import { Category, Product } from "@/src/interfaces";
import { ProductService } from "@/src/services/productService";
import { CategoryService } from "@/src/services/categoryService";
import { useEffect, useState } from "react";
import { FaRegEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdDeleteOutline, MdFastfood } from "react-icons/md";
import Swal from "sweetalert2";

export default function Products() {
  const productService = new ProductService();
  const categoryService = new CategoryService();
  const data = new FormData();


  const { isAuthenticated } = useAuth();

  const [open, setOpen] = useState(false);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Not used in accordion view
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

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
        // Initialize all categories as expanded
        setExpandedCategories(categoriesData.map(c => c.id!).filter(Boolean));
        setCategories(categoriesData);

        const productsData = await productService.getProducts();
        setProdutos(productsData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [formData, selectedProduct]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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

  const [searchTerm, setSearchTerm] = useState("");

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (!expandedCategories.includes(categoryId)) {
        toggleCategory(categoryId);
      }
    }
  };

  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm">
              <MdFastfood size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Cardápio</h2>
              <p className="text-gray-500">Gerencie seus produtos</p>
            </div>
          </div>

          <div className="w-full md:w-96 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar produto ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none shadow-sm hover:border-indigo-200"
            />
          </div>
        </div>

        {/* Quick Category Nav Pills */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id!)}
              className="whitespace-nowrap px-5 py-2.5 bg-white text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95 snap-start"
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {categories
            .filter(cat => {
              const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                produtos.some(p => p.categoryId === cat.id && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
              const hasProducts = produtos.some(prod => prod.categoryId === cat.id);
              return hasProducts && matchesSearch;
            })
            .map(cat => {
              // Auto expand if search is active
              const isExpanded = expandedCategories.includes(cat.id!) || searchTerm.length > 0;
              const categoryProducts = produtos.filter(p =>
                p.categoryId === cat.id &&
                (searchTerm === "" || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              );

              if (categoryProducts.length === 0 && searchTerm !== "") return null;

              return (
                <div id={`category-${cat.id}`} key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-28">
                  <button
                    onClick={() => toggleCategory(cat.id!)}
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'} transition-colors`}>
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                        <p className="text-sm text-gray-500">{categoryProducts.length} produtos</p>
                      </div>
                    </div>
                  </button>

                  <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-6 pt-0 border-t border-gray-50 bg-gray-50/30">
                      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                        {categoryProducts.map(produto => (
                          <div key={produto.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                            <div className="relative h-48 bg-gray-200 overflow-hidden">
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${produto.image}`}
                                alt={produto.name}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            </div>
                            <div className="p-5">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-bold text-gray-900 line-clamp-1" title={produto.name}>{produto.name}</h4>
                              </div>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">{produto.description}</p>

                              <div className="flex items-center justify-between mt-auto">
                                <p className="text-2xl font-bold text-indigo-600">R$ {produto.price.toFixed(2)}</p>

                                {isAuthenticated && (
                                  <div className="flex gap-2">
                                    <button
                                      className="p-2 text-blue-600 cursor-pointer bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                      onClick={() => handleEdit(produto)}
                                      title="Editar"
                                    >
                                      <FaRegEdit size={18} />
                                    </button>
                                    <button
                                      className="p-2 text-red-600 cursor-pointer bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                      onClick={() => showAllertConfirmDelete(produto.id!)}
                                      title="Excluir"
                                    >
                                      <MdDeleteOutline size={20} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {open && selectedProduct && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300 scale-100">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-bold text-gray-800">Editar Produto</h3>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all">
                  <IoMdClose size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none appearance-none"
                    >
                      <option value="">Selecione...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova Imagem (Opcional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-gray-200 border-dashed rounded-xl text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100
                    "
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="mt-4 w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
