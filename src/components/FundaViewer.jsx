import React, { useEffect, useMemo, useState } from "react";
import { getFundasPorMarca } from "../lib/catalogService";
import { getColorValue, isDarkColor } from "../lib/colorUtils";
import "./CatalogViewer.css";

export const FundaViewer = ({ marca, modelo, onVolver, onGuardarFunda }) => {
  const [fundas, setFundas] = useState([]);
  const [contadores, setContadores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!marca) return;
      setLoading(true);
      const { data, error } = await getFundasPorMarca(marca.id);
      if (error) {
        console.error("Error fundas por marca:", error);
        setFundas([]);
      } else {
        let lista = data || [];
        if (Array.isArray(modelo.fundas) && modelo.fundas.length > 0) {
          lista = lista.filter((f) => modelo.fundas.includes(f.tipo_funda));
        }
        setFundas(lista);
      }
      setLoading(false);
    })();
  }, [marca, modelo]);

  const tipoMap = useMemo(() => {
    const map = {};
    for (const f of fundas) {
      const tipo = f.tipo_funda;
      if (!tipo) continue;
      if (!map[tipo]) map[tipo] = [];
      for (const v of f.variaciones || []) {
        if (!map[tipo].includes(v)) map[tipo].push(v);
      }
    }
    return map;
  }, [fundas]);

  const tiposParaMarca = useMemo(() => Object.keys(tipoMap), [tipoMap]);

  const totalSeleccionado = useMemo(
    () => Object.values(contadores).reduce((total, value) => total + value, 0),
    [contadores]
  );

  const keyOf = (tipo, estilo = "default") => `${tipo}:::${estilo}`;

  const inc = (tipo, estilo = "default") =>
    setContadores((prev) => ({
      ...prev,
      [keyOf(tipo, estilo)]: (prev[keyOf(tipo, estilo)] || 0) + 1,
    }));

  const dec = (tipo, estilo = "default") =>
    setContadores((prev) => ({
      ...prev,
      [keyOf(tipo, estilo)]: Math.max((prev[keyOf(tipo, estilo)] || 0) - 1, 0),
    }));

  const handleGuardar = (tipo, estilo = "default") => {
    const cantidad = contadores[keyOf(tipo, estilo)] || 0;
    if (cantidad <= 0) return;

    onGuardarFunda({
      modelo: modelo.nombre,
      tipo,
      estilo: estilo === "default" ? null : estilo,
      cantidad,
    });

    setContadores((prev) => ({
      ...prev,
      [keyOf(tipo, estilo)]: 0,
    }));
  };

  const renderOpcionFunda = (tipo, estilo = "default") => {
    const k = keyOf(tipo, estilo);
    const cantidad = contadores[k] || 0;
    const sinColor = estilo === "default";
    const color = sinColor ? "#ffffff" : getColorValue(estilo);
    const fosc = isDarkColor(color);

    return (
      <div key={k} className="color-funda">
        <button
          className={`swatch-button${cantidad > 0 ? " swatch-button--active" : ""}`}
          onClick={() => handleGuardar(tipo, estilo)}
          disabled={cantidad === 0}
          title={cantidad > 0 ? "Guardar" : "Selecciona cantidad"}
          style={{ backgroundColor: color }}
        >
          {cantidad > 0 && (
            <img
              src="/guardar.png"
              alt="Guardar"
              className={`swatch-save-icon${fosc ? " swatch-save-icon--light" : ""}`}
            />
          )}
        </button>

        <span className="swatch-label">{sinColor ? "Sin color" : estilo}</span>

        <div className="contador">
          <button onClick={() => dec(tipo, estilo)} className="counter-btn">
            -
          </button>
          <span className="counter-value">{cantidad}</span>
          <button onClick={() => inc(tipo, estilo)} className="counter-btn">
            +
          </button>
        </div>

        <button
          onClick={() => handleGuardar(tipo, estilo)}
          disabled={cantidad === 0}
          className="save-chip"
        >
          Guardar
        </button>
      </div>
    );
  };

  return (
    <section className="catalog-view">
      <div className="screen-toolbar">
        <button onClick={onVolver} className="btn btn-ghost btn-with-logo">
          <span className="back-arrow">←</span>
          <span>Modelos</span>
        </button>
      </div>

      <header className="catalog-header">
        <div>
          <span className="eyebrow">{marca.nombre}</span>
          <h2 className="titulo-marca">Fundas para {modelo.nombre}</h2>
        </div>
        <div className="header-pills">
          <span className="summary-pill">{tiposParaMarca.length} tipos</span>
          {totalSeleccionado > 0 && (
            <span className="summary-pill summary-pill--accent">
              {totalSeleccionado} seleccionadas
            </span>
          )}
        </div>
      </header>

      {loading && (
        <div className="state-panel state-panel--loading">
          <img src="/loading.gif" alt="Cargando..." className="loading-image" />
          Cargando fundas...
        </div>
      )}

      {!loading && !tiposParaMarca.length && (
        <div className="empty-state">No hay fundas disponibles.</div>
      )}

      {!loading && tiposParaMarca.length > 0 && (
        <div className="fundas-list">
          {tiposParaMarca.map((tipo) => {
            const estilos = tipoMap[tipo] || [];
            const sinColor = estilos.length === 0;

            return (
              <article key={tipo} className="tipo-funda">
                <div className="tipo-funda__header">
                  <h3>{tipo}</h3>
                  <span>{sinColor ? "1 opción" : `${estilos.length} colores`}</span>
                </div>

                <div className="estilos-grid">
                  {sinColor
                    ? renderOpcionFunda(tipo)
                    : estilos.map((estilo) => renderOpcionFunda(tipo, estilo))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
