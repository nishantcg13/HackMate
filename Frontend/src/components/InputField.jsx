import React from "react";

// Simple and clean input field component
export default function InputField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon,
  className = "",
  helperText,
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-semibold text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-white border ${
            error ? "border-red-500" : "border-gray-300"
          } text-gray-900 placeholder-gray-400 text-sm rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            Icon ? "pl-9" : ""
          }`}
        />
      </div>

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
