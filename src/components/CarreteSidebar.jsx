// src/components/CarreteSidebar.jsx
import React, { useState } from "react";
import "./CarreteSidebar.css";

export const CarreteSidebar = ({ items, onEliminarFunda }) => {
  const [minimitzat, setMinimitzat] = useState(false);

  const agrupado = items.reduce((acc, item) => {
    const clave = `${item.modelo}-${item.tipo}-${item.estilo || "sin-estilo"}`;
    if (!acc[clave]) acc[clave] = { ...item };
    else acc[clave].cantidad += item.cantidad;
    return acc;
  }, {});
  const fundasAgrupadas = Object.values(agrupado);

  const renderColor = (estilo) => {
    if (!estilo) return null;
    const colorValido =
      estilo.startsWith("#") ||
      [
        "black", "white", "red", "blue", "green",
        "pink", "purple", "gold", "silver",
        "gray", "transparent",
      ].includes(estilo.toLowerCase());
    if (!colorValido) return null;
    return (
      <span
        className="color-preview"
        style={{ backgroundColor: estilo, border: "1px solid #000" }}
      ></span>
    );
  };

  return (
    <div className={`carrete-sidebar ${minimitzat ? "minimitzat" : ""}`}>
      {/* 🔘 Botó sempre visible */}
      <button
        className={`toggle-carrete ${minimitzat ? "plegat" : ""}`}
        onClick={() => setMinimitzat(!minimitzat)}
        title={minimitzat ? "Mostrar carrito" : "Ocultar carrito"}
      >
        <img
          src="/carrito.png"
          alt="carrito"
          className="icono-carrito"
          style={{
            transform: minimitzat ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
      </button>

      {/* Contingut del carrete */}
      {!minimitzat && (
        <>
          <h3>Carrito</h3>
          {fundasAgrupadas.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#555" }}>Vacío</p>
          ) : (
            <ul>
              {fundasAgrupadas
                .slice()
                .reverse()
                .map((item, index) => (
                  <li key={index}>
                    <div className="funda-info">
                      {renderColor(item.estilo)}
                      <span>
                        {item.modelo} – {item.tipo}
                      </span>
                      <strong>{item.cantidad}</strong>
                    </div>
                    <button
                      onClick={() => onEliminarFunda(item)}
                      className="eliminar-btn"
                    >
                      ✕
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};
