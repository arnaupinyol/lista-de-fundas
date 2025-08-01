// src/components/CarreteSidebar.jsx
import React from 'react';
import './CarreteSidebar.css';

export const CarreteSidebar = ({ items, onEliminarFunda }) => {
  const agrupado = items.reduce((acc, item) => {
    const clave = `${item.modelo}-${item.tipo}-${item.estilo || 'sin-estilo'}`;
    if (!acc[clave]) {
      acc[clave] = { ...item };
    } else {
      acc[clave].cantidad += item.cantidad;
    }
    return acc;
  }, {});

  const fundasAgrupadas = Object.values(agrupado);

  return (
    <div className="carrete-sidebar">
      <h3>Carrito</h3>
      {fundasAgrupadas.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#555' }}>Vacío</p>
      ) : (
        <ul>
          {fundasAgrupadas.map((item, index) => (
            <li key={index}>
              {item.modelo} – {item.tipo}
              {item.estilo && ` (${item.estilo})`} × <strong>{item.cantidad}</strong>
              <button
                onClick={() => onEliminarFunda(item)}
                style={{ marginLeft: '8px', color: 'red' }}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
