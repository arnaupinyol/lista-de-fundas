// src/components/AñadirFunda.jsx
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
      console.error("❌ Error añadiendo funda:", error);
      alert("Error al añadir funda");
      return;
    }

    onFundaAñadida(data[0]);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ background: "white", padding: 20, borderRadius: 8, width: 400 }}>
        <h3>Añadir funda a {marca.nombre}</h3>
        <input
          type="text"
          placeholder="Tipo de funda (ej: Silicona)"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />
        <textarea
          placeholder="Variaciones separadas por coma (ej: Rojo, Azul, Negro)"
          value={variacionesTexto}
          onChange={(e) => setVariacionesTexto(e.target.value)}
          style={{ width: "100%", padding: "8px", minHeight: "80px" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
          <button onClick={onClose} className="boton-marca">Cancelar</button>
          <button onClick={guardarFunda} className="boton-marca">Guardar</button>
        </div>
      </div>
    </div>
  );
};
