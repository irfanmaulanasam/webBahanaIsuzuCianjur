// src/router.jsx
import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/LayoutPage' 
// Import semua halaman yang diperlukan
import Home from './pages/Home'
import ProductPage from "./pages/ProductPage";
import SpecWrapper from "./pages/specWrapper.jsx";
import OutletPage from "./pages/OutletPage";
import AboutPage from "./pages/AboutPage.jsx";
import VehicleCost from "./pages/VehicleCost";
import CreditSimulatorPages from "./pages/CreditSimulatorPages";
import SearchPage from "./pages/SearchPage";
import NewsPages from "./pages/NewsPages.jsx";
import UnitOrderForm from "./pages/UnitOrderForm.jsx"
import BookingServiceForm from "./pages/BookingServiceForm.jsx"
import BookingServiceFormBIB from "./pages/BookingServiceFormBIB.jsx"
import SparepartOrderForm from "./pages/SparepartOrderForm.jsx"
import NotFound from "./pages/NotFound.jsx";
import { allSpecSlugs } from "./data/specs";

// Definisikan defaultSlug (sama seperti di App.jsx lama)
const defaultSlug = allSpecSlugs[0];

export const router = createBrowserRouter([
  {
    // Rute utama menggunakan Layout
    path: '/',
    element: <Layout />, 
    children: [
      { index: true, element: <Home /> },
      
      // Rute Products
      { path: 'products', element: <ProductPage /> },
      { path: 'products/unit-order', element: <UnitOrderForm /> },
      { path: 'products/:slug', element: <ProductPage /> },
      
      // Rute Spesifikasi
      { path: 'spec/:slug', element: <SpecWrapper /> },
      // Mengganti <Navigate> dengan redirect
      { 
        path: 'spec', 
        element: <SpecWrapper />, 
        loader: () => {
             // Jika ingin redirect, gunakan throw redirect dari React Router
             // Namun, cara termudah adalah dengan Navigasi dari komponen
             return null;
        }
      },
      
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