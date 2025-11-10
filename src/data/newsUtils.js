// src/data/newsUtils.js

import newsData,{ newsContent } from "./newsData";

export const getAllNewsSorted = () => {
    // Pastikan sorting dari terbaru ke terlama
    return [...newsContent].sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Mendapatkan satu item konten berdasarkan slug.
 * @param {string} slug - Slug URL item.
 * @returns {Object|null} Item konten atau null jika tidak ditemukan.
 */
export const getNewsBySlug = (slug) => {
    return newsContent.find(item => item.slug === slug) || null;
};

/**
 * Mendapatkan konten berdasarkan tipe (promo, event, berita).
 * @param {string} type - Tipe konten yang dicari.
 * @returns {Array} Daftar konten berdasarkan tipe.
 */
export const getNewsByType = (type) => {
    const all = getAllNewsSorted();
    return all.filter(item => item.type.toLowerCase() === type.toLowerCase());
};

/**
 * Mendapatkan konten unggulan (pinned)
 */
export const getPinnedNews = () => {
    const all = getAllNewsSorted();
    return all.filter(item => item.isPinned);
};
export const getRelatedNews = (currentSlug, currentCategory, limit = 3) => {
    const all = getAllNewsSorted();

    // 1. Filter: Cari item yang memiliki category yang sama TAPI bukan artikel yang sedang dibuka
    const related = all.filter(item => 
        item.category === currentCategory && item.slug !== currentSlug
    );

    // 2. Jika item terkait kurang dari limit, coba tambahkan item dari tipe yang sama
    if (related.length < limit) {
        const moreRelated = all.filter(item => 
            item.type === newsContent.find(n => n.slug === currentSlug)?.type && 
            item.slug !== currentSlug &&
            !related.includes(item) // Hindari duplikasi
        );
        related.push(...moreRelated);
    }
    
    // 3. Batasi jumlah item
    return related.slice(0, limit);
};