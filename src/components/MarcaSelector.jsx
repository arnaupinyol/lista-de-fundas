// src/components/MarcaSelector.jsx
import React from 'react';
import jsPDF from 'jspdf';
import './CatalogViewer.css';

export const MarcaSelector = ({ marcas, onSelectMarca, carrete }) => {
  const exportarPDF = () => {
    const agrupadoPorModelo = carrete.reduce((acc, item) => {
      if (!acc[item.modelo]) acc[item.modelo] = {};
      const clave = `${item.tipo}-${item.estilo || 'sin-estilo'}`;
      if (!acc[item.modelo][clave]) {
        acc[item.modelo][clave] = { ...item };
      } else {
        acc[item.modelo][clave].cantidad += item.cantidad;
      }
      return acc;
    }, {});

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Carrito de fundas', 20, 20);

    let y = 30;
    if (Object.keys(agrupadoPorModelo).length === 0) {
      doc.setFontSize(12);
      doc.text('El carrito está vacío.', 20, y);
    } else {
      Object.entries(agrupadoPorModelo).forEach(([modelo, fundas]) => {
        doc.setFontSize(14);
        doc.text(`Modelo: ${modelo}`, 20, y);
        y += 10;

        Object.values(fundas).forEach((item) => {
          const estilo = item.estilo || null;

          // Dibuja un cuadrado del color con borde negro
          if (estilo && /^#([0-9A-F]{3}){1,2}([0-9A-F]{2})?$/i.test(estilo)) {
            const hex = estilo.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            // Dibuja cuadrado con relleno y borde negro
            doc.setDrawColor(0, 0, 0); // marco negro
            doc.setLineWidth(0.2);
            doc.setFillColor(r, g, b);
            doc.rect(30, y - 4, 6, 6, 'FD'); // F=fill, D=draw (relleno y borde)

            doc.setTextColor(0, 0, 0);
            doc.text(`${item.tipo} × ${item.cantidad}`, 40, y);
          } else {
            // Si no hay color (sin estilo)
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
    <div>
      <h1 className="titulo-marca">Elige una marca de móvil</h1>
      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {marcas.map((marcaObj) => (
          <button
            key={marcaObj.id}
            onClick={() => onSelectMarca(marcaObj)}
            className="boton-marca"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              width: '350px',
              height: '350px',
            }}
          >
            <img
              className="logo-imagen"
              src={marcaObj.logo}
              alt={marcaObj.nombre}
              style={{
                width: '270px',
                height: '270px',
                objectFit: 'contain',
                maxWidth: 'none',
                maxHeight: 'none',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
