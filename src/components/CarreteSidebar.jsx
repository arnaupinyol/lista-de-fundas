// src/components/CarreteSidebar.jsx
import React from "react";
import "./CarreteSidebar.css";

export const CarreteSidebar = ({ items, onEliminarFunda }) => {
  const agrupado = items.reduce((acc, item) => {
    const clave = `${item.modelo}-${item.tipo}-${item.estilo || "sin-estilo"}`;
    if (!acc[clave]) {
      acc[clave] = { ...item };
    } else {
      acc[clave].cantidad += item.cantidad;
    }
    return acc;
  }, {});

  const fundasAgrupadas = Object.values(agrupado);

  // 🔹 Helper per mostrar el cercle del color
  const renderColor = (estilo) => {
    if (!estilo) return null;

    const colorValido =
      estilo.startsWith("#") ||
      [
        "black",
        "white",
        "red",
        "blue",
        "green",
        "pink",
        "purple",
        "gold",
        "silver",
        "gray",
        "transparent",
      ].includes(estilo.toLowerCase());

    if (!colorValido) return null;

    return (
      <span
        className="color-preview"
        style={{
          backgroundColor: estilo,
          border: "1px solid #000",
        }}
        title={estilo}
      ></span>
    );
  };

  return (
    <div className="carrete-sidebar">
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
    </div>
  );
};
