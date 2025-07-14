// src/components/MarcaSelector.jsx
import React from 'react';
import jsPDF from 'jspdf';
import './CatalogViewer.css';

export const MarcaSelector = ({ marcas, onSelectMarca, carrete }) => {
  const exportarPDF = () => {
  // Agrupamos por modelo, luego tipo, luego estilo con cantidad
  const agrupadoPorModelo = carrete.reduce((acc, item) => {
    if (!acc[item.modelo]) {
      acc[item.modelo] = {};
    }
    if (!acc[item.modelo][item.tipo]) {
      acc[item.modelo][item.tipo] = {};
    }
    const estiloClave = item.estilo || 'sin-estilo';
    if (!acc[item.modelo][item.tipo][estiloClave]) {
      acc[item.modelo][item.tipo][estiloClave] = { ...item };
    } else {
      acc[item.modelo][item.tipo][estiloClave].cantidad += item.cantidad;
    }
    return acc;
  }, {});

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Carrete de fundas', 20, 20);

  let y = 30;

  if (Object.keys(agrupadoPorModelo).length === 0) {
    doc.setFontSize(12);
    doc.text('El carrete está vacío.', 20, y);
  } else {
    Object.entries(agrupadoPorModelo).forEach(([modelo, tipos]) => {
      doc.setFontSize(14);
      doc.text(`Modelo: ${modelo}`, 20, y);
      y += 10;

      Object.entries(tipos).forEach(([tipo, estilos]) => {
        // Sumar cantidades totales del tipo para mostrar junto al nombre
        const cantidadTotal = Object.values(estilos).reduce((sum, e) => sum + e.cantidad, 0);

        doc.setFontSize(12);
        doc.text(`• ${tipo}${cantidadTotal > 1 ? ` × ${cantidadTotal}` : ''}`, 25, y);
        y += 8;

        const estilosKeys = Object.keys(estilos);

        // Si solo hay un estilo 'sin-estilo', mostramos todo en la línea
        if (estilosKeys.length === 1 && estilosKeys[0] === 'sin-estilo') {
          // Ya mostramos cantidad total en la línea del tipo, no hace falta estilo aquí
          // Solo para que quede bonito, bajamos la y 8 para el próximo item
          y += 2;
        } else {
          // Mostrar cada estilo como sublínea con guion y cantidad
          Object.entries(estilos).forEach(([estilo, itemEstilo]) => {
            if (estilo === 'sin-estilo') {
              // Si hay estilo sin nombre, no mostramos el guion y nombre vacío, solo cantidad
              doc.text(`- sin estilo × ${itemEstilo.cantidad}`, 35, y);
            } else {
              doc.text(`- ${estilo} × ${itemEstilo.cantidad}`, 35, y);
            }
            y += 8;
          });
        }

        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });

      y += 8; // espacio extra entre modelos
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
