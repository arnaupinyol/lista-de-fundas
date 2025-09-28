import React, { useEffect, useState } from "react";
import CatalogViewer from "./components/CatalogViewer";
import { getMarcas } from "./lib/catalogService";

function App() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await getMarcas();
      if (error) {
        console.error("❌ Error cargando marcas:", error);
        setMarcas([]);
      } else {
        // Normalizamos con la misma clave que tu tabla: nombre
        setMarcas((data || []).map((m) => ({
          id: m.id,
          nombre: m.nombre,
          logo: m.logo,
        })));
      }
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src="/loading.gif" alt="Cargando..." style={{ width: 96, height: 96, objectFit: "contain" }} />
      </div>
    );
  if (!marcas.length) return <div>No hay marcas disponibles</div>;

  return <CatalogViewer marcas={marcas} />;
}

export default App;
