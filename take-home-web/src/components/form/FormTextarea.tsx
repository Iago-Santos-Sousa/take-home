import React from "react";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function FormTextarea({
  label,
  error,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <textarea
        {...props}
        className={[
          "w-full rounded-lg border px-3 py-2 text-slate-900 bg-slate-50 resize-none",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          error ? "border-red-300" : "border-slate-300",
          className ?? "",
        ].join(" ")}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
