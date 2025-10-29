import React, { useState, useEffect } from "react";
// 🟢 Import useLocation dari react-router-dom
import { useLocation } from "react-router-dom"; 
import data from "../data/siteContent.json";

export default function SearchPage() {
  const location = useLocation(); // 👈 Dapatkan lokasi URL saat ini
  
  // 🟢 Ambil query dari URL. Gunakan ini sebagai nilai awal state.
  const initialQuery = new URLSearchParams(location.search).get('q') || "";
  const [query, setQuery] = useState(initialQuery);
  
  const [currentInput, setCurrentInput] = useState(initialQuery); // 👈 State baru untuk input field (opsional, tapi lebih baik)

  const [results, setResults] = useState([]);

  // 🟢 Fungsi untuk menangani pencarian (akan dipanggil saat tombol Search diklik)
  const handleSearch = () => {
    // 1. Update state query utama agar useEffect berjalan
    setQuery(currentInput); 
    
    // 2. Jika Anda ingin URL juga diperbarui (Advanced): 
    // Anda perlu mengimpor useNavigate dan memperbarui URL di sini 
    // navigate(`/search?q=${encodeURIComponent(currentInput)}`);
  };

  useEffect(() => {
    // 🟢 Pastikan useEffect berjalan jika query datang dari Header (dari URL)
    if (query && query !== "") {
      const lower = query.toLowerCase();

      // ... (Seluruh logika penggabungan dan filtering data Anda)
      const allData = [
          // ... (isi data.products, data.promotion, data.services, data.testimonies) ...
          // ...
          ...(Array.isArray(data.products)
            ? data.products.map((item) => ({
                title: item.name,
                description: item.description,
                category: "Produk",
              }))
            : []),
          // ... data promotion
          // ... data services
          // ... data testimonies
          // ...
      ];

      const filtered = allData.filter((item) => {
        const title = (item.title || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        return title.includes(lower) || desc.includes(lower);
      });

      setResults(filtered);
    } else {
        setResults([]);
    }
    // 🟢 Dependency array hanya perlu 'query'
  }, [query]);

  return (
    <div className="container py-12 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Hasil Pencarian</h1>

      {/* Search bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          // 🟢 Gunakan currentInput untuk mengontrol input field
          value={currentInput}
          // 🟢 Ubah currentInput saat user mengetik
          onChange={(e) => setCurrentInput(e.target.value)} 
          placeholder="Cari produk, promo, layanan..."
          className="border border-gray-300 rounded-l-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          // 🟢 Tambahkan event keyPress untuk submit dengan Enter
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <button
          // 🟢 Panggil handleSearch saat tombol diklik
          onClick={handleSearch} 
          className="bg-blue-600 text-white px-4 rounded-r-lg"
        >
          Search
        </button>
      </div>
       {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
           {results.map((item, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-2">
                {item.title || "Tanpa Judul"}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {item.description || "Tidak ada deskripsi"}
              </p>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Tidak ada hasil ditemukan.</p>
        </div>
      )}
    </div>
  );
}