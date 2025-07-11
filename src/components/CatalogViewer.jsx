import React, { useState } from 'react';
import { catalog } from '../data/catalog';
import { fundaDesigns } from '../data/designs';

const CatalogViewer = () => {
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [selectedModelo, setSelectedModelo] = useState(null);

  if (!selectedMarca) {
    // Paso 1: Elegir marca
    return (
      <div>
        <h1>Elige una marca de móvil</h1>
        {catalog.map((marcaObj) => (
          <button
            key={marcaObj.marca}
            onClick={() => setSelectedMarca(marcaObj)}
            style={{ display: 'block', margin: '10px 0' }}
          >
            {marcaObj.marca}
          </button>
        ))}
      </div>
    );
  }

  if (!selectedModelo) {
    // Paso 2: Elegir modelo
    return (
      <div>
        <button onClick={() => setSelectedMarca(null)}>← Volver</button>
        <h2>Modelos de {selectedMarca.marca}</h2>
        {selectedMarca.modelos.map((modelo) => (
          <button
            key={modelo.nombre}
            onClick={() => setSelectedModelo(modelo)}
            style={{ display: 'block', margin: '10px 0' }}
          >
            {modelo.nombre}
          </button>
        ))}
      </div>
    );
  }

  // Paso 3: Mostrar fundas y diseños
  return (
    <div>
      <button onClick={() => setSelectedModelo(null)}>← Volver a modelos</button>
      <h2>Fundas para {selectedModelo.nombre}</h2>
      {selectedModelo.fundas.map((tipo) => (
        <div key={tipo} style={{ marginTop: '20px' }}>
          <h3>{tipo}</h3>
          <ul>
            {fundaDesigns[tipo]?.map((diseño, index) => (
              <li key={index}>{diseño}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CatalogViewer;
