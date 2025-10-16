// src/components/CatalogViewer.jsx
import React, { useState } from "react";
import { MarcaSelector } from "./MarcaSelector";
import { ModeloSelector } from "./ModeloSelector";
import { FundaViewer } from "./FundaViewer";
import "./CatalogViewer.css";

export const CatalogViewer = ({ marcas, onAgregarAlCarrito }) => {
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [selectedModelo, setSelectedModelo] = useState(null);

  const handleVolverAModelos = () => {
    setSelectedModelo(null);
  };

  const handleVolverAMarcas = () => {
    setSelectedMarca(null);
    setSelectedModelo(null);
  };

  if (!selectedMarca) {
    return (
      <MarcaSelector
        marcas={marcas}
        onSelectMarca={setSelectedMarca}
      />
    );
  }

  if (!selectedModelo) {
    return (
      <ModeloSelector
        marca={selectedMarca}
        onSelectModelo={setSelectedModelo}
        onVolver={handleVolverAMarcas}
      />
    );
  }

  return (
    <div className="catalogo-container">
      <FundaViewer
        marca={selectedMarca}
        modelo={selectedModelo}
        onVolver={handleVolverAModelos}
        onGuardarFunda={onAgregarAlCarrito}
      />
    </div>
  );
};

export default CatalogViewer;
