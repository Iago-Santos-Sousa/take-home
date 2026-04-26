"use client";

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  requiredMark?: boolean;
}

export default function FormInput({
  label,
  error,
  requiredMark,
  className,
  type,
  ...props
}: FormInputProps) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {requiredMark && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={[
            "w-full rounded-lg border px-3 py-2 text-slate-900 bg-slate-50",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            isPassword ? "pr-10" : "",
            error ? "border-red-300" : "border-slate-300",
            className ?? "",
          ].join(" ")}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
