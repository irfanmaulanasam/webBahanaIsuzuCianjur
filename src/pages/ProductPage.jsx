import React, { useState, useMemo } from "react";
import {products} from "../data/siteContent.json"
// Sample data (replace with import from siteContent.json if you prefer)

export default function ProductsGrid({ data = products }) {
  // state for category filter and modal
  const [category, setCategory] = useState("ALL");
  const [active, setActive] = useState(null); // product id for modal

  // derive categories from data
  const categories = useMemo(() => {
    const set = new Set(data.map((p) => p.category));
    return ["ALL", ...Array.from(set)];
  }, [data]);

  // filtered list using the selected category
  const filtered = useMemo(() => {
    if (category === "ALL") return data;
    return data.filter((p) => p.category === category);
  }, [data, category]);

  return (
    <div className="px-4 py-8">
      <header className="max-w-6xl mx-auto mb-6">
        <h1 className="text-3xl font-extrabold">Daftar Produk</h1>
        {/* <p className="text-sm text-slate-600 mt-1">
          Menggunakan <code>Array.map()</code> untuk merender setiap produk menjadi
          kartu. Pilih kategori untuk menyaring.
        </p> */}

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
            <article
              key={p.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              <div className="h-48 w-full overflow-hidden bg-slate-100">
                {/* if image missing, show placeholder */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/products/placeholder.png";
                  }}
                />
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <div className="text-sm text-slate-500 mb-2">{p.category}</div>
                <p className="text-sm text-slate-700 flex-1">{p.description}</p>

                <div className="mt-4 flex gap-2">
                  <a
                    href={p.specs}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-3 py-1 rounded-md border text-sm"
                  >
                    Lihat Specs
                  </a>

                  <a
                    href={p.brochure}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-3 py-1 rounded-md border text-sm"
                  >
                    Brochure
                  </a>

                  <button
                    onClick={() => setActive(p.id)}
                    className="ml-auto px-3 py-1 rounded-md bg-slate-800 text-white text-sm"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-500">Tidak ada produk.</div>
        )}
      </main>

      {/* Modal - simple implementation */}
      {active && (
        <Modal onClose={() => setActive(null)}>
          {(() => {
            const prod = data.find((x) => x.id === active);
            if (!prod) return <div>Produk tidak ditemukan.</div>;

            return (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-28 h-20 object-cover rounded"
                    onError={(e) => (e.currentTarget.src = "/assets/products/placeholder.png")}
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{prod.name}</h2>
                    <div className="text-sm text-slate-500">{prod.category}</div>
                  </div>
                </div>

                <p className="text-slate-700">{prod.description}</p>

                <div className="flex gap-2">
                  <a
                    href={prod.specs}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    Buka Specs (PDF)
                  </a>
                  <a
                    href={prod.brochure}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    Buka Brochure (PDF)
                  </a>
                  <button
                    onClick={() => setActive(null)}
                    className="ml-auto px-3 py-1 rounded-md bg-slate-800 text-white text-sm"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6 z-10">
        {children}
      </div>
    </div>
  );
}
