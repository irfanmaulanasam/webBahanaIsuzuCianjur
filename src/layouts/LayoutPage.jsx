import HeaderLama from "../components/Headerlama";
// import Header from "../modules/header/Header"
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
        <HeaderLama />
        <main className="min-h-screen container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Footer />
    </>
  );
}