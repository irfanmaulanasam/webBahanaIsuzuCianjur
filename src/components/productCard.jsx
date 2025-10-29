import React from "react";
import { motion } from "framer-motion";

export default function ProductCard({ product, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      className="border rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        <p className="text-xs text-gray-400 mt-2">Kategori: {product.category}</p>
      </div>
    </motion.div>
  );
}
