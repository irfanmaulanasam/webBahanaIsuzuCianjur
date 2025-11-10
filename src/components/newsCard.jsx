import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag, Calendar } from 'lucide-react';

// Helper untuk mendapatkan warna badge berdasarkan tipe
const getTypeBadge = (type) => {
    switch (type) {
        case 'promo':
            return 'bg-red-500 text-white';
        case 'event':
            return 'bg-blue-500 text-white';
        case 'berita':
            return 'bg-green-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

export default function NewsCard({ news }) {
    // Menghitung hari tersisa (Hanya untuk Promo/Event)
    const getDaysRemaining = (expiryDate) => {
        if (!expiryDate) return null;
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 0) return 'Telah Berakhir';
        return `${diffDays} hari lagi`;
    };

    const daysRemaining = news.type !== 'berita' ? getDaysRemaining(news.expiryDate) : null;
    const isExpired = daysRemaining === 'Telah Berakhir';
    
    // URL target untuk detail berita
    const detailUrl = `/news/${news.slug}`;

    return (
        // Gunakan <Link> agar card menjadi clickable dan tambahkan efek hover
        <Link 
            to={detailUrl} 
            className={`
                block overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1 
                ${isExpired ? 'opacity-50 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
            `}
        >
            {/* Area Gambar */}
            <div className="relative h-48 w-full">
                {/* Gambar Thumbnail (pastikan path gambar benar) */}
                <img 
                    src={news.imageUrl || '/assets/placeholder.jpg'} 
                    alt={news.title} 
                    className="w-full h-full object-cover" 
                />
                
                {/* Badge Tipe di Sudut (agar menonjol) */}
                <span 
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full ${getTypeBadge(news.type)}`}
                >
                    <Tag className="inline w-3 h-3 mr-1" />
                    {news.type.toUpperCase()}
                </span>
                
                {/* Badge Urgency (untuk Promo/Event) */}
                {daysRemaining && (
                    <span 
                        className={`absolute bottom-0 right-0 px-3 py-1 text-xs font-bold text-white ${isExpired ? 'bg-gray-700' : 'bg-red-600'}`}
                    >
                        <Clock className="inline w-3 h-3 mr-1" />
                        {daysRemaining}
                    </span>
                )}
            </div>

            {/* Area Konten */}
            <div className="p-4 sm:p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {news.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                    {news.summary}
                </p>
                
                {/* Meta Data */}
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t dark:border-gray-700">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(news.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>
        </Link>
    );
}