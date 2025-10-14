// src/components/FundasManager.jsx
import React, { useEffect, useState } from "react";
import { getFundasPorMarca, addFunda, deleteFunda } from "../lib/catalogService";
import "./CatalogViewer.css";

export const FundasManager = ({ marca, onVolver }) => {
  const [fundas, setFundas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAñadir, setShowAñadir] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [variacionesTexto, setVariacionesTexto] = useState("");
  const [fundaAEliminar, setFundaAEliminar] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await getFundasPorMarca(marca.id);
      if (error) {
        console.error("Error cargando fundas:", error);
        setFundas([]);
      } else {
        setFundas(data || []);
      }
      setLoading(false);
    })();
  }, [marca]);

  const guardarFunda = async () => {
    if (!nuevoTipo.trim()) return;
    const variaciones = variacionesTexto.split(",").map(v => v.trim()).filter(Boolean);
    const { data, error } = await addFunda(marca.id, nuevoTipo.trim(), variaciones);
    if (error) {
      alert("Error al añadir funda");
      return;
    }
    setFundas(prev => [...prev, ...data]);
    setShowAñadir(false);
    setNuevoTipo("");
    setVariacionesTexto("");
  };

  const confirmarEliminar = async () => {
    if (!fundaAEliminar) return;
    const { error } = await deleteFunda(fundaAEliminar.id);
    if (error) {
      alert("Error al eliminar funda");
      return;
    }
    setFundas(prev => prev.filter(f => f.id !== fundaAEliminar.id));
    setFundaAEliminar(null);
  };

  const renderColorCircle = (color) => (
    <span
      key={color}
      title={color}
      style={{
        display: "inline-block",
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: color.startsWith("#") ? color : "#ccc",
        border: "1px solid #555",
        marginRight: 6,
      }}
    ></span>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onVolver}
          className="boton-marca"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "1.5em" }}>←</span>
          <img
            src={`/${marca.nombre.toLowerCase()}.png`}
            alt={marca.nombre}
            style={{ height: 40, objectFit: "contain" }}
          />
        </button>
        <button onClick={() => setShowAñadir(true)} className="boton-marca">
          ➕ Añadir funda
        </button>
      </div>

      <h2 className="titulo-marca">Fundas de {marca.nombre}</h2>
      {loading && <div>Cargando fundas...</div>}

      {!loading &&
        fundas.map((f) => (
          <div
            key={f.id}
            style={{
              position: "relative",
              marginBottom: 8,
              padding: "6px 10px",
              background: "#eee",
              borderRadius: 6,
            }}
          >
            {f.tipo_funda}{" "}
            {f.variaciones?.length
              ? f.variaciones.map((color) => renderColorCircle(color))
              : ""}
            <button
              onClick={() => setFundaAEliminar(f)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ))}
      {!loading && !fundas.length && <div>No hay fundas.</div>}

      {showAñadir && (
        <div
          style={{
            position: "fixed",
            inset: 0,
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
            <h3>Añadir funda</h3>
            <input
              type="text"
              value={nuevoTipo}
              onChange={(e) => setNuevoTipo(e.target.value)}
              placeholder="Tipo de funda"
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
            <textarea
              value={variacionesTexto}
              onChange={(e) => setVariacionesTexto(e.target.value)}
              placeholder="Códigos de color separados por coma (ej: #ff0000, #00ff00)"
              style={{
                width: "100%",
                marginBottom: 12,
                padding: 8,
                minHeight: 80,
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => setShowAñadir(false)} className="boton-marca">
                Cancelar
              </button>
              <button onClick={guardarFunda} className="boton-marca">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {fundaAEliminar && (
        <div
          style={{
            position: "fixed",
            inset: 0,
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
              width: 300,
            }}
          >
            <h3>¿Eliminar funda?</h3>
            <p>{fundaAEliminar.tipo_funda}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => setFundaAEliminar(null)} className="boton-marca">
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="boton-marca"
                style={{ background: "red", color: "white" }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
