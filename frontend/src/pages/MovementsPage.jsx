import React, { useEffect, useState } from "react";
import api from "../api";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

export default function MovementsPage() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState("");

  async function load() {
    const [m, p] = await Promise.all([
      api.get("/stock-movements/"),
      api.get("/products/")
    ]);

    setMovements(m.data);
    setProducts(p.data);
  }

  useEffect(() => { load(); }, []);

  const filtered = filterProduct
    ? movements.filter((m) => String(m.product) === filterProduct)
    : movements;

  return (
    <div className="space-y-6">

      <PageHeader
        title="Mouvements"
        subtitle="Historique du stock"
      />

      <Card title="Filtrer">
        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
        >
          <option value="">Tous</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </Card>

      <Card title="Historique">

        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Raison</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>{m.product_name}</td>
                <td>{m.movement_type}</td>
                <td>{m.quantity}</td>
                <td>{m.reason}</td>
                <td>{new Date(m.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>

        </table>

        {filtered.length === 0 && <p>Aucun mouvement</p>}

      </Card>

    </div>
  );
}