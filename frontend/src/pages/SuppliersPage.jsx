import React, { useEffect, useState } from "react";
import api from "../api";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

const emptyForm = { name: "", email: "", phone: "" };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  async function load() {
    const res = await api.get("/suppliers/");
    setSuppliers(res.data);
  }

  useEffect(() => { load(); }, []);

  async function createSupplier(e) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Le nom est requis.");
      return;
    }

    try {
      await api.post("/suppliers/", form);
      setForm(emptyForm);
      await load();
    } catch {
      setError("Impossible de créer.");
    }
  }

  async function deleteSupplier(id) {
    if (!window.confirm("Supprimer ce fournisseur ?")) return;

    try {
      await api.delete(`/suppliers/${id}/`);
      await load();
    } catch {
      setError("Suppression impossible.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fournisseurs"
        subtitle="Gestion des fournisseurs"
      />

      {error && <div className="bg-red-100 p-3 text-red-600">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[420px,1fr]">

        <Card title="Nouveau fournisseur">
          <form onSubmit={createSupplier} className="space-y-3">

            <input
              required
              placeholder="Nom"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />

            <input
              placeholder="Téléphone"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Ajouter
            </button>

          </form>
        </Card>

        <Card title="Liste">
          {suppliers.map((s) => (
            <div key={s.id} className="flex justify-between p-3 bg-slate-50 rounded mb-2">
              <div>
                <p>{s.name}</p>
                <p className="text-sm text-slate-500">
                  {s.email || "-"} / {s.phone || "-"}
                </p>
              </div>

              <button
                onClick={() => deleteSupplier(s.id)}
                className="text-red-600"
              >
                Supprimer
              </button>
            </div>
          ))}

          {suppliers.length === 0 && <p>Aucun fournisseur</p>}
        </Card>

      </div>
    </div>
  );
}