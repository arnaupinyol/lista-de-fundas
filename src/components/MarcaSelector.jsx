// src/components/MarcaSelector.jsx
import React from 'react';
import './CatalogViewer.css';

export const MarcaSelector = ({ marcas, onSelectMarca }) => (
  <div>
    <h1 className="titulo-marca">Elige una marca de móvil</h1>
    {marcas.map((marcaObj) => (
      <button
        key={marcaObj.marca}
        onClick={() => onSelectMarca(marcaObj)}
        className="boton-marca"
      >
        {marcaObj.marca}
      </button>
    ))}
  </div>
);
