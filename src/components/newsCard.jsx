// src/components/NewsCard.jsx
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';

// Helper function untuk badge type (sama seperti di NewsDetailPage)
const getTypeBadge = (type) => {
  const baseClasses = "text-xs font-semibold px-2 py-1 rounded";
  
  switch (type?.toLowerCase()) {
    case 'promo':
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
    case 'event':
      return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`;
    case 'news':
    default:
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
  }
};

// Helper function untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const NewsCard = ({ news }) => {
  if (!news) return null;

  return (
    <Link 
      to={`/news/${news.slug}`}
      className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      {/* Gambar Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={news.imageUrl || '/assets/placeholder.jpg'} 
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.src = '/assets/placeholder.jpg';
          }}
        />
        
        {/* Badge Type */}
        <div className="absolute top-3 left-3">
          <span className={getTypeBadge(news.type)}>
            {news.type?.toUpperCase() || 'NEWS'}
          </span>
        </div>
      </div>

      {/* Konten Card */}
      <div className="p-4">
        {/* Judul */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-tight">
          {news.title}
        </h3>

        {/* Deskripsi Singkat */}
        {news.excerpt && (
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
            {news.excerpt}
          </p>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
          {/* Tanggal */}
          {news.date && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(news.date)}</span>
            </div>
          )}

          {/* Waktu (jika ada) */}
          {news.time && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{news.time}</span>
            </div>
          )}

          {/* Lokasi (jika event) */}
          {news.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span className="line-clamp-1">{news.location}</span>
            </div>
          )}

          {/* Kategori */}
          {news.category && (
            <div className="flex items-center gap-1">
              <Tag size={14} />
              <span>{news.category}</span>
            </div>
          )}
        </div>

        {/* Read More Button */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
            Baca Selengkapnya →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;