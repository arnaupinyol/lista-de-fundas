// src/components/FundaViewer.jsx
import React, { useState, useMemo } from "react";
import "./CatalogViewer.css";

export const FundaViewer = ({ marca, modelo, onVolver, onGuardarFunda }) => {
  // contadores por combinación tipo-estilo
  const [contadores, setContadores] = useState({});

  // Construir un mapa tipo -> variaciones a partir de marca.fundas.
  // Acepta varias formas: marca.fundas puede ser [{ tipo, variaciones }, ...]
  const tipoMap = useMemo(() => {
    const map = {};
    if (!marca || !marca.fundas) return map;

    for (const f of marca.fundas) {
      // soporte por si la propiedad viene con distinto nombre
      const tipo = f.tipo || f.tipo_funda || f.type || f.name;
      const variaciones = f.variaciones || f.variations || f.styles || [];
      if (!tipo) continue;
      map[tipo] = Array.isArray(variaciones) ? variaciones : [];
    }
    return map;
  }, [marca]);

  // Determinar la lista de tipos que corresponden al modelo seleccionado.
  // Si el modelo trae su propia lista (strings), la usamos; si no, usamos todas las de la marca.
  const tiposParaModelo = useMemo(() => {
    if (!modelo) return [];

    // Si el modelo trae fundas como array de strings (ej: ["BOOK","SILICONA"])
    if (Array.isArray(modelo.fundas) && modelo.fundas.length > 0) {
      return modelo.fundas;
    }

    // Si modelo no tiene fundas, devolver todos los tipos de la marca
    return Object.keys(tipoMap);
  }, [modelo, tipoMap]);

  // helpers de contadores
  const handleIncrement = (tipo, estilo = "default") => {
    const clave = `${tipo}:::${estilo}`;
    setContadores((prev) => ({ ...prev, [clave]: (prev[clave] || 0) + 1 }));
  };

  const handleDecrement = (tipo, estilo = "default") => {
    const clave = `${tipo}:::${estilo}`;
    setContadores((prev) => ({ ...prev, [clave]: Math.max((prev[clave] || 0) - 1, 0) }));
  };

  const handleGuardar = (tipo, estilo = "default") => {
    const clave = `${tipo}:::${estilo}`;
    const cantidad = contadores[clave] || 0;
    if (cantidad <= 0) return;

    onGuardarFunda({
      marca: marca.marca || marca.nombre || marca, // soporta distintos nombres
      modelo: modelo.nombre,
      tipo,
      estilo: estilo === "default" ? null : estilo,
      cantidad,
    });

    // resetear el contador para esa combinación
    setContadores((prev) => ({ ...prev, [clave]: 0 }));
  };

  // si no hay marca/modelo o no hay tipos, mostrar mensaje
  if (!marca || !modelo) {
    return (
      <div>
        <button
          onClick={onVolver}
          className="boton-marca"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span style={{ fontSize: "1.5em" }}>←</span>
          <img
            src="/favicon.png"
            alt="Inicio"
            style={{ height: 40, objectFit: "contain" }}
          />
        </button>
        <div className="p-4">Selecciona una marca y un modelo.</div>
      </div>
    );
  }

  // DEBUG (opcional): descomenta si quieres ver en consola cómo se mapean tipos/variaciones
  // console.log("tipoMap:", tipoMap);
  // console.log("tiposParaModelo:", tiposParaModelo);

  return (
    <div>
      <button
        onClick={onVolver}
        className="boton-marca"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "1.5em" }}>←</span>
        <img
          src={`/${(marca.marca || marca.nombre || marca).toLowerCase()}.png`}
          alt={marca.marca || marca.nombre || marca}
          style={{ height: 40, objectFit: "contain" }}
        />
      </button>
      <h2 className="titulo-marca">Fundas para {modelo.nombre}</h2>

      {tiposParaModelo.length === 0 && (
        <div>No hay tipos de fundas disponibles para este modelo.</div>
      )}

      {tiposParaModelo.map((tipo) => {
        // Busca las variaciones para este tipo en el mapa; si no existen, se muestra "Sin estilo".
        const estilos = tipoMap[tipo] || [];

        return (
          <div key={tipo} style={{ marginTop: "20px" }}>
            <h3 className="titulo-funda">{tipo}</h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {estilos.length > 0 ? (
                estilos.map((estilo, index) => {
                  const clave = `${tipo}:::${estilo}`;
                  const cantidad = contadores[clave] || 0;
                  return (
                    <div key={index} className="estilo-funda">
                      <span style={{ marginRight: 8 }}>{estilo}</span>
                      <button onClick={() => handleDecrement(tipo, estilo)}>-</button>
                      <span style={{ margin: "0 8px" }}>{cantidad}</span>
                      <button onClick={() => handleIncrement(tipo, estilo)}>+</button>
                      {cantidad > 0 && (
                        <button
                          onClick={() => handleGuardar(tipo, estilo)}
                          style={{ marginLeft: 8, background: "none", border: "none", padding: 0, cursor: "pointer" }}
                        >
                          <img src="/guardar.png" alt="Guardar" style={{ height: 32, objectFit: "contain" }} />
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="estilo-funda">
                  <span style={{ marginRight: 8 }}>Sin estilo</span>
                  <button onClick={() => handleDecrement(tipo)}>-</button>
                  <span style={{ margin: "0 8px" }}>{contadores[`${tipo}:::default`] || 0}</span>
                  <button onClick={() => handleIncrement(tipo)}>+</button>
                  {(contadores[`${tipo}:::default`] || 0) > 0 && (
                    <button
                      onClick={() => handleGuardar(tipo)}
                      style={{ marginLeft: 8, background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <img src="/guardar.png" alt="Guardar" style={{ height: 32, objectFit: "contain" }} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
