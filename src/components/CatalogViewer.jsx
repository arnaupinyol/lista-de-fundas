import React, { useState } from 'react';
import { catalog } from '../data/catalog';
import { fundaDesigns } from '../data/designs';
import './CatalogViewer.css';

const CatalogViewer = () => {
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [selectedModelo, setSelectedModelo] = useState(null);

  if (!selectedMarca) {
    return (
      <div>
        <h1 className="titulo-marca">Elige una marca de móvil</h1>
        {catalog.map((marcaObj) => (
          <button
            key={marcaObj.marca}
            onClick={() => setSelectedMarca(marcaObj)}
            className="boton-marca"
          >
            {marcaObj.marca}
          </button>
        ))}
      </div>
    );
  }

  if (!selectedModelo) {
    return (
      <div>
        <button onClick={() => setSelectedMarca(null)} className="boton-marca">
          ← Volver
        </button>
        <h2 className="titulo-marca">Modelos de {selectedMarca.marca}</h2>
        {selectedMarca.modelos.map((modelo) => (
          <button
            key={modelo.nombre}
            onClick={() => setSelectedModelo(modelo)}
            className="boton-modelo"
          >
            {modelo.nombre}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setSelectedModelo(null)} className="boton-marca">
        ← Volver a modelos
      </button>
      <h2 className="titulo-marca">Fundas para {selectedModelo.nombre}</h2>
      {selectedModelo.fundas.map((tipo) => (
        <div key={tipo} style={{ marginTop: '20px' }}>
          <h3 className="titulo-funda">{tipo}</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {fundaDesigns[tipo]?.map((diseño, index) => (
              <span
                key={index}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#2d3748',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {diseño}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CatalogViewer;
