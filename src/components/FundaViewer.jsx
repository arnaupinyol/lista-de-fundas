// src/components/FundaViewer.jsx
import React, { useState } from 'react';
import { fundaDesigns } from '../data/designs';
import './CatalogViewer.css';

export const FundaViewer = ({ marca, modelo, onVolver, onGuardarFunda }) => {
  const marcaNombre = marca.marca === 'iPhone' ? 'Apple' : marca.marca;
  const [contadores, setContadores] = useState({});

  const handleIncrement = (tipo, estilo = 'default') => {
    const clave = `${tipo}-${estilo}`;
    setContadores((prev) => ({
      ...prev,
      [clave]: (prev[clave] || 0) + 1,
    }));
  };

  const handleDecrement = (tipo, estilo = 'default') => {
    const clave = `${tipo}-${estilo}`;
    setContadores((prev) => ({
      ...prev,
      [clave]: Math.max((prev[clave] || 0) - 1, 0),
    }));
  };

  const handleGuardar = (tipo, estilo = 'default') => {
    const cantidad = contadores[`${tipo}-${estilo}`] || 0;
    if (cantidad > 0) {
      onGuardarFunda({
        marca: marca.marca,
        modelo: modelo.nombre,
        tipo,
        estilo: estilo === 'default' ? null : estilo,
        cantidad,
      });
    }
  };

  return (
    <div>
      <button onClick={onVolver} className="boton-marca">
        ← Volver a modelos
      </button>
      <h2 className="titulo-marca">Fundas para {modelo.nombre}</h2>

      {modelo.fundas.map((tipo) => {
        const estilos = fundaDesigns[marcaNombre]?.[tipo];

        return (
          <div key={tipo} style={{ marginTop: '20px' }}>
            <h3 className="titulo-funda">{tipo}</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {estilos && estilos.length > 0 ? (
                estilos.map((estilo, index) => {
                  const clave = `${tipo}-${estilo}`;
                  return (
                    <div key={index} className="estilo-funda">
                      <span>{estilo}</span>
                      <button onClick={() => handleDecrement(tipo, estilo)}>-</button>
                      <span>{contadores[clave] || 0}</span>
                      <button onClick={() => handleIncrement(tipo, estilo)}>+</button>
                      <button onClick={() => handleGuardar(tipo, estilo)}>Guardar</button>
                    </div>
                  );
                })
              ) : (
                <div className="estilo-funda">
                  <span>Sin estilo</span>
                  <button onClick={() => handleDecrement(tipo)}>-</button>
                  <span>{contadores[`${tipo}-default`] || 0}</span>
                  <button onClick={() => handleIncrement(tipo)}>+</button>
                  <button onClick={() => handleGuardar(tipo)}>Guardar</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
