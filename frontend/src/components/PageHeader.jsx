import React from "react";

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-slate-600">{subtitle}</p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}