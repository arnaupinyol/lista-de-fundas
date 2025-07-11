// src/components/CarreteSidebar.jsx
import React from 'react';
import './CarreteSidebar.css';

export const CarreteSidebar = ({ items }) => {
  return (
    <div className="carrete-sidebar">
      <h3>Carrete</h3>
      {items.length === 0 ? (
        <p style={{ fontStyle: 'italic', color: '#555' }}>Vacío</p>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.modelo} – {item.tipo} {item.estilo && `(${item.estilo})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
