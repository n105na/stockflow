import React, { useEffect, useState } from "react";
import api from "../api";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const res = await api.get("/categories/");
    setCategories(res.data);
  }

  useEffect(() => { load(); }, []);

  async function createCategory(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Le nom est requis.");
      return;
    }

    try {
      await api.post("/categories/", { name });
      setName("");
      await load();
    } catch {
      setError("Impossible de créer la catégorie.");
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm("Supprimer cette catégorie ?")) return;

    try {
      await api.delete(`/categories/${id}/`);
      await load();
    } catch {
      setError("Suppression impossible (catégorie utilisée).");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catégories"
        subtitle="Créer et gérer les catégories"
      />

      {error && (
        <div className="bg-red-100 p-3 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[380px,1fr]">

        <Card title="Nouvelle catégorie">
          <form onSubmit={createCategory} className="space-y-4">
            <input
              required
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Ajouter
            </button>
          </form>
        </Card>

        <Card title="Liste des catégories">
          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c.id} className="flex justify-between bg-slate-50 p-3 rounded">
                <span>{c.name}</span>
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="text-red-600"
                >
                  Supprimer
                </button>
              </div>
            ))}

            {categories.length === 0 && (
              <p className="text-slate-500">Aucune catégorie</p>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}