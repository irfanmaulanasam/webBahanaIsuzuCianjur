// src/router.jsx
import { lazy, Suspense } from 'react' // 👈 Import lazy dan Suspense
import { createBrowserRouter } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner';
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
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))


// Komponen Fallback saat halaman sedang dimuat
// const LoadingFallback = () => (
//     <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">
//         Memuat Halaman...
//     </div>
// );


// =======================================================
// 🟢 2. Definisi Router
// =======================================================
export const router = createBrowserRouter([
  {
    path: '/',
    // Gunakan Suspense di elemen teratas untuk menangani loading state dari semua child rute
    element: (
        <Suspense fallback={<LoadingSpinner />}>
            <Layout />
        </Suspense>
    ), 
    children: [
      { index: true, 
        element:(
          <Suspense fallback={<LoadingSpinner/>}>
         <Home /> 
         </Suspense>
         )
      },
      
      // Rute Products
      { path: 'products',
        element:(
          <Suspense fallback={<LoadingSpinner/>}>
         <ProductPage />
         </Suspense>
         )
      },
      { path: 'products/unit-order', element:(
          <Suspense fallback={<LoadingSpinner/>}>
            <UnitOrderForm /> 
         </Suspense>
         ) 
        },
      { path: 'products/:slug', element:(
          <Suspense fallback={<LoadingSpinner/>}>
         <ProductPage /> 
         </Suspense>
         )
      },
      
      // Rute Spesifikasi
      { path: 'spec/:slug', element:(
          <Suspense fallback={<LoadingSpinner/>}>
           <SpecWrapper /> 
         </Suspense>
         )
      },
      
      // Rute Vehicle Cost
      { path: 'vehicle-cost', element:(
        <Suspense fallback={<LoadingSpinner/>}>
           <VehicleCost /> 
         </Suspense>
         )
      },
      { path: 'vehicle-cost/:slug', element:(
          <Suspense fallback={<LoadingSpinner/>}>
         <VehicleCost /> 
         </Suspense>
         )
      },
      
      // Rute Lain
      { path: 'about', element:(
          <Suspense fallback={<LoadingSpinner/>}>
            <AboutPage /> 
         </Suspense>
         )
      },
      { path: 'news', element:(
        <Suspense fallback={<LoadingSpinner/>}>
          <NewsPages/>
         </Suspense>
         )
      },
      { path: 'news/:slug', element:(
          <Suspense fallback={<LoadingSpinner/>}>
          <NewsDetailPage /> 
         </Suspense>
         )
      },
      { path: 'news/promo', element:(
          <Suspense fallback={<LoadingSpinner/>}>
          <NewsPages /> 
         </Suspense>
         )
      },
      { path: 'news/event', element:(
          <Suspense fallback={<LoadingSpinner/>}>
          <NewsPages /> 
         </Suspense>
         )
      },
      { path: 'search', element:(
        <Suspense fallback={<LoadingSpinner/>}>
          <SearchPage /> 
         </Suspense>
         )
      },
      
      // Rute Services
      { path: 'services/dealer-services', element:(
          <Suspense fallback={<LoadingSpinner/>}>
           <BookingServiceForm />
         </Suspense>
         )
      },
      { path: 'services/bib-services', element:(
          <Suspense fallback={<LoadingSpinner/>}>
           <BookingServiceFormBIB /> 
         </Suspense>
         )
      },
      { path: 'services/sparepart-order', element:(
          <Suspense fallback={<LoadingSpinner/>}>
           <SparepartOrderForm />
         </Suspense>
         )
       },
      { path: 'outlet', element:(
          <Suspense fallback={<LoadingSpinner/>}>
           <OutletPage /> 
         </Suspense>
         )
      },
      { path: 'credit-simulator', element:(
          <Suspense fallback={<LoadingSpinner/>}>
            <CreditSimulatorPages/> 
         </Suspense>
         )
},
      
      // Rute 404 (Wildcard)
      { path: '*',
        element: <NotFound/> 
      }
    ]
  }
]);