import { useState, useMemo } from "react";
import { productsSummary } from "../data/products_summary"
import ProductCard from "../components/productCard";
import { useNavigate, useParams } from 'react-router-dom'; 

export default function ProductsGrid({ data = productsSummary }) {
  const {slug} = useParams()
  // state for category filter
  const [category, setCategory] = useState('ALL');
  const navigate = useNavigate(); 
  
  const categories = useMemo(() => {
    const set = new Set(data.map((p) => p.category));
      return ["ALL", ...Array.from(set)];
  }, [data]);

  // filtered list using the selected category
  const filtered = useMemo(() => {
    if (slug) {
      return data.filter((p)=> p.category === slug);
    }
    if (category === "ALL") return data;
    return data.filter((p) => p.category === category);
  }, [data, category]);
  
  // FUNGSI BARU: Untuk menangani klik dan navigasi
  const handleProductClick = (slug) => {
      navigate(`/spec/${slug}`);
  }

  return (
    <div className="px-4 py-8">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-extrabold">Daftar Produk</h1>
        {/* ... (Filter kategori) ... */}
        <div className="mt-4 flex gap-2 items-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-2xl text-sm font-medium shadow-sm hover:scale-105 transition-transform focus:outline-none ${
                category === cat 
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div 
                key={p.id}
            >
              {/* Memanggil ProductCard dan meneruskan fungsi navigasi */}
              <ProductCard 
                product={p}
                onClick={() => handleProductClick(p.slug)} 
              /> 
            </div>
          ))}
        </div>
        {/* empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-500">Tidak ada produk.</div>
        )}
      </main>
    </div>
  );
}
