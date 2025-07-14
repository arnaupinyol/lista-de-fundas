// src/components/MarcaSelector.jsx
import React from 'react';
import jsPDF from 'jspdf';
import './CatalogViewer.css';

export const MarcaSelector = ({ marcas, onSelectMarca, carrete }) => {
  const exportarPDF = () => {
  // Primero agrupamos por modelo, luego por tipo y estilo dentro de cada modelo
  const agrupadoPorModelo = carrete.reduce((acc, item) => {
    if (!acc[item.modelo]) {
      acc[item.modelo] = {};
    }
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
    Object.entries(agrupadoPorModelo).forEach(([modelo, fundas], idxModelo) => {
      doc.setFontSize(14);
      doc.text(`Modelo: ${modelo}`, 20, y);
      y += 10;

      Object.values(fundas).forEach((item, idxFunda) => {
        const estilo = item.estilo ? ` (${item.estilo})` : '';
        doc.setFontSize(12);
        doc.text(
          `• ${item.tipo}${estilo} × ${item.cantidad}`,
          30,
          y
        );
        y += 10;
      });

      y += 5; // Espacio entre modelos
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
  }

  const fecha = new Date().toISOString().slice(0, 10); //
  doc.save(`carrito-${fecha}.pdf`);
};


  return (
    <div>
      <h1 className="titulo-marca">Elige una marca de móvil</h1>
      <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {marcas.map((marcaObj) => (
          <button
            key={marcaObj.marca}
            onClick={() => onSelectMarca(marcaObj)}
            className="boton-marca"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              width: '350px',
              height: '350px'
            }}
          >
          <img className="logo-imagen"
            src={marcaObj.logo}
            alt={marcaObj.marca}
            style={{
              width: '270px',
              height: '270px',
              objectFit: 'contain',
              maxWidth: 'none',
              maxHeight: 'none'
            }}
          />
          </button>
        ))}
      </div>
      <button onClick={exportarPDF} className="boton-exportar">
        📄 Exportar carrito a PDF
      </button>
    </div>
  );
};
