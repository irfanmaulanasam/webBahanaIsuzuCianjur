import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/LayoutPage";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import OutletPage from "./pages/OutletPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/aboutpage.jsx";
import VehicleCost from "./pages/VehicleCost"
import CreditSimulatorPages from "./pages/CreditSimulatorPages";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vehicle-cost" element={<VehicleCost/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/products" element={<ProductPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/outlet" element={<OutletPage />} />
        <Route path="/credit-simulator" element={<CreditSimulatorPages/>} />
      </Route>
    </Routes>
  );
}