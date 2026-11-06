import React from "react";

// Reusable Button component with #A54100 primary brand color
export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  disabled = false,
  className = "",
  icon: Icon,
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-2.5 text-base gap-2",
  };

  const variantClasses = {
    primary: "bg-[#A54100] hover:bg-[#8A3600] text-white shadow-xs",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300",
    outline: "bg-transparent hover:bg-[#FFF5EE] text-[#A54100] border border-[#A54100]",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
