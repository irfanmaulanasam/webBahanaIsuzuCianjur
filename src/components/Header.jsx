import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import data from "../data/siteContent.json";
import { Menu, X, Search } from "lucide-react";
import logoDealer from "../assets/logo-dealer.jpg";
import logoRPRI from "../assets/logorpri.jpg";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // 🔹 Scroll ke atas otomatis saat search aktif
  useEffect(() => {
    if (searchMode) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Fokus otomatis ke input setelah animasi scroll
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [searchMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchMode(false);
      setQuery("");
    }
  };

  return (
    <header className="container bg-white shadow-sm sticky top-0 left-50 z-50">
      {/* === DESKTOP === */}
      <div className="hidden md:flex container h-16 items-center justify-between">
        {/* Left: Dealer Logo */}
        <img src={logoDealer} alt="Dealer" className="h-8" />

        {/* Center: Menu atau Search */}
        {!searchMode ? (
          <div className="flex items-center gap-6">
            {data.header.menu.map((m) => (
              <NavLink
                key={m.path}
                to={m.path}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-black"
                    : "text-gray-700 hover:text-black transition"
                }
              >
                {m.title}
              </NavLink>
            ))}

            {/* Search Icon */}
            <button
              onClick={() => setSearchMode(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        ) : (
          // 🔹 Form search mode
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

      {/* === MOBILE === */}
      <div className="flex md:hidden items-center justify-between h-14 px-4 relative">
        {/* Left: Hamburger */}
        <button onClick={() => setOpen(true)} className="p-2">
          <Menu className="w-6 h-6 text-slate-700" />
        </button>

        {/* Center: Dealer Logo */}
        <img src={logoDealer} alt="Dealer" className="h-8 mx-auto p-5" />

        {/* Right: Search + RPRI Logo */}
        <div className="flex items-center gap-3">
          {!searchMode && (
            <button
              onClick={() => setSearchMode(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Search className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <img src={logoRPRI} alt="RPRI" className="h-7" />
        </div>

        {/* 🔹 Mobile Search Overlay */}
        {searchMode && (
          <div className="absolute inset-0 bg-white flex items-center justify-between px-4 z-50">
            <form onSubmit={handleSearch} className="flex items-center flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari produk..."
                className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none text-sm"
              />
            </form>
            <button
              onClick={() => setSearchMode(false)}
              className="ml-3 p-2 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Sidebar Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          ></div>
        )}

        {/* Sidebar Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={() => setOpen(false)} className="p-2">
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <nav className="flex flex-col p-4 space-y-3">
            {data.header.menu.map((m) => (
              <NavLink
                key={m.path}
                to={m.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-2 py-1 rounded-md ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {m.title}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
