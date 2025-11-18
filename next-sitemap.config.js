/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Ganti dengan domain proyek Anda
  siteUrl: process.env.SITE_URL || 'https://yourdomain.com', 
  generateRobotsTxt: true, // (opsional) untuk membuat robots.txt juga
  // ... opsi konfigurasi lainnya
}