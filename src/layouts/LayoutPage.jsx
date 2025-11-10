import { Outlet ,ScrollRestoration} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <>
      <ScrollRestoration/>
        <Header />
        <main className="min-h-screen container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Footer />
    </>
  );
}