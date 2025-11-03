import SearchBar from "./SearchBar";
import { X } from "lucide-react";
import generateSuggestions from "./utils/generateSuggestions";

export default function SearchOverlay({ onClose, placeholder }) {
  const suggestions = generateSuggestions(); // ✅ biasa, hook tidak digunakan di sini

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-slideDown">
      <div className="flex items-center gap-2 p-3 border-b">
        <button onClick={onClose}>
          <X className="w-6 h-6 text-slate-700" />
        </button>
        <SearchBar placeholder={placeholder} onClose={onClose} autoFocus />
      </div>

      {/* Suggestions */}
      <div className="p-4 text-sm text-slate-500">
        <p className="font-medium text-slate-700 mb-2">Saran Pencarian</p>
        <ul className="space-y-1">
          {suggestions.map((item, idx) => (
            <li key={idx} className="text-slate-600">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
