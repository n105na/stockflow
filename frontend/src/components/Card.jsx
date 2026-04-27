import React from "react";

export default function Card({ title, children, action, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-xl font-semibold text-slate-900">
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}