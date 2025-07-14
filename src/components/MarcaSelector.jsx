// src/components/MarcaSelector.jsx
import React from 'react';
import jsPDF from 'jspdf';
import './CatalogViewer.css';

export const MarcaSelector = ({ marcas, onSelectMarca, carrete }) => {
  const exportarPDF = () => {
    const agrupado = carrete.reduce((acc, item) => {
      const clave = `${item.modelo}-${item.tipo}-${item.estilo || 'sin-estilo'}`;
      if (!acc[clave]) {
        acc[clave] = { ...item };
      } else {
        acc[clave].cantidad += item.cantidad;
      }
      return acc;
    }, {});

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Carrete de fundas', 20, 20);

    const fundas = Object.values(agrupado);
    let y = 30;

    if (fundas.length === 0) {
      doc.setFontSize(12);
      doc.text('El carrete está vacío.', 20, y);
    } else {
      fundas.forEach((item, idx) => {
        const estilo = item.estilo ? ` (${item.estilo})` : '';
        doc.setFontSize(12);
        doc.text(
          `• ${item.modelo} – ${item.tipo}${estilo} × ${item.cantidad}`,
          20,
          y + idx * 10
        );
      });
    }

    doc.save('carrete.pdf');
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
              width: '250px',
              height: '250px'
            }}
          >
          <img className="logo-imagen"
            src={marcaObj.logo}
            alt={marcaObj.marca}
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'contain',
              maxWidth: 'none',
              maxHeight: 'none'
            }}
          />
          </button>
        ))}
      </div>
      <button onClick={exportarPDF} className="boton-exportar">
        📄 Exportar carrete a PDF
      </button>
    </div>
  );
};
