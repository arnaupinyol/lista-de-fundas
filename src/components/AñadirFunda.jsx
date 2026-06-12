import React, { useState } from "react";
import { addFunda } from "../lib/catalogService";
import "./CatalogViewer.css";

export const AñadirFunda = ({ marca, onClose, onFundaAñadida }) => {
  const [tipo, setTipo] = useState("");
  const [variacionesTexto, setVariacionesTexto] = useState("");

  const guardarFunda = async () => {
    if (!tipo.trim()) {
      alert("Debes escribir un tipo de funda");
      return;
    }

    const variaciones = variacionesTexto
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const { data, error } = await addFunda(marca.id, tipo.trim(), variaciones);
    if (error) {
      console.error("Error añadiendo funda:", error);
      alert("Error al añadir funda");
      return;
    }

    onFundaAñadida(data[0]);
    onClose();
  };

  const coloresPrevios = variacionesTexto
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <span className="eyebrow">{marca.nombre}</span>
            <h3>Añadir funda</h3>
          </div>
          <button onClick={onClose} className="drawer-close" title="Cerrar">
            ×
          </button>
        </div>

        <label className="form-field">
          <span>Tipo de funda</span>
          <input
            type="text"
            placeholder="Ej. Silicona"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Colores</span>
          <textarea
            placeholder="Ej. #ff0000, #00ff00, #0000ff"
            value={variacionesTexto}
            onChange={(e) => setVariacionesTexto(e.target.value)}
          />
        </label>

        {coloresPrevios.length > 0 && (
          <div className="color-preview-row">
            {coloresPrevios.map((color) => (
              <span
                key={color}
                title={color}
                style={{ backgroundColor: color.startsWith("#") ? color : "#ccc" }}
              />
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={guardarFunda} className="btn btn-primary">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
