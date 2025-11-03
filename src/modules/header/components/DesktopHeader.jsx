import { useState } from "react";
import { NavLink } from "react-router-dom";
import data from "../../../data/siteContent.json";
import { Search } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "../../search/SearchBar";

export default function DesktopHeader() {
  const [searchMode, setSearchMode] = useState(false);

  return (
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
  //   <div className="hidden md:flex h-16 items-center justify-between max-w-7xl mx-auto px-6 bg-white shadow-sm sticky top-0 z-50">
  //     <Logo type="dealer" />

  //     {!searchMode ? (
  //       <div className="flex items-center gap-6">
  //         {data.header.menu.map((m) => (
  //           <NavLink
  //             key={m.path}
  //             to={m.path}
  //             className={({ isActive }) =>
  //               isActive
  //                 ? "font-semibold text-black"
  //                 : "text-gray-700 hover:text-black transition"
  //             }
  //           >
  //             {m.title}
  //           </NavLink>
  //         ))}
  //         <button
  //           onClick={() => setSearchMode(true)}
  //           className="p-2 rounded-md hover:bg-gray-100"
  //         >
  //           <Search className="w-5 h-5 text-gray-700" />
  //         </button>
  //       </div>
  //     ) : (
  //       <SearchBar
  //         placeholder="Cari produk..."
  //         onClose={() => setSearchMode(false)}
  //       />
  //     )}

  //     <Logo type="rpri" />
  //   </div>
  // );
}
