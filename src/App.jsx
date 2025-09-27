import React, { useEffect, useState } from "react";
import CatalogViewer from "./components/CatalogViewer";
import { fetchCatalog } from "./api/fetchCatalog";

function App() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      const data = await fetchCatalog();
      setCatalog(data);
      setLoading(false);
    }
    loadCatalog();
  }, []);

  if (loading) {
    return <div>Cargando catálogo...</div>;
  }

  if (catalog.length === 0) {
    return <div>No hay marcas disponibles</div>;
  }

  return <CatalogViewer catalog={catalog} />;
}

export default App;
