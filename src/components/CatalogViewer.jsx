// src/components/CatalogViewer.jsx
import React, { useState } from "react";
import { MarcaSelector } from "./MarcaSelector";
import { ModeloSelector } from "./ModeloSelector";
import { FundaViewer } from "./FundaViewer";
import { CarreteSidebar } from "./CarreteSidebar";
import "./CatalogViewer.css";

const CatalogViewer = ({ catalog }) => {
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [selectedModelo, setSelectedModelo] = useState(null);
  const [carrete, setCarrete] = useState([]); // ← Aquí guardaremos las fundas

  const agregarAlCarrete = (item) => {
    setCarrete((prev) => [...prev, item]);
  };

  const eliminarDelCarrete = (itemAEliminar) => {
    setCarrete((prev) =>
      prev.filter(
        (item) =>
          !(
            item.modelo === itemAEliminar.modelo &&
            item.tipo === itemAEliminar.tipo &&
            (item.estilo || "sin-estilo") ===
              (itemAEliminar.estilo || "sin-estilo")
          )
      )
    );
  };

  // Paso 1: elegir marca
  if (!selectedMarca) {
    return (
      <MarcaSelector
        marcas={catalog} // ✅ Ahora viene como prop desde App.jsx
        onSelectMarca={setSelectedMarca}
        carrete={carrete}
      />
    );
  }

  // Paso 2: elegir modelo
  if (!selectedModelo) {
    return (
      <ModeloSelector
        marca={selectedMarca}
        onSelectModelo={setSelectedModelo}
        onVolver={() => setSelectedMarca(null)}
      />
    );
  }

  // Paso 3: ver fundas y el sidebar
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <FundaViewer
          marca={selectedMarca}
          modelo={selectedModelo}
          onVolver={() => setSelectedModelo(null)}
          onGuardarFunda={agregarAlCarrete}
        />
      </div>
      <CarreteSidebar items={carrete} onEliminarFunda={eliminarDelCarrete} />
    </div>
  );
};

export default CatalogViewer;
