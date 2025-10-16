import React, { useEffect, useState } from "react";
import { CatalogViewer } from "./components/CatalogViewer";
import { CarreteSidebar } from "./components/CarreteSidebar";
import { getMarcas } from "./lib/catalogService";

function App() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carritoItems, setCarritoItems] = useState([]);

  useEffect(() => {
    const cargarMarcas = async () => {
      setLoading(true);
      const { data, error } = await getMarcas();
      if (!error && data) {
        setMarcas(data);
      }
      setLoading(false);
    };
    cargarMarcas();
  }, []);

  const handleAgregarAlCarrito = (funda) => {
    setCarritoItems(prev => [...prev, funda]);
  };

  const handleEliminarDelCarrito = (item) => {
    setCarritoItems(prev => 
      prev.filter(i => 
        !(i.modelo === item.modelo && 
          i.tipo === item.tipo && 
          i.estilo === item.estilo)
      )
    );
  };

  return (
    <div>
      <CatalogViewer 
        marcas={marcas} 
        onAgregarAlCarrito={handleAgregarAlCarrito}
      />
      <CarreteSidebar 
        items={carritoItems}
        onEliminarFunda={handleEliminarDelCarrito}
      />
    </div>
  );
}

export default App;
