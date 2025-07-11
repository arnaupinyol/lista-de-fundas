// src/components/ModeloSelector.jsx
import React from 'react';
import './CatalogViewer.css';

export const ModeloSelector = ({ marca, onSelectModelo, onVolver }) => (
  <div>
    <button onClick={onVolver} className="boton-marca">← Volver</button>
    <h2 className="titulo-marca">Modelos de {marca.marca}</h2>
    {marca.modelos.map((modelo) => (
      <button
        key={modelo.nombre}
        onClick={() => onSelectModelo(modelo)}
        className="boton-modelo"
      >
        {modelo.nombre}
      </button>
    ))}
  </div>
);
