// src/pages/NewsPages.jsx
import { getAllNewsSorted, getPinnedNews } from '../data/newsUtils';
import NewsData,{ allCategories } from '../data/newsData';

export default function NewsPages() {
    // Gunakan useMemo agar pemrosesan sorting hanya terjadi sekali
    const allNews = useMemo(() => getAllNewsSorted(), []);
    const pinnedNews = useMemo(() => getPinnedNews(), []);
    
    // State untuk filtering (misalnya, klik tab "Promo")
    const [activeFilter, setActiveFilter] = useState('all'); 

    const filteredNews = useMemo(() => {
        if (activeFilter === 'all') {
            return allNews;
        }
        // Filter berdasarkan tipe jika ada filter aktif
        return allNews.filter(news => news.type === activeFilter);
    }, [allNews, activeFilter]);
    
    return (
        <div className="container mx-auto p-4">
            {/* Tampilan Konten Unggulan (Langkah 4A) */}
            <h1 className="text-3xl font-bold mb-6">Konten Unggulan</h1>
            <div className="mb-10">
                {/* Render pinnedNews di sini */}
            </div>

            {/* Tombol Filter (Berita, Promo, Event) */}
            <div className="flex space-x-4 mb-8">
                <button onClick={() => setActiveFilter('all')}>Semua</button>
                {allCategories.map(cat => (
                    <button key={cat} onClick={() => setActiveFilter(cat)}>
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Grid Konten (Langkah 4B) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredNews.map(news => (
                    // Render NewsCard (component untuk tampilan per item)
                    <NewsCard key={news.id} news={news} />
                ))}
            </div>
        </div>
    );
}