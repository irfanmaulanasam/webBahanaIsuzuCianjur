import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import Logo from "./Logo";
import data from "../../../data/siteContent.json";
import { NavLink } from "react-router-dom";
import SearchOverlay from "../../search/SearchOverlay";

export default function MobileHeader() {
  const [open, setOpen] = useState(false);
  const [mobileSearchMode, setMobileSearchMode] = useState(false);

  return (
     // =================== MOBILE HEADER ===================
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
                      isActive ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
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
    // <div className="flex md:hidden items-center justify-between h-14 px-4 relative bg-white shadow-sm sticky top-0 z-50">
    //   {/* Hamburger */}
    //   <button onClick={() => setOpen(true)} className="p-2">
    //     <Menu className="w-6 h-6 text-slate-700" />
    //   </button>

    //   {/* Logo Center */}
    //   <div className="absolute left-1/2 transform -translate-x-1/2">
    //     <Logo type="dealer" />
    //   </div>

    //   {/* Right: Search + RPRI Logo */}
    //   <div className="flex items-center gap-3 ml-auto">
    //     <button onClick={() => setMobileSearchMode(true)} className="p-2">
    //       <Search className="w-6 h-6 text-slate-700" />
    //     </button>
    //     <Logo type="rpri" className="h-7" />
    //   </div>

    //   {/* Sidebar Menu */}
    //   {open && (
    //     <>
    //       <div
    //         className="fixed inset-0 bg-black/40 z-40"
    //         onClick={() => setOpen(false)}
    //       ></div>
    //       <div
    //         className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
    //           open ? "translate-x-0" : "-translate-x-full"
    //         }`}
    //       >
    //         <div className="flex items-center justify-between p-4 border-b">
    //           <h2 className="text-lg font-semibold">Menu</h2>
    //           <button onClick={() => setOpen(false)} className="p-2">
    //             <X className="w-5 h-5 text-slate-600" />
    //           </button>
    //         </div>

    //         <nav className="flex flex-col p-4 space-y-3">
    //           {data.header.menu.map((m) => (
    //             <NavLink
    //               key={m.path}
    //               to={m.path}
    //               onClick={() => setOpen(false)}
    //               className={({ isActive }) =>
    //                 `block px-2 py-1 rounded-md ${
    //                   isActive
    //                     ? "bg-blue-600 text-white"
    //                     : "text-slate-700 hover:bg-slate-100"
    //                 }`
    //               }
    //             >
    //               {m.title}
    //             </NavLink>
    //           ))}
    //         </nav>
    //       </div>
    //     </>
    //   )}

    //   {/* Mobile Search Overlay */}
    //   {mobileSearchMode && (
    //     <SearchOverlay
    //       onClose={() => setMobileSearchMode(false)}
    //       placeholder="Cari produk..."
    //     />
    //   )}
    // </div>
  // );
}
