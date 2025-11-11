import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getNewsBySlug, getRelatedNews, getAllNewsSorted } from '../data/newsUtils'; 
import RelatedNewsCard from '../components/RelatedNewsCard';

export default function NewsDetailPage() {
    const { slug } = useParams(); 
    const [newsItem, setNewsItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNewsItem = () => {
            setIsLoading(true);
            const item = getNewsBySlug(slug);
            
            // 🟢 NORMALISASI CATEGORY
            if (item && item.category) {
                const categoryMap = {
                    'emam': 'umum',
                    'unum': 'umum', 
                    'umm': 'umum',
                    'true-berat': 'teknologi',
                    'pempherpaan': 'pengembangan'
                    // tambahkan mapping lain sesuai kebutuhan
                };
                
                if (categoryMap[item.category]) {
                    console.log('🔄 Fixed category:', item.category, '→', categoryMap[item.category]);
                    item.category = categoryMap[item.category];
                }
            }
            
            setNewsItem(item);
            setIsLoading(false);
        };

        fetchNewsItem();
    }, [slug]);
    
    // 🟢 REAL LOGIC (remove hardcode)
    const relatedArticles = useMemo(() => {
        if (!newsItem) return [];
        
        console.log('🔍 Finding related articles for:', {
            slug: newsItem.slug,
            category: newsItem.category,
            type: newsItem.type
        });

        // Normalisasi category untuk pencarian
        const categoryMap = {
            'emam': 'umum',
            'unum': 'umum',
            'umm': 'umum', 
            'true-berat': 'teknologi',
            'pempherpaan': 'pengembangan'
        };
        
        const searchCategory = categoryMap[newsItem.category] || newsItem.category;

        // Cari related articles
        const allNews = getAllNewsSorted();
        let related = [];
        
        if (allNews && Array.isArray(allNews)) {
            related = allNews
                .filter(news => {
                    if (!news || !news.slug) return false;
                    if (news.slug === newsItem.slug) return false;
                    
                    // Normalisasi category news lain
                    let newsCategory = news.category;
                    if (categoryMap[newsCategory]) {
                        newsCategory = categoryMap[newsCategory];
                    }
                    
                    // Priority 1: Same category
                    if (newsCategory === searchCategory) {
                        console.log('✅ Match by category:', news.title);
                        return true;
                    }
                    
                    // Priority 2: Same type
                    if (news.type === newsItem.type) {
                        console.log('✅ Match by type:', news.title); 
                        return true;
                    }
                    
                    return false;
                })
                .slice(0, 3);
        }
        
        console.log('📝 Found related articles:', related.length);
        return related;
    }, [newsItem]);

    const hasRelatedArticles = relatedArticles && relatedArticles.length > 0;

    if (isLoading) {
        return <div className="text-center py-20">Memuat detail konten...</div>;
    }

    if (!newsItem) {
        return <Navigate to="/404" replace />;
    }
    
    // Debug info
    const allNews = getAllNewsSorted();
    const categories = [...new Set(allNews.map(n => n.category))];
    
    console.log('=== FINAL DEBUG ===');
    console.log('newsItem category:', newsItem.category);
    console.log('relatedArticles count:', relatedArticles.length);
    console.log('hasRelatedArticles:', hasRelatedArticles);
    console.log('Total news in system:', allNews.length);
    console.log('News categories:', categories);
    console.log('===================');

    return (
        <div className="container mx-auto max-w-4xl p-4 md:p-8">
            {/* Navigation Back */}
            <Link 
                to="/news" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
            >
                ← Kembali ke Semua Konten
            </Link>

            {/* Article Header */}
            <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {newsItem.type?.toUpperCase()}
                    </span>
                    {newsItem.category && (
                        <span className="text-sm text-gray-600">
                            • {newsItem.category}
                        </span>
                    )}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {newsItem.title}
                </h1>
                
                {newsItem.date && (
                    <div className="text-sm text-gray-600">
                        {new Date(newsItem.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </div>
                )}
            </header>

            {/* Featured Image */}
            {newsItem.imageUrl && (
                <div className="mb-8 rounded-lg overflow-hidden">
                    <img 
                        src={newsItem.imageUrl} 
                        alt={newsItem.title}
                        className="w-full h-64 object-cover"
                    />
                </div>
            )}

            {/* Article Content */}
            {newsItem.content && (
                <div 
                    className="prose max-w-none mb-12" 
                    dangerouslySetInnerHTML={{ __html: newsItem.content }} 
                />
            )}
            
            {/* Related Articles Section */}
            <section className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Konten Terkait Lainnya
                </h2>
                
                {hasRelatedArticles ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {relatedArticles.map(related => (
                            <RelatedNewsCard key={related.id} news={related} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-2">
                            Tidak ada konten terkait lainnya
                        </p>
                        <div className="text-xs text-gray-400 space-y-1">
                            <p>Category: {newsItem.category} | Type: {newsItem.type}</p>
                            <p>Total articles: {allNews.length} | Available categories: {categories.join(', ')}</p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}