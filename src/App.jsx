import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/LayoutPage";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import SpecWrapper from "./pages/specWrapper.jsx";
import OutletPage from "./pages/OutletPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage.jsx";
import VehicleCost from "./pages/VehicleCost";
import CreditSimulatorPages from "./pages/CreditSimulatorPages";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound.jsx";
import { allSpecSlugs } from "./data/specs";

export default function App() {
  const defaultSlug = allSpecSlugs[0];

  return (
    <Routes>
      <Route element={<Layout />}>
        {/*
          1. Homepage (index)
          Ini adalah Rute yang dieksekusi saat path adalah "/"
        */}
        <Route index element={<Home />} /> 
        
        {/* Rute spesifikasi dan biaya kendaraan harus memiliki path unik */}
        <Route path="/products" element={<ProductPage />} />
        <Route path="/spec/:slug" element={<SpecWrapper />} />
        <Route path="/vehicle-cost/" element={<VehicleCost />} />
        <Route path="/vehicle-cost/:slug" element={<VehicleCost />} />
        <Route 
          path="/spec" 
          element={<Navigate to={`/spec/${defaultSlug}`} replace />} 
        />
        
        {/* Rute lainnya */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/outlet" element={<OutletPage />} />
        <Route path="/credit-simulator/" element={<CreditSimulatorPages />} />
        
        {/* Fallback 404 - Harus diletakkan paling akhir di dalam Route element */}
        <Route path="*" element={<NotFound/>} />
      </Route>
    </Routes>
  );
}
