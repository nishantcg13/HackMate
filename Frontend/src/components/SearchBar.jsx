import React from "react";
import { Search, X } from "lucide-react";

// Reusable search bar component
export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Search by keyword...",
  className = "",
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
