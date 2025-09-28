// src/components/FundaViewer.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getFundasPorMarca } from "../lib/catalogService";
import "./CatalogViewer.css";

export const FundaViewer = ({ marca, modelo, onVolver, onGuardarFunda }) => {
  const [fundas, setFundas] = useState([]);
  const [contadores, setContadores] = useState({});
  const [loading, setLoading] = useState(true);

  // Cargar fundas por marca (no hay fundas por modelo en tu tabla)
  useEffect(() => {
  (async () => {
    if (!marca) return;
    setLoading(true);
    const { data, error } = await getFundasPorMarca(marca.id);
    if (error) {
      console.error("❌ Error fundas por marca:", error);
      setFundas([]);
    } else {
      let lista = data || [];

      // 🔥 Si el modelo tiene definida su lista de fundas, filtramos
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

  const keyOf = (tipo, estilo = "default") => `${tipo}:::${estilo}`;
  const inc = (tipo, estilo = "default") =>
    setContadores(p => ({ ...p, [keyOf(tipo, estilo)]: (p[keyOf(tipo, estilo)] || 0) + 1 }));
  const dec = (tipo, estilo = "default") =>
    setContadores(p => ({ ...p, [keyOf(tipo, estilo)]: Math.max((p[keyOf(tipo, estilo)] || 0) - 1, 0) }));
  const save = (tipo, estilo = "default") => {
    const k = keyOf(tipo, estilo);
    const cantidad = contadores[k] || 0;
    if (!cantidad) return;
    onGuardarFunda({
      marca: marca.nombre,
      modelo: modelo.nombre,
      tipo,
      estilo: estilo === "default" ? null : estilo,
      cantidad,
    });
    setContadores(p => ({ ...p, [k]: 0 }));
  };

  return (
    <div>
      <button onClick={onVolver} className="boton-marca" style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "1.5em" }}>←</span>
        <img src={`/${marca.nombre.toLowerCase()}.png`} alt={marca.nombre} style={{ height: 40, objectFit: "contain" }} />
      </button>

      <h2 className="titulo-marca">Fundas para {modelo.nombre}</h2>

      {loading && (
        <div style={{ minHeight: "40vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src="/loading.gif" alt="Cargando..." style={{ width: 96, height: 96, objectFit: "contain" }} />
        </div>
      )}
      {!loading && !tiposParaMarca.length && <div>No hay fundas disponibles.</div>}

      {!loading && tiposParaMarca.map((tipo) => {
        const estilos = tipoMap[tipo] || [];
        return (
          <div key={tipo} style={{ marginTop: "20px" }}>
            <h3 className="titulo-funda">{tipo}</h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {estilos.length > 0 ? (
                estilos.map((estilo) => {
                  const k = keyOf(tipo, estilo);
                  const cantidad = contadores[k] || 0;
                  return (
                    <div key={k} className="estilo-funda">
                      <span style={{ marginRight: 8 }}>{estilo}</span>
                      <button onClick={() => dec(tipo, estilo)}>-</button>
                      <span style={{ margin: "0 8px" }}>{cantidad}</span>
                      <button onClick={() => inc(tipo, estilo)}>+</button>
                      {cantidad > 0 && (
                        <button onClick={() => save(tipo, estilo)} style={{ marginLeft: 8, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                          <img src="/guardar.png" alt="Guardar" style={{ height: 32, objectFit: "contain" }} />
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="estilo-funda">
                  <span style={{ marginRight: 8 }}>Sin estilo</span>
                  <button onClick={() => dec(tipo)}>-</button>
                  <span style={{ margin: "0 8px" }}>{contadores[keyOf(tipo)] || 0}</span>
                  <button onClick={() => inc(tipo)}>+</button>
                  {(contadores[keyOf(tipo)] || 0) > 0 && (
                    <button onClick={() => save(tipo)} style={{ marginLeft: 8, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
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
