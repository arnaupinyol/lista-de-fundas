// src/App.jsx

import React, { useEffect, useState } from "react";
import CatalogViewer from "./components/CatalogViewer";

function App() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar catálogo desde el backend
  useEffect(() => {
    fetch("http://localhost:4000/api/catalog")
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
    return <p className="p-4">Cargando catálogo...</p>;
  }

  return (
    <div>
      <CatalogViewer catalog={catalog} />
    </div>
  );
}

export default App;
