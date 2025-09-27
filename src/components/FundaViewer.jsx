// src/components/FundaViewer.jsx
import React, { useState, useEffect } from "react";
import "./CatalogViewer.css";

export const FundaViewer = ({ marca, modelo, onVolver, onGuardarFunda }) => {
  const marcaNombre = marca.marca === "iPhone" ? "Apple" : marca.marca;
  const [contadores, setContadores] = useState({});
  const [designs, setDesigns] = useState({});
  const [loading, setLoading] = useState(true);

  // 🚀 Cargar diseños desde backend
  useEffect(() => {
    fetch("/api/designs")
      .then((res) => res.json())
      .then((data) => {
        setDesigns(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando diseños:", err);
        setLoading(false);
      });
  }, []);

  const handleIncrement = (tipo, estilo = "default") => {
    const clave = `${tipo}-${estilo}`;
    setContadores((prev) => ({
      ...prev,
      [clave]: (prev[clave] || 0) + 1,
    }));
  };

  const handleDecrement = (tipo, estilo = "default") => {
    const clave = `${tipo}-${estilo}`;
    setContadores((prev) => ({
      ...prev,
      [clave]: Math.max((prev[clave] || 0) - 1, 0),
    }));
  };

  const handleGuardar = (tipo, estilo = "default") => {
    const clave = `${tipo}-${estilo}`;
    const cantidad = contadores[clave] || 0;

    if (cantidad > 0) {
      onGuardarFunda({
        marca: marca.marca,
        modelo: modelo.nombre,
        tipo,
        estilo: estilo === "default" ? null : estilo,
        cantidad,
      });

      // Resetear contador después de guardar
      setContadores((prev) => ({
        ...prev,
        [clave]: 0,
      }));
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <img
          src="/loading.gif"
          alt="Cargando..."
          className="w-24 h-24 object-contain"
        />
      </div>
    );
  }

  return (
    <div>
      <button onClick={onVolver} className="boton-marca">
        ← Volver a modelos
      </button>
      <h2 className="titulo-marca">Fundas para {modelo.nombre}</h2>

      {modelo.fundas.map((tipo) => {
        const estilos = designs[marcaNombre]?.[tipo];

        return (
          <div key={tipo} style={{ marginTop: "20px" }}>
            <h3 className="titulo-funda">{tipo}</h3>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {estilos && estilos.length > 0 ? (
                estilos.map((estilo, index) => {
                  const clave = `${tipo}-${estilo}`;
                  return (
                    <div key={index} className="estilo-funda">
                      <span>{estilo}</span>
                      <button onClick={() => handleDecrement(tipo, estilo)}>
                        -
                      </button>
                      <span>{contadores[clave] || 0}</span>
                      <button onClick={() => handleIncrement(tipo, estilo)}>
                        +
                      </button>
                      <button onClick={() => handleGuardar(tipo, estilo)}>
                        Guardar
                      </button>
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
