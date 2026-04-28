import React, { useEffect, useState } from "react";
import api from "../api";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/dashboard/summary/")
      .then((res) => setSummary(res.data))
      .catch(() => {
        console.error("Erreur lors du chargement du dashboard");
      });
  }, []);

  if (!summary) {
    return <div className="p-6 text-slate-500">Chargement du dashboard...</div>;
  }

  const cards = [
    { label: "Produits", value: summary.total_products },
    { label: "Stock bas", value: summary.low_stock_products },
    { label: "Catégories", value: summary.total_categories },
    { label: "Fournisseurs", value: summary.total_suppliers },
    { label: "Valeur totale", value: `${summary.total_stock_value} €` },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Vue globale du système de stock"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.label}>
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {card.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Stock Overview (NEW) */}
      <Card title="État du stock">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="py-3">Produit</th>
                <th className="py-3">Quantité</th>
                <th className="py-3">Stock minimum</th>
                <th className="py-3">Statut</th>
              </tr>
            </thead>

            <tbody>
              {summary.products?.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-500">
                    Aucun produit.
                  </td>
                </tr>
              )}

              {summary.products?.map((p) => (
                <tr key={p.id} className="border-b last:border-b-0">

                  <td className="py-3 font-medium text-slate-900">
                    {p.name}
                  </td>

                  <td className="py-3">
                    {p.quantity}
                  </td>

                  <td className="py-3">
                    {p.minimum_stock}
                  </td>

                  <td className="py-3">
                    <span
                      className={
                        p.is_low_stock
                          ? "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600"
                          : "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600"
                      }
                    >
                      {p.is_low_stock ? "Stock bas" : "Normal"}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Movements */}
      <Card title="Mouvements récents">
        <div className="space-y-3">
          {summary.recent_movements.length === 0 && (
            <p className="text-slate-500">Aucun mouvement.</p>
          )}

          {summary.recent_movements.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {m.product_name}
                </p>
                <p className="text-sm text-slate-500">
                  {m.reason}
                </p>
              </div>

              <div
                className={
                  m.movement_type === "IN"
                    ? "font-semibold text-emerald-600"
                    : "font-semibold text-red-500"
                }
              >
                {m.movement_type === "IN" ? "+" : "-"} {m.quantity}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}