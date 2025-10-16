// src/components/CarreteSidebar.jsx
import React, { useState } from "react";
import "./CarreteSidebar.css";
import jsPDF from "jspdf";

export const CarreteSidebar = ({ items, onEliminarFunda }) => {
  const [minimitzat, setMinimitzat] = useState(true); // Changed to true

  const exportarPDF = () => {
    const agrupadoPorModelo = items.reduce((acc, item) => {
      if (!acc[item.modelo]) acc[item.modelo] = {};
      const clave = `${item.tipo}-${item.estilo || "sin-estilo"}`;
      if (!acc[item.modelo][clave]) {
        acc[item.modelo][clave] = { ...item };
      } else {
        acc[item.modelo][clave].cantidad += item.cantidad;
      }
      return acc;
    }, {});

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Carrito de fundas", 20, 20);

    let y = 30;
    if (Object.keys(agrupadoPorModelo).length === 0) {
      doc.setFontSize(12);
      doc.text("El carrito está vacío.", 20, y);
    } else {
      Object.entries(agrupadoPorModelo).forEach(([modelo, fundas]) => {
        doc.setFontSize(14);
        doc.text(`Modelo: ${modelo}`, 20, y);
        y += 10;

        Object.values(fundas).forEach((item) => {
          const estilo = item.estilo || null;

          if (estilo && /^#([0-9A-F]{3}){1,2}([0-9A-F]{2})?$/i.test(estilo)) {
            const hex = estilo.replace("#", "");
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.2);
            doc.setFillColor(r, g, b);
            doc.rect(30, y - 4, 6, 6, "FD");

            doc.setTextColor(0, 0, 0);
            doc.text(`${item.tipo} × ${item.cantidad}`, 40, y);
          } else {
            doc.setTextColor(0, 0, 0);
            doc.text(`• ${item.tipo} × ${item.cantidad}`, 30, y);
          }

          y += 10;
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
        });

        y += 5;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
    }

    const fecha = new Date().toISOString().slice(0, 10);
    doc.save(`carrito-${fecha}.pdf`);
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
        />
      </button>

      {/* Contingut del carrete */}
      {!minimitzat && (
        <>
          <h3>Carrito</h3>
          {!minimitzat && items.length > 0 && (
            <button
              onClick={exportarPDF}
              className="exportar-btn"
              style={{
                background: "var(--color-funda)",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "12px",
                width: "100%",
              }}
            >
              📄 Exportar a PDF
            </button>
          )}
          {items.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#555" }}>Vacío</p>
          ) : (
            <ul>
              {items
                .slice()
                .reverse()
                .map((item, index) => (
                  <li key={index}>
                    <div className="funda-info">
                      {item.estilo && (
                        <span
                          className="color-preview"
                          style={{ backgroundColor: item.estilo, border: "1px solid #000" }}
                        ></span>
                      )}
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
