import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/LayoutPage";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import SearchPage from "./pages/SearchPage";
import OutletPage from "./pages/OutletPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPAge";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/products" element={<ProductPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/outlet" element={<OutletPage />} />
        <Route path="/search" element={<SearchPage/>}/>
      </Route>
    </Routes>
  );
}