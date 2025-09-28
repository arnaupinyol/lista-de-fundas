// src/components/AñadirModelo.jsx
import React, { useEffect, useState } from "react";
import { getFundasPorMarca, addModelo } from "../lib/catalogService";
import "./CatalogViewer.css";

export const AñadirModelo = ({ marca, onClose, onModeloAñadido }) => {
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [fundasMarca, setFundasMarca] = useState([]);
  const [fundasSeleccionadas, setFundasSeleccionadas] = useState([]);

  // cargar fundas de la marca
  useEffect(() => {
    (async () => {
      const { data, error } = await getFundasPorMarca(marca.id);
      if (error) {
        console.error("❌ Error cargando fundas de marca:", error);
        setFundasMarca([]);
      } else {
        setFundasMarca(data || []);
      }
    })();
  }, [marca]);

  const toggleFunda = (tipo) => {
    setFundasSeleccionadas((prev) =>
      prev.includes(tipo) ? prev.filter((f) => f !== tipo) : [...prev, tipo]
    );
  };

  const guardarModelo = async () => {
    if (!nuevoNombre.trim()) {
      alert("Por favor escribe un nombre para el modelo");
      return;
    }

    const { data, error } = await addModelo(
      nuevoNombre.trim(),
      marca.id,
      fundasSeleccionadas
    );
    if (error) {
      console.error("❌ Error al añadir modelo:", error);
      alert("Error al añadir modelo");
      return;
    }

    // Notificamos al padre para actualizar la lista
    onModeloAñadido(data[0]);
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
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 8,
          width: 400,
        }}
      >
        <h3>Añadir modelo a {marca.nombre}</h3>
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nombre del modelo"
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />

        <p>Selecciona fundas disponibles:</p>
        <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 12 }}>
          {fundasMarca.map((f) => (
            <label key={f.id} style={{ display: "block", marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={fundasSeleccionadas.includes(f.tipo_funda)}
                onChange={() => toggleFunda(f.tipo_funda)}
              />{" "}
              {f.tipo_funda}
            </label>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button onClick={onClose} className="boton-marca">
            Cancelar
          </button>
          <button onClick={guardarModelo} className="boton-marca">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
