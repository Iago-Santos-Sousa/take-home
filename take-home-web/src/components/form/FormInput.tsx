import React from "react";

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
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
        {requiredMark && <span className="text-red-500"> *</span>}
      </label>
      <input
        {...props}
        className={[
          "w-full rounded-lg border px-3 py-2 text-slate-900 bg-slate-50",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          error ? "border-red-300" : "border-slate-300",
          className ?? "",
        ].join(" ")}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
