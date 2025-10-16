// src/components/FundaViewer.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getFundasPorMarca } from "../lib/catalogService";
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
        console.error("❌ Error fundas por marca:", error);
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

  // Agrupar fundas per tipus
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

  // Control de quantitats
  const keyOf = (tipo, estilo = "default") => `${tipo}:::${estilo}`;
  const inc = (tipo, estilo = "default") =>
    setContadores((p) => ({
      ...p,
      [keyOf(tipo, estilo)]: (p[keyOf(tipo, estilo)] || 0) + 1,
    }));
  const dec = (tipo, estilo = "default") =>
    setContadores((p) => ({
      ...p,
      [keyOf(tipo, estilo)]: Math.max((p[keyOf(tipo, estilo)] || 0) - 1, 0),
    }));
  const handleGuardar = (tipo, estilo = "default") => {
    onGuardarFunda({
      modelo: modelo.nombre,
      tipo,
      estilo: estilo === "default" ? null : estilo,
      cantidad: contadores[keyOf(tipo, estilo)] || 0,
    });
    // Resetear el contador después de guardar
    setContadores((prev) => ({
      ...prev,
      [keyOf(tipo, estilo)]: 0,
    }));
  };

  // 🔍 Funció per detectar colors foscos
  const esColorFosc = (color) => {
    if (!color) return false;
    const c = color.trim().toLowerCase();
    if (["#000", "#000000", "black", "rgb(0,0,0)"].includes(c)) return true;
    // Si és hexadecimal llarg, calculem la lluminositat
    if (c.startsWith("#") && c.length === 7) {
      const r = parseInt(c.slice(1, 3), 16);
      const g = parseInt(c.slice(3, 5), 16);
      const b = parseInt(c.slice(5, 7), 16);
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return lum < 60; // qualsevol color molt fosc
    }
    return false;
  };

  return (
    <div>
      {/* 🔙 Botó tornar */}
      <button
        onClick={onVolver}
        className="boton-marca"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "1.5em" }}>←</span>
        <img
          src={`/${marca.nombre.toLowerCase()}.png`}
          alt={marca.nombre}
          style={{ height: 40, objectFit: "contain" }}
        />
      </button>

      <h2 className="titulo-marca">Fundas para {modelo.nombre}</h2>

      {loading && (
        <div
          style={{
            minHeight: "40vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/loading.gif"
            alt="Cargando..."
            style={{ width: 96, height: 96, objectFit: "contain" }}
          />
        </div>
      )}

      {!loading && !tiposParaMarca.length && <div>No hay fundas disponibles.</div>}

      {!loading &&
        tiposParaMarca.map((tipo) => {
          const estilos = tipoMap[tipo] || [];
          const sinColor = estilos.length === 0;

          return (
            <div key={tipo} className="tipo-funda">
              <h3>{tipo}</h3>
              <div className="estilos-grid">
                {/* 🔸 Fundes amb color */}
                {!sinColor &&
                  estilos.map((estilo) => {
                    const k = keyOf(tipo, estilo);
                    const cantidad = contadores[k] || 0;
                    const color =
                      estilo.startsWith("#") ||
                      [
                        "black",
                        "white",
                        "red",
                        "blue",
                        "green",
                        "pink",
                        "purple",
                        "gold",
                        "silver",
                        "gray",
                        "transparent",
                      ].includes(estilo.toLowerCase())
                        ? estilo
                        : "#ccc";

                    const fosc = esColorFosc(color);

                    return (
                      <div key={k} className="color-funda">
                        <button
                          className="color-circulo"
                          onClick={() => cantidad > 0 && handleGuardar(tipo, estilo)}
                          title={cantidad > 0 ? "Guardar" : "Selecciona cantidad"}
                          style={{
                            backgroundColor: color,
                            border: "2px solid black",
                            cursor: cantidad > 0 ? "pointer" : "default",
                            position: "relative",
                          }}
                        >
                          {cantidad > 0 && (
                            <img
                              src="/guardar.png"
                              alt="Guardar"
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                height: "26px",
                                width: "26px",
                                filter: fosc ? "invert(1)" : "none",
                              }}
                            />
                          )}
                        </button>
                        <div className="contador">
                          <button onClick={() => dec(tipo, estilo)}>-</button>
                          <span>{cantidad}</span>
                          <button onClick={() => inc(tipo, estilo)}>+</button>
                        </div>
                      </div>
                    );
                  })}

                {/* 🔸 Fundes sense color */}
                {sinColor && (
                  <div className="color-funda">
                    {(() => {
                      const k = keyOf(tipo, "default");
                      const cantidad = contadores[k] || 0;
                      return (
                        <>
                          <button
                            className="color-circulo"
                            onClick={() => cantidad > 0 && handleGuardar(tipo)}
                            title={cantidad > 0 ? "Guardar" : "Selecciona cantidad"}
                            style={{
                              backgroundColor: "#fff",
                              border: "2px solid black",
                              cursor: cantidad > 0 ? "pointer" : "default",
                              position: "relative",
                            }}
                          >
                            {cantidad > 0 && (
                              <img
                                src="/guardar.png"
                                alt="Guardar"
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  height: "26px",
                                  width: "26px",
                                }}
                              />
                            )}
                          </button>
                          <div className="contador">
                            <button onClick={() => dec(tipo)}>-</button>
                            <span>{cantidad}</span>
                            <button onClick={() => inc(tipo)}>+</button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};
