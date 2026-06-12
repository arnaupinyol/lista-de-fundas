import React, { useMemo, useState } from "react";
import "./CarreteSidebar.css";
import jsPDF from "jspdf";

export const CarreteSidebar = ({ items, onEliminarFunda }) => {
  const [minimitzat, setMinimitzat] = useState(true);

  const itemsAgrupados = useMemo(() => {
    const map = items.reduce((acc, item) => {
      const clave = `${item.modelo}-${item.tipo}-${item.estilo || "sin-estilo"}`;
      if (!acc[clave]) {
        acc[clave] = { ...item };
      } else {
        acc[clave].cantidad += item.cantidad;
      }
      return acc;
    }, {});

    return Object.values(map).reverse();
  }, [items]);

  const totalFundas = useMemo(
    () => items.reduce((total, item) => total + item.cantidad, 0),
    [items]
  );

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
    <>
      <button
        className={`toggle-carrete ${minimitzat ? "plegat" : ""}`}
        onClick={() => setMinimitzat(!minimitzat)}
        title={minimitzat ? "Mostrar carrito" : "Ocultar carrito"}
      >
        <img src="/carrito.png" alt="carrito" className="icono-carrito" />
        {totalFundas > 0 && <span className="cart-badge">{totalFundas}</span>}
      </button>

      <aside
        className={`carrete-sidebar ${minimitzat ? "minimitzat" : ""}`}
        aria-hidden={minimitzat}
      >
        <div className="carrete-header">
          <div>
            <span className="eyebrow">Pedido</span>
            <h3>Carrito</h3>
          </div>
          <button
            onClick={() => setMinimitzat(true)}
            className="drawer-close"
            title="Ocultar carrito"
          >
            ×
          </button>
        </div>

        <div className="carrete-summary">
          <span>Total</span>
          <strong>{totalFundas}</strong>
        </div>

        {itemsAgrupados.length === 0 ? (
          <div className="cart-empty">Vacío</div>
        ) : (
          <ul className="carrete-list">
            {itemsAgrupados.map((item, index) => (
              <li key={`${item.modelo}-${item.tipo}-${item.estilo || index}`}>
                <div className="funda-info">
                  <span
                    className="color-preview"
                    style={{
                      backgroundColor: item.estilo || "#ffffff",
                      borderColor: item.estilo ? "rgba(30, 34, 36, 0.35)" : "#d8d1c5",
                    }}
                  />
                  <span className="cart-item-text">
                    <span className="cart-item-model">{item.modelo}</span>
                    <span className="cart-item-type">{item.tipo}</span>
                  </span>
                </div>

                <div className="cart-item-actions">
                  <strong>×{item.cantidad}</strong>
                  <button
                    onClick={() => onEliminarFunda(item)}
                    className="eliminar-btn"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="carrete-footer">
          <button
            onClick={exportarPDF}
            className="exportar-btn"
            disabled={itemsAgrupados.length === 0}
          >
            Exportar PDF
          </button>
        </div>
      </aside>
    </>
  );
};
