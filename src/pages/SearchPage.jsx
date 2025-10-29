import React, { useState, useEffect } from "react";
import data from "../data/siteContent.json";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const lower = query.toLowerCase();

    const allData = [
      ...(Array.isArray(data.products)
        ? data.products.map((item) => ({
            title: item.name,
            description: item.description,
            category: "Produk",
          }))
        : []),
      ...(Array.isArray(data.promotion)
        ? data.promotion.map((item) => ({
            title: item.title,
            description: item.details,
            category: "Promo",
          }))
        : []),
      ...(Array.isArray(data.services)
        ? data.services.map((item) => ({
            title: item.title,
            description: item.description,
            category: "Layanan",
          }))
        : []),
      ...(Array.isArray(data.testimonies)
        ? data.testimonies.map((item) => ({
            title: item.name,
            description: item.text,
            category: "Testimoni",
          }))
        : []),
    ];

    const filtered = allData.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      return title.includes(lower) || desc.includes(lower);
    });

    setResults(filtered);
  }, [query]);

  return (
    <div className="container py-12 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Hasil Pencarian</h1>

      {/* Search bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari produk, promo, layanan..."
          className="border border-gray-300 rounded-l-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setQuery(query)}
          className="bg-blue-600 text-white px-4 rounded-r-lg"
        >
          Search
        </button>
      </div>

      {/* Results */}
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
