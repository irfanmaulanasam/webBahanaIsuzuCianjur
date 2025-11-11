// src/pages/NewsPages.jsx
import { useState, useMemo } from 'react';
import { getAllNewsSorted, getPinnedNews } from '../data/newsUtils';
import allCategories from '../data/newsData.js';
import NewsCard from '../components/NewsCard'; // JANGAN LUPA IMPORT

export default function NewsPages() {
    // Gunakan useMemo agar pemrosesan sorting hanya terjadi sekali
    const allNews = useMemo(() => getAllNewsSorted(), []);
    const pinnedNews = useMemo(() => getPinnedNews(), []);

    // ✅ PERBAIKAN 1: Gunakan allNews atau allCategories yang sudah ada
    const categories = useMemo(() => {
        if (!allNews || allNews.length === 0) return ["ALL"];
        
        const set = new Set(allNews.map((news) => news.category));
        return ["ALL", ...Array.from(set)];
    }, [allNews]); // ✅ dependency yang benar

    // State untuk filtering
    const [activeFilter, setActiveFilter] = useState('ALL'); 

    const filteredNews = useMemo(() => {
        if (activeFilter === 'ALL') {
            return allNews;
        }
        // Filter berdasarkan category
        return allNews.filter(news => news.category === activeFilter);
    }, [allNews, activeFilter]);

    return (
        <div className="container mx-auto p-4">
            {/* Tampilan Konten Unggulan */}
            <h1 className="text-3xl font-bold mb-6">Konten Unggulan</h1>
            <div className="mb-10">
                {/* ✅ PERBAIKAN 2: Cek dulu sebelum akses array */}
                {filteredNews.length > 1 ? (
                    <h1>{filteredNews[1].slug}</h1>
                ) : (
                    <p>Tidak ada konten yang tersedia</p>
                )}
            </div>

            {/* Tombol Filter */}
            <div className="flex space-x-4 mb-8">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveFilter(cat)}
                        className={`px-4 py-2 rounded ${
                            activeFilter === cat 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Grid Konten */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ✅ PERBAIKAN 3: Cek filteredNews sebelum map */}
                {filteredNews && filteredNews.length > 0 ? (
                    filteredNews.map(news => (
                        <NewsCard key={news.id} news={news} />
                    ))
                ) : (
                    <div className="col-span-3 text-center py-8">
                        <p>Tidak ada berita yang ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
}