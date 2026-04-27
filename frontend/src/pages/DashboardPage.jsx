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
    <div>
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

      {/* Recent Movements */}
      <div className="mt-8">
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
    </div>
  );
}