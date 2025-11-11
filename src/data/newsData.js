// src/data/newsData.js
export const newsContent = [    
    {
        id: "dummy1",
        slug: "promo-spesial-2024",
        type: "promo", 
        category: "umum",
        title: "Promo Spesial Tahun 2024",
        imageUrl: "/assets/images/placeholder.jpg",
        date: "2024-01-15",
        excerpt: "Dapatkan penawaran spesial untuk produk terbaru kami"
    },
    {
        id: "dummy2", 
        slug: "teknologi-terkini",
        type: "news",
        category: "teknologi", 
        title: "Inovasi Teknologi Terkini",
        imageUrl: "/assets/images/placeholder.jpg",
        date: "2024-01-10",
        excerpt: "Temukan perkembangan terbaru dalam dunia teknologi"
    },
    // --- PROMO ---
    {
        id: 'p001',
        slug: "promo-giga-spesial",
        type: "promo", // PENTING untuk filtering
        category: "truk-berat",
        title: "Diskon Akhir Tahun Truk GIGA & Gratis Service",
        summary: "Dapatkan diskon puluhan juta, angsuran ringan, dan free service 5.000 km pertama untuk pembelian GIGA.",
        imageUrl: "/assets/images/promo/giga_promo.jpg",
        date: "2025-11-01", // Tanggal rilis
        expiryDate: "2025-12-31", // Tanggal berakhir (Untuk promo/event)
        isPinned: true, // Konten unggulan
        content: "<p>Detail lengkap promo...</p>" // Konten detail dalam format HTML/Markdown
    },
    // --- EVENT ---
    {
        id: 'e001',
        slug: "event-jakarta-fair",
        type: "event",
        category: "umum",
        title: "Isuzu Hadir di Jakarta Fair 2026",
        summary: "Kunjungi booth kami di Hall D! Ada demo unit Traga dan hadiah eksklusif.",
        imageUrl: "/assets/images/event/jakarta_fair.jpg",
        date: "2026-01-05", 
        expiryDate: "2026-01-15", 
        isPinned: false, 
        location: "JIEXPO Kemayoran, Jakarta",
        content: "<p>Detail acara dan jadwal demo...</p>" 
    },
    // --- BERITA ---
    {
        id: 'n001',
        slug: "berita-isuzu-best-commercial",
        type: "berita",
        category: "penghargaan",
        title: "Isuzu Raih Penghargaan Best Commercial Vehicle 2025",
        summary: "Pengakuan atas ketangguhan mesin dan efisiensi bahan bakar.",
        imageUrl: "/assets/images/news/award_2025.jpg",
        date: "2025-10-20", 
        isPinned: false, 
        content: "<p>Detail berita penghargaan...</p>"
    },
    // Temporary: Tambah data dummy di newsData.js
    {
        id: "dummy6",
        slug: "promo-spesial-2024",
        type: "promo", 
        category: "umum",
        title: "Promo Spesial Tahun 2024",
        imageUrl: "/assets/images/placeholder.jpg",
        date: "2024-01-15",
        excerpt: "Dapatkan penawaran spesial untuk produk terbaru kami"
    },
    {
        id: "dummy7", 
        slug: "teknologi-terkini",
        type: "news",
        category: "teknologi", 
        title: "Inovasi Teknologi Terkini",
        imageUrl: "/assets/images/placeholder.jpg",
        date: "2024-01-10",
        excerpt: "Temukan perkembangan terbaru dalam dunia teknologi"
    },
];
// Export semua category yang ada (untuk filtering/tab)
export const allCategories = ['promo', 'event', 'berita'];
export default {
  newsContent,
  allCategories
};