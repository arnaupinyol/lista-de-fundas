// src/components/ModeloSelector.jsx
import React, { useEffect, useState } from "react";
import { getModelosPorMarca } from "../lib/catalogService";
import "./CatalogViewer.css";

export const ModeloSelector = ({ marca, onSelectModelo, onVolver }) => {
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await getModelosPorMarca(marca.id);
      if (error) {
        console.error("Error cargando modelos:", error);
        setModelos([]);
      } else {
        setModelos(data || []);
      }
      setLoading(false);
    })();
  }, [marca]);

  return (
    <div>
      <button
        onClick={onVolver}
        className="boton-marca"
        style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: "8px" }}
      >
        <span style={{ fontSize: "1.5em" }}>←</span>
        <img src="/favicon.png" alt="Inicio" style={{ height: 40, objectFit: "contain" }} />
      </button>

      <h2 className="titulo-marca">Modelos de {marca.marca}</h2>

      {loading && <div>Cargando modelos…</div>}
      {!loading && modelos.map((modelo) => (
        <button key={modelo.id} onClick={() => onSelectModelo(modelo)} className="boton-modelo">
          {modelo.nombre}
        </button>
      ))}
      {!loading && !modelos.length && <div>No hay modelos para esta marca.</div>}
    </div>
  );
};
