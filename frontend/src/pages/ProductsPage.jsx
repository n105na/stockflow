import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500";

const numberInputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none";

  const emptyProduct = {
    name: "",
    sku: "",
    description: "",
    quantity: 0,
    minimum_stock: 0,
    price: 0,
    category: "",
    supplier_ids: [],
    storage_location: "",
    barcode: "",
  };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [productForm, setProductForm] = useState(emptyProduct);
  const [movement, setMovement] = useState({
    product: "",
    movement_type: "IN",
    quantity: 1,
    reason: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadAll() {
    const [p, c, s] = await Promise.all([
      api.get("/products/"),
      api.get("/categories/"),
      api.get("/suppliers/"),
    ]);
    setProducts(p.data);
    setCategories(c.data);
    setSuppliers(s.data);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const displayedProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.category_name || "").toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleChange = (key, value) => {
    setProductForm((prev) => ({ ...prev, [key]: value }));
  };

  async function saveProduct(e) {
    e.preventDefault();
    setError("");
  
    try {
      const payload = {
        name: productForm.name,
        sku: productForm.sku,
        description: productForm.description,
        quantity: Number(productForm.quantity),
        minimum_stock: Number(productForm.minimum_stock),
        price: Number(productForm.price),
        category: Number(productForm.category),
        supplier_ids: productForm.supplier_ids,
      };
  
      let productId = editingId;
  
      if (editingId) {
        await api.patch(`/products/${editingId}/`, payload);
      } else {
        const res = await api.post("/products/", payload);
        productId = res.data.id;
      }
  
      // ✅ HANDLE ProductDetails (OneToOne)
      if (productForm.storage_location || productForm.barcode) {
        const existing = products.find((p) => p.id === productId)?.details;
  
        const detailsPayload = {
          product: productId,
          storage_location: productForm.storage_location,
          barcode: productForm.barcode,
        };
  
        if (existing?.id) {
          await api.patch(`/product-details/${existing.id}/`, detailsPayload);
        } else {
          await api.post("/product-details/", detailsPayload);
        }
      }
  
      setProductForm(emptyProduct);
      setEditingId(null);
      await loadAll();
  
    } catch {
      setError("Erreur lors de l'enregistrement.");
    }
  }

  function startEdit(p) {
  setEditingId(p.id);

  setProductForm({
    name: p.name,
    sku: p.sku,
    description: p.description,
    quantity: p.quantity,
    minimum_stock: p.minimum_stock,
    price: p.price,
    category: p.category,
    supplier_ids: p.suppliers.map((s) => s.id),
    storage_location: p.details?.storage_location || "",
    barcode: p.details?.barcode || "",
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}
  
  async function deleteProduct(id) {
    if (!window.confirm("Supprimer ce produit ?")) return;
    await api.delete(`/products/${id}/`);
    await loadAll();
  }

  async function createMovement(e) {
    e.preventDefault();

    try {
      await api.post("/stock-movements/", {
        product: Number(movement.product),
        movement_type: movement.movement_type,
        quantity: Number(movement.quantity),
        reason: movement.reason,
      });

      setMovement({
        product: "",
        movement_type: "IN",
        quantity: 1,
        reason: "",
      });

      await loadAll();
    } catch {
      setError("Erreur mouvement.");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Produits" subtitle="Gestion des produits et du stock" />

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">

        {/* PRODUCT FORM */}
        <Card title={editingId ? "Modifier produit" : "Créer produit"}>
          <form onSubmit={saveProduct} className="space-y-4">

            <input
              className={inputClass}
              placeholder="Nom"
              value={productForm.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <input
              className={inputClass}
              placeholder="SKU"
              value={productForm.sku}
              onChange={(e) => handleChange("sku", e.target.value)}
            />

            <input
              className={inputClass}
              placeholder="Description"
              value={productForm.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            {/* NUMBERS CLEAN */}
            <div className="grid grid-cols-3 gap-4">

              <div>
                <label className="text-sm text-slate-600">Quantité</label>
                <input
                  type="number"
                  className={numberInputClass}
                  value={productForm.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Stock minimum</label>
                <input
                  type="number"
                  className={numberInputClass}
                  value={productForm.minimum_stock}
                  onChange={(e) => handleChange("minimum_stock", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Prix (€)</label>
                <input
                  type="number"
                  className={numberInputClass}
                  value={productForm.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </div>

            </div>

            <select
              className={inputClass}
              value={productForm.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {/* MANY TO MANY - SUPPLIERS */}
<select
  multiple
  className={inputClass}
  value={productForm.supplier_ids}
  onChange={(e) =>
    handleChange(
      "supplier_ids",
      Array.from(e.target.selectedOptions).map((o) => Number(o.value))
    )
  }
>
  {suppliers.map((s) => (
    <option key={s.id} value={s.id}>{s.name}</option>
  ))}
</select>

{/* ONE TO ONE - PRODUCT DETAILS */}
<input
  className={inputClass}
  placeholder="Emplacement (ex: A1, B2...)"
  value={productForm.storage_location}
  onChange={(e) => handleChange("storage_location", e.target.value)}
/>

<input
  className={inputClass}
  placeholder="Code barre"
  value={productForm.barcode}
  onChange={(e) => handleChange("barcode", e.target.value)}
/>
            <button className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-blue-700">
              Enregistrer
            </button>
          </form>
        </Card>

        {/* MOVEMENT */}
        <Card title="Mouvement de stock">
          <form onSubmit={createMovement} className="space-y-4">

            <select
              className={inputClass}
              value={movement.product}
              onChange={(e) =>
                setMovement((p) => ({ ...p, product: e.target.value }))
              }
            >
              <option value="">Produit</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select
              className={inputClass}
              value={movement.movement_type}
              onChange={(e) =>
                setMovement((p) => ({ ...p, movement_type: e.target.value }))
              }
            >
              <option value="IN">Entrée</option>
              <option value="OUT">Sortie</option>
            </select>

            <input
              type="number"
              className={numberInputClass}
              value={movement.quantity}
              onChange={(e) =>
                setMovement((p) => ({ ...p, quantity: e.target.value }))
              }
            />

            <input
              className={inputClass}
              placeholder="Raison"
              value={movement.reason}
              onChange={(e) =>
                setMovement((p) => ({ ...p, reason: e.target.value }))
              }
            />

            <button className="w-full bg-slate-900 text-white py-2 rounded-lg">
              Ajouter mouvement
            </button>
          </form>
        </Card>

      </div>

      {/* LIST */}
      <Card title="Liste des produits">

        <input
          className={inputClass}
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-4 space-y-2">
          {displayedProducts.map((p) => (
            <div key={p.id} className="flex justify-between p-3 bg-slate-50 rounded">

              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-slate-500">
                  {p.quantity} en stock
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="text-blue-600"
                >
                  Modifier
                </button>

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-red-600"
                >
                  Supprimer
                </button>
              </div>

            </div>
          ))}

          {displayedProducts.length === 0 && (
            <p className="text-slate-500">Aucun produit</p>
          )}
        </div>

      </Card>

    </div>
  );
}