import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/LayoutPage";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import SpecWrapper from "./pages/specWrapper.jsx";
import OutletPage from "./pages/OutletPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage.jsx";
import VehicleCost from "./pages/VehicleCost"
import CreditSimulatorPages from "./pages/CreditSimulatorPages";
import SearchPage from "./pages/SearchPage";
import { allSpecSlugs } from "./data/specs";

export default function App() {
  const defaultSlug = allSpecSlugs[0];
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vehicle-cost" element={<VehicleCost/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/products" element={<ProductPage />} />
        <Route path="/" element={<Navigate to={`/spec/${defaultSlug}`} replace />} />
        <Route path="/spec/:slug" element={<SpecWrapper />} />
        <Route path="*" element={<div className="p-8">Halaman tidak ditemukan</div>} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/outlet" element={<OutletPage />} />
        <Route path="/credit-simulator" element={<CreditSimulatorPages/>} />
      </Route>
    </Routes>
  );
}
