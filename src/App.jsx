// src/App.jsx

import React, { useEffect, useState } from "react";
import CatalogViewer from "./components/CatalogViewer";

function App() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar catálogo desde el backend
  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        setCatalog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando catálogo:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <img
          src="/loading.gif"
          alt="Cargando..."
          className="w-24 h-24 object-contain"
        />
      </div>
    );
  }

  return (
    <div>
      <CatalogViewer catalog={catalog} />
    </div>
  );
}

export default App;
