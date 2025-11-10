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
import NewsPages from "./pages/NewsPages.jsx";
import UnitOrderForm from "./pages/UnitOrderForm.jsx"
import BookingServiceForm from "./pages/BookingServiceForm.jsx"
import BookingServiceFormBIB from "./pages/BookingServiceFormBIB.jsx"
import SparepartOrderForm from "./pages/SparepartOrderForm.jsx"
import NotFound from "./pages/NotFound.jsx";
import { allSpecSlugs } from "./data/specs";

export default function App() {
  const defaultSlug = allSpecSlugs[0];

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/unit-order" element={<UnitOrderForm />} />
        <Route path="/products/:slug" element={<ProductPage />} />
        <Route path="/spec/:slug" element={<SpecWrapper />} />
        <Route path="/spec" element={<Navigate to={`/spec/${defaultSlug}`} replace />}/>
        <Route path="/vehicle-cost/" element={<VehicleCost />} />
        <Route path="/vehicle-cost/:slug" element={<VehicleCost />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/news" element={<NewsPages/>} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/services/dealer-services" element={<BookingServiceForm />} />
        <Route path="/services/bib-services" element={<BookingServiceFormBIB />} />
        <Route path="/services/sparepart-order" element={<SparepartOrderForm />} />
        <Route path="/outlet" element={<OutletPage />} />
        <Route path="/credit-simulator/" element={<CreditSimulatorPages />} />
        <Route path="*" element={<NotFound/>} />
      </Route>
    </Routes>
  );
}
