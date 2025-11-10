// src/router.jsx
import React, { lazy, Suspense } from 'react' // 👈 Import lazy dan Suspense
import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/LayoutPage' 
// import { allSpecSlugs } from "./data/specs"; // Dapatkan jika diperlukan

// =======================================================
// 🟢 1. Definisi Komponen Halaman Menggunakan lazy()
// Ganti semua import halaman statis dengan dynamic import
// =======================================================
const Home = lazy(() => import('./pages/Home'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const SpecWrapper = lazy(() => import('./pages/specWrapper.jsx'))
const OutletPage = lazy(() => import('./pages/OutletPage'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const VehicleCost = lazy(() => import('./pages/VehicleCost'))
const CreditSimulatorPages = lazy(() => import('./pages/CreditSimulatorPages'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const NewsPages = lazy(() => import('./pages/NewsPages.jsx'))
const UnitOrderForm = lazy(() => import('./pages/UnitOrderForm.jsx'))
const BookingServiceForm = lazy(() => import('./pages/BookingServiceForm.jsx'))
const BookingServiceFormBIB = lazy(() => import('./pages/BookingServiceFormBIB.jsx'))
const SparepartOrderForm = lazy(() => import('./pages/SparepartOrderForm.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))


// Komponen Fallback saat halaman sedang dimuat
const LoadingFallback = () => (
    <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">
        Memuat Halaman...
    </div>
);


// =======================================================
// 🟢 2. Definisi Router
// =======================================================
export const router = createBrowserRouter([
  {
    path: '/',
    // Gunakan Suspense di elemen teratas untuk menangani loading state dari semua child rute
    element: (
        <Suspense fallback={<LoadingFallback />}>
            <Layout />
        </Suspense>
    ), 
    children: [
      { index: true, element: <Home /> },
      
      // Rute Products
      { path: 'products', element: <ProductPage /> },
      { path: 'products/unit-order', element: <UnitOrderForm /> },
      { path: 'products/:slug', element: <ProductPage /> },
      
      // Rute Spesifikasi
      { path: 'spec/:slug', element: <SpecWrapper /> },
      // ... Anda perlu menangani redirect untuk '/spec' di SpecWrapper atau menggunakan redirect()
      
      // Rute Vehicle Cost
      { path: 'vehicle-cost', element: <VehicleCost /> },
      { path: 'vehicle-cost/:slug', element: <VehicleCost /> },
      
      // Rute Lain
      { path: 'about', element: <AboutPage /> },
      { path: 'news', element: <NewsPages/>},
      { path: 'search', element: <SearchPage /> },
      
      // Rute Services
      { path: 'services/dealer-services', element: <BookingServiceForm /> },
      { path: 'services/bib-services', element: <BookingServiceFormBIB /> },
      { path: 'services/sparepart-order', element: <SparepartOrderForm /> },
      
      { path: 'outlet', element: <OutletPage /> },
      { path: 'credit-simulator', element:<CreditSimulatorPages/> },
      
      // Rute 404 (Wildcard)
      { path: '*', element: <NotFound/> }
    ]
  }
]);
// // src/router.jsx
// import { createBrowserRouter } from 'react-router-dom'
// import Layout from './layouts/LayoutPage' 
// import Home from './pages/Home'
// import ProductPage from "./pages/ProductPage";
// import SpecWrapper from "./pages/specWrapper.jsx";
// import OutletPage from "./pages/OutletPage";
// import AboutPage from "./pages/AboutPage.jsx";
// import VehicleCost from "./pages/VehicleCost";
// import CreditSimulatorPages from "./pages/CreditSimulatorPages";
// import SearchPage from "./pages/SearchPage";
// import NewsPages from "./pages/NewsPages.jsx";
// import UnitOrderForm from "./pages/UnitOrderForm.jsx"
// import BookingServiceForm from "./pages/BookingServiceForm.jsx"
// import BookingServiceFormBIB from "./pages/BookingServiceFormBIB.jsx"
// import SparepartOrderForm from "./pages/SparepartOrderForm.jsx"
// import NotFound from "./pages/NotFound.jsx";
// import { allSpecSlugs } from "./data/specs";

// // Definisikan defaultSlug (sama seperti di App.jsx lama)
// const defaultSlug = allSpecSlugs[0];

// export const router = createBrowserRouter([
//   {
//     // Rute utama menggunakan Layout
//     path: '/',
//     element: <Layout />, 
//     children: [
//       { index: true, element: <Home /> },
      
//       // Rute Products
//       { path: 'products', element: <ProductPage /> },
//       { path: 'products/unit-order', element: <UnitOrderForm /> },
//       { path: 'products/:slug', element: <ProductPage /> },
      
//       // Rute Spesifikasi
//       { path: 'spec/:slug', element: <SpecWrapper /> },
//       // Mengganti <Navigate> dengan redirect
//       { 
//         path: 'spec', 
//         element: <SpecWrapper />, 
//         loader: () => {
//              // Jika ingin redirect, gunakan throw redirect dari React Router
//              // Namun, cara termudah adalah dengan Navigasi dari komponen
//              return null;
//         }
//       },
      
//       // Rute Vehicle Cost
//       { path: 'vehicle-cost', element: <VehicleCost /> },
//       { path: 'vehicle-cost/:slug', element: <VehicleCost /> },
      
//       // Rute Lain
//       { path: 'about', element: <AboutPage /> },
//       { path: 'news', element: <NewsPages/>},
//       { path: 'search', element: <SearchPage /> },
      
//       // Rute Services
//       { path: 'services/dealer-services', element: <BookingServiceForm /> },
//       { path: 'services/bib-services', element: <BookingServiceFormBIB /> },
//       { path: 'services/sparepart-order', element: <SparepartOrderForm /> },
      
//       { path: 'outlet', element: <OutletPage /> },
//       { path: 'credit-simulator', element:<CreditSimulatorPages/> },
      
//       // Rute 404 (Wildcard)
//       { path: '*', element: <NotFound/> }
//     ]
//   }
// ]);