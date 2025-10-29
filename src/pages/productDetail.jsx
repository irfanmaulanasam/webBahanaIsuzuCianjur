import React, { useState } from "react";
import { useParams } from "react-router-dom";
import data from "../data/siteContent.json";
import CreditSimulator from "../components/CreditSimulator";

export default function ProductDetail() {
  const { id } = useParams();
  const product = data.products.find((p) => p.id === id);

  if (!product) return <p className="p-6">Produk tidak ditemukan.</p>;

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <img src={product.image} alt={product.name} className="rounded-lg shadow-md" />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="space-x-3 mb-6">
            <a
              href={product.specs}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Lihat Spesifikasi
            </a>
            <a
              href={product.brochure}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg"
            >
              Unduh Brosur
            </a>
          </div>

          <h2 className="text-xl font-semibold mb-3">Simulasi Kredit</h2>
          <CreditSimulator />
        </div>
      </div>
    </div>
  );
}
