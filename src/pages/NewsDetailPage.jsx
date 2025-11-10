import React, { useEffect, useState, useMemo } from 'react'; // 👈 Tambahkan useMemo
import { useParams, Link, Navigate } from 'react-router-dom';
// 👈 Import fungsi baru
import { getNewsBySlug, getRelatedNews } from '../data/newsUtils'; 
import { ArrowLeft, Tag, Calendar, MapPin, Clock } from 'lucide-react';

// ... (getTypeBadge helper dan NewsDetailPage komponen)

export default function NewsDetailPage() {
    const { slug } = useParams(); 
    const [newsItem, setNewsItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ... (useEffect untuk setNewsItem)
    
    // 🟢 useMemo untuk Artikel Terkait
    const relatedArticles = useMemo(() => {
        if (!newsItem) return [];
        // Panggil fungsi helper
        return getRelatedNews(newsItem.slug, newsItem.category, 3);
    }, [newsItem]); // Hitung ulang hanya jika newsItem berubah

    if (isLoading) {
        return <div className="text-center py-20">Memuat detail konten...</div>;
    }

    if (!newsItem) {
        return <Navigate to="/404" replace />;
    }
    
    // ... (sisanya dari komponen)

    return (
        <div className="container mx-auto max-w-4xl p-4 md:p-8">
            {/* ... (Konten Utama) */}

            {/* Konten Detail */}
            <div 
                className="prose max-w-none dark:prose-invert mb-12" 
                dangerouslySetInnerHTML={{ __html: newsItem.content }} 
            />
            
            {/* ----------------------------------- */}
            {/* 🟢 BAGIAN ARTIKEL TERKAIT BARU */}
            {/* ----------------------------------- */}
            {relatedArticles.length > 0 && (
                <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                        Konten Terkait Lainnya
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {relatedArticles.map(related => (
                            <Link 
                                key={related.id} 
                                to={`/news/${related.slug}`}
                                className="block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:scale-[1.02] bg-white dark:bg-gray-800"
                            >
                                <img 
                                    src={related.imageUrl || '/assets/placeholder.jpg'} 
                                    alt={related.title} 
                                    className="w-full h-24 object-cover"
                                />
                                <div className="p-3">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getTypeBadge(related.type)}`}>
                                        {related.type.toUpperCase()}
                                    </span>
                                    <h3 className="text-sm font-semibold mt-1 line-clamp-2 text-gray-900 dark:text-white">
                                        {related.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}