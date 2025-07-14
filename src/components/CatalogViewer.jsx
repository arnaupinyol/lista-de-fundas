// src/components/CatalogViewer.jsx
import React, { useState } from 'react';
import { catalog } from '../data/catalog';
import { MarcaSelector } from './MarcaSelector';
import { ModeloSelector } from './ModeloSelector';
import { FundaViewer } from './FundaViewer';
import { CarreteSidebar } from './CarreteSidebar';
import './CatalogViewer.css';

const CatalogViewer = () => {
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [selectedModelo, setSelectedModelo] = useState(null);
  const [carrete, setCarrete] = useState([]); // ← Aquí guardaremos las fundas

  const agregarAlCarrete = (item) => {
    setCarrete((prev) => [...prev, item]);
  };

  if (!selectedMarca) {
    return (
      <MarcaSelector
        marcas={catalog}
        onSelectMarca={setSelectedMarca}
        carrete={carrete} // ✅ Esto es lo nuevo
      />
    );
  }


  if (!selectedModelo) {
    return (
      <ModeloSelector
        marca={selectedMarca}
        onSelectModelo={setSelectedModelo}
        onVolver={() => setSelectedMarca(null)}
      />
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <FundaViewer
          marca={selectedMarca}
          modelo={selectedModelo}
          onVolver={() => setSelectedModelo(null)}
          onGuardarFunda={agregarAlCarrete}
        />
      </div>
      <CarreteSidebar items={carrete} />
    </div>
  );
};

export default CatalogViewer;
