import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function SearchBar({ placeholder, onClose, autoFocus }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // ✅ Boleh pakai hook di sini
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`); // ✅ di sini aman
      setQuery("");
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-1 items-center bg-gray-100 rounded-md px-3 py-2">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm"
      />
      <button type="submit">
        <Search className="w-5 h-5 text-slate-600" />
      </button>
    </form>
  );
}
