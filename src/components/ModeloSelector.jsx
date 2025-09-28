// src/components/ModeloSelector.jsx
import React from 'react';
import './CatalogViewer.css';

export const ModeloSelector = ({ marca, onSelectModelo, onVolver }) => (
  <div>
    <button
      onClick={onVolver}
      className="boton-marca"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      <span style={{ fontSize: "1.5em" }}>←</span>
      <img
        src="/favicon.png"
        alt="Inicio"
        style={{ height: 40, objectFit: "contain" }}
      />
    </button>
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
