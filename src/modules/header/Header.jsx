import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import data from "../../data/siteContent.json";
import logoDealer from "../../assets/logo-dealer.jpg";
import logoRPRI from "../../assets/logorpri.jpg";

export default function Header() {
  const navigate= useNavigate();
  const [open, setOpen] = useState(false); // sidebar mobile
  const [searchMode, setSearchMode] = useState(false); // desktop search toggle
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const location = useLocation();

  // 🔹 Cek apakah di halaman /search
  const isSearchPage = location.pathname.startsWith("/search");

  // 🔹 Fokus input saat searchMode aktif di desktop
  useEffect(() => {
    if (searchMode) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [searchMode]);

  // 🔹 Handle pencarian
  const handleSearch = (e) => {
    e.preventDefault();
      if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setQuery("");
        setSearchMode(false); // desktop
        setOpen(false); // mobile
      }
      // if (query.trim()) {
      // window.location.href = `/search?q=${encodeURIComponent(query)}`; // navigasi aman di header
      // setQuery("");
      // setSearchMode(false);
      // setOpen(false);
      // }
  };

  // =================== DESKTOP HEADER ===================
  const DesktopHeader = () => (
    <div className="hidden md:flex h-16 items-center justify-between max-w-7xl mx-auto px-6">
      {/* Left: Dealer Logo */}
      <img src={logoDealer} alt="Dealer" className="h-8" />

      {/* Center: Menu or Search */}
      {!searchMode ? (
        <div className="flex items-center gap-6">
          {data.header.menu.map((m) => (
            <NavLink
              key={m.path}
              to={m.path}
              className={({ isActive }) =>
                isActive ? "font-semibold text-black" : "text-gray-700 hover:text-black transition"
              }
            >
              {m.title}
            </NavLink>
          ))}

          {/* Hide search button if already on search page */}
          {!isSearchPage && (
            <button onClick={() => setSearchMode(true)} className="p-2 rounded-md hover:bg-gray-100">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSearch}
          className="flex items-center border rounded-md px-3 py-1 w-72 bg-gray-50"
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button type="button" onClick={() => setSearchMode(false)}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </form>
      )}

      {/* Right: RPRI Logo */}
      <img src={logoRPRI} alt="RPRI" className="h-8" />
    </div>
  );

  // =================== MOBILE HEADER ===================
  const MobileHeader = () => (
    <div className="flex md:hidden items-center justify-between h-14 px-4 relative">
      {/* Hamburger */}
      <button onClick={() => setOpen(true)} className="p-2">
        <Menu className="w-6 h-6 text-slate-700" />
      </button>

      {/* Logo Dealer */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <img src={logoDealer} alt="Dealer" className="h-8" />
      </div>

      {/* RPRI Logo */}
      <img src={logoRPRI} alt="RPRI" className="h-7 ml-auto" />

      {/* Sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          {/* overlay */}
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />

          {/* Sidebar container */}
          <div className="relative w-64 bg-white shadow-lg">
            {/* 🔹 Search bar di atas menu */}
            {!isSearchPage && (
              <form
                onSubmit={handleSearch}
                className="flex items-center p-4 border-b space-x-2"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari produk..."
                  className="flex-1 bg-gray-50 border rounded-md px-3 py-1 outline-none text-sm"
                />
                <button type="submit" className="p-1 text-slate-600 hover:text-black">
                  <Search className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* Menu List */}
            <nav className="flex flex-col p-4 space-y-3">
              {data.header.menu.map((m) => (
                <NavLink
                  key={m.path}
                  to={m.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-2 py-1 rounded-md ${
                      isActive ? "bg-white text-white" : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  {m.title}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <DesktopHeader />
      <MobileHeader />
    </header>
  );
}

// import DesktopHeader from "./components/DesktopHeader";
// import MobileHeader from "./components/MobileHeader";

// export default function Header() {
//   return (
//     <>
//       <DesktopHeader />
//       <MobileHeader />
//     </>
//   );
// }
