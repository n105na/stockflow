import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { LayoutDashboard, Boxes, Layers3, Truck, ArrowLeftRight, LogOut } from "lucide-react";
import api, { setToken } from "./api";

import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import SuppliersPage from "./pages/SuppliersPage.jsx";
import MovementsPage from "./pages/MovementsPage.jsx";


function Shell({ children, onLogout }) {
  const items = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/products", icon: Boxes, label: "Produits" },
    { to: "/categories", icon: Layers3, label: "Catégories" },
    { to: "/suppliers", icon: Truck, label: "Fournisseurs" },
    { to: "/movements", icon: ArrowLeftRight, label: "Mouvements" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">StockFlow</h1>
        <p className="mb-6 text-sm text-slate-300">Gestion de stock — interface admin</p>

        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 transition"
                to={item.to}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={onLogout}
          className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-medium hover:bg-red-600"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}


export default function App() {
  const [token, setTokenState] = useState(localStorage.getItem("token"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!token) {
      setReady(true);
      return;
    }

    setToken(token);

    api.get("/auth/me/")
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setTokenState(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = (access) => {
    localStorage.setItem("token", access);
    setToken(access);
    setTokenState(access);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTokenState(null);
  };

  if (!ready) return <div className="p-10">Chargement...</div>;
  if (!token) return <LoginPage onLogin={login} />;

  return (
    <Shell onLogout={logout}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/movements" element={<MovementsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Shell>
  );
}