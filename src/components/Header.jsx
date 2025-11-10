import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
// Gunakan struktur menu terbaru (asumsi sudah diperbarui di siteContent.json)
import data from "../data/siteContent.json"; 
import { Menu, X, Search, ChevronDown, ChevronUp } from "lucide-react";
import logoDealer from "../assets/logo-bahana.png";
import logoRPRI from "../assets/logorpri.jpg";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);
  const [leaveTimer, setLeaveTimer] = useState(null);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isSearchPage = location.pathname.startsWith("/search");

  // 🔹 Fokus otomatis saat searchMode aktif
  useEffect(() => {
    if (searchMode) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [searchMode]);

  // 🔹 Menutup dropdown jika klik di luar (Desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // 🔹 Handle penutupan dropdown desktop dengan delay
  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // Delay 200ms
    setLeaveTimer(timer);
  };
  
  // 🔹 Handle pembukaan dropdown desktop
  const handleMouseEnter = (index) => {
    if (leaveTimer) {
      clearTimeout(leaveTimer);
      setLeaveTimer(null);
    }
    setActiveDropdown(index);
  };

  // 🔹 Handle pencarian
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchMode(false);
      setQuery("");
      setOpen(false);
    }
  };

  // ======================================================
  // ===================  DESKTOP HEADER  ==================
  // ======================================================
  const renderDesktopMenu = () => {
    if (searchMode) {
      // Tampilan Search Aktif
      return (
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
      );
    }

    // Tampilan Menu Normal (dengan Dropdown stabil)
    return (
      <div className="flex items-center gap-6" ref={dropdownRef}>
        {data.header.menu.map((m, index) => {
          const hasSubmenu = m.submenu && m.submenu.length > 0;
          const isActive = location.pathname.startsWith(m.path);

          if (!hasSubmenu) {
            // ➡️ Item menu biasa tanpa submenu
            return (
              <NavLink
                key={m.path}
                to={m.path}
                className={({ isActive: isNavLinkActive }) =>
                  isNavLinkActive || isActive
                    ? "font-semibold text-bahana-primary" // Teks aktif Biru Primary
                    : "text-gray-700 hover:text-bahana-dark transition" // Teks hover Biru Dark
                }
                onClick={() => setActiveDropdown(null)}
              >
                {m.title}
              </NavLink>
            );
          }

          // ➡️ Item menu dengan submenu (Dropdown stabil)
          return (
            <div
              key={m.title}
              className="relative"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 p-2 rounded-md ${
                  activeDropdown === index || isActive
                    ? "font-semibold text-bahana-primary" // Teks aktif Biru Primary
                    : "text-gray-700 hover:text-bahana-dark transition" // Teks hover Biru Dark
                }`}
              >
                {m.title}
                {activeDropdown === index ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Konten Dropdown */}
              {activeDropdown === index && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {m.submenu.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      className={({ isActive: isSubActive }) =>
                        `block px-4 py-2 text-sm hover:bg-bahana-light ${ // Hover latar Light
                          isSubActive ? "font-semibold text-bahana-primary" : "text-gray-700" // Teks aktif Biru Primary
                        }`
                      }
                      onClick={() => setActiveDropdown(null)}
                    >
                      {sub.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Search Icon */}
        {!isSearchPage && (
          <button
            onClick={() => {
              setSearchMode(true);
              setActiveDropdown(null);
            }}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    );
  };

  // ======================================================
  // ===================  MOBILE HEADER  ==================
  // ======================================================
  const renderMobileMenu = () => (
    <div
      className={` fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-slate-800">Navigasi</h2>
        <button onClick={() => setOpen(false)} className="p-2">
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Form Search di Sidebar */}
      {!isSearchPage && (
        <form
          onSubmit={handleSearch}
          className="flex items-center p-1 border-b space-x-2 bg-bahana"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari..."
            className="flex-1 border rounded-md px-3 py-1 outline-none text-sm"
          />
          <button type="submit" className="text-slate-600 hover:text-bahana-primary">
            <Search className="w-5 h-5" />
          </button>
        </form>
      )}

      {/* Menu List Mobile (dengan Toggle Submenu) */}
      <nav className="flex flex-col p-2 space-y-1">
        {data.header.menu.map((m, index) => {
          const hasSubmenu = m.submenu && m.submenu.length > 0;
          const isSubmenuOpen = openMobileSubmenu === index;
          
          if (!hasSubmenu) {
            // ➡️ Item menu biasa
            return (
              <NavLink
                key={m.path}
                to={m.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md ${
                    isActive
                      ? "bg-bahana-primary text-white" // Latar aktif Biru Primary
                      : "text-slate-900 hover:bg-bahana-light-10" // Hover latar Light
                  }`
                }
              >
                {m.title}
              </NavLink>
            );
          }

          // ➡️ Item menu dengan Toggle Submenu
          return (
            <div key={m.title} className="w-full">
                {/* Tombol Utama Menu (untuk membuka submenu) */}
                <button
                    type="button"
                    onClick={() => setOpenMobileSubmenu(isSubmenuOpen ? null : index)}
                    className={`flex justify-between items-center w-full px-3 py-2 rounded-md transition-colors ${
                        isSubmenuOpen
                          ? "bg-bahana-light text-gray-100 font-semibold" // Latar Light, teks Primary
                          : "text-slate-700 hover:bg-bahana-light" // Hover latar Light
                    }`}
                >
                    {m.title}
                    {isSubmenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Konten Submenu */}
                {isSubmenuOpen && (
                   <div className="flex flex-col pl-4 mt-1 space-y-1 border-l-2 border-bahana-primary">
                        {m.submenu.map((sub) => (
                            <NavLink
                                key={sub.path}
                                to={sub.path}
                                onClick={() => setOpen(false)}
                                className={({ isActive: isSubActive }) =>
                                    `block px-3 py-1 text-sm transition-colors ${
                                        isSubActive
                                          ? "text-bahana-primary underline font-semibold" // Aktif: Text Primary + Underline
                                          : "text-slate-600 hover:underline hover:text-bahana-primary" // Hover: Text Primary + Underline (tanpa bg)
                                    }`
                                }
                            >
                                {sub.title}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
          );
        })}
      </nav>
    </div>
  );


  // ======================================================
  // ===================  MAIN RENDER  ==================
  // ======================================================
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* === DESKTOP === */}
      <div className="hidden md:flex h-16 items-center justify-between max-w-7xl mx-auto px-6">
        {/* Left: Dealer Logo & Center: Menu */}
        <img src={logoDealer} alt="Dealer" className="h-8" />
        {renderDesktopMenu()}
        {/* Right: RPRI Logo */}
        <img src={logoRPRI} alt="RPRI" className="h-8" />
      </div>

      {/* ==================== MOBILE =================== */}
      <div className="flex md:hidden items-center justify-between h-14 px-4 relative ">
        {/* Left: Hamburger */}
        <button onClick={() => setOpen(true)} className="p-2">
          <Menu className="w-6 h-6 text-slate-700" />
        </button>

        {/* Center: Dealer Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src={logoDealer} alt="Dealer" className="h-8" />
        </div>

        {/* Right: RPRI Logo */}
        <img src={logoRPRI} alt="RPRI" className="h-7 ml-auto" />

        {/* Overlay Sidebar */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          ></div>
        )}

        {/* Sidebar Menu (Mobile) */}
        {renderMobileMenu()}
      </div>
      {/* Garis bawah menggunakan warna biru utama */}
      <hr className="border-bahana-primary w-full"/>
    </header>
  );
}