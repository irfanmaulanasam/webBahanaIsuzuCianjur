// src/components/RelatedNewsCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

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

const RelatedNewsCard = ({ news }) => {
  return (
    <Link 
      to={`/news/${news.slug}`}
      className="block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:scale-[1.02] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full group"
    >
      {/* Gambar */}
      <div className="relative h-32 w-full overflow-hidden">
        <img 
          src={news.imageUrl || '/assets/placeholder.jpg'} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={(e) => {
            e.target.src = '/assets/placeholder.jpg';
          }}
        />
        
        {/* Badge Type */}
        <div className="absolute top-2 left-2">
          <span className={getTypeBadge(news.type)}>
            {news.type?.toUpperCase() || 'NEWS'}
          </span>
        </div>
      </div>
      
      {/* Konten */}
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2 text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
          {news.title}
        </h3>
        
        {/* Tanggal */}
        {news.date && (
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Calendar size={12} />
            <span>
              {new Date(news.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default RelatedNewsCard;