import React, { useEffect, useState } from "react";
import { getModelosPorMarca, deleteModelo } from "../lib/catalogService";
import { AñadirModelo } from "./AñadirModelo";
import { FundasManager } from "./FundasManager";   // 👈 nuevo
import "./CatalogViewer.css";

export const ModeloSelector = ({ marca, onSelectModelo, onVolver }) => {
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAñadir, setShowAñadir] = useState(false);
  const [modoEliminar, setModoEliminar] = useState(false);
  const [modeloAEliminar, setModeloAEliminar] = useState(null);

  const [editarFundas, setEditarFundas] = useState(false); // 👈 nuevo estado

  // cargar modelos
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await getModelosPorMarca(marca.id);
      if (error) {
        console.error("Error cargando modelos:", error);
        setModelos([]);
      } else {
        setModelos(data || []);
      }
      setLoading(false);
    })();
  }, [marca]);

  const confirmarEliminar = async () => {
    if (!modeloAEliminar) return;
    const { error } = await deleteModelo(modeloAEliminar.id);
    if (error) {
      console.error("❌ Error al eliminar modelo:", error);
      alert("Error eliminando el modelo");
      return;
    }
    setModelos((prev) => prev.filter((m) => m.id !== modeloAEliminar.id));
    setModeloAEliminar(null);
  };

  // 👇 si está en modo edición de fundas, mostramos esa vista
  if (editarFundas) {
    return (
      <FundasManager
        marca={marca}
        onVolver={() => setEditarFundas(false)} // volver aquí
      />
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onVolver}
          className="boton-marca"
          style={{ background: "none", border: "none", padding: 0, display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span style={{ fontSize: "1.5em" }}>←</span>
          <img src="/favicon.png" alt="Inicio" style={{ height: 40, objectFit: "contain" }} />
        </button>

        <button onClick={() => setShowAñadir(true)} className="boton-marca">
          ➕ Añadir modelo
        </button>

        <button
          onClick={() => setModoEliminar((prev) => !prev)}
          className="boton-marca"
          style={{ backgroundColor: modoEliminar ? "tomato" : "" }}
        >
          {modoEliminar ? "❌ Cancelar eliminar" : "🗑️ Eliminar modelo"}
        </button>

        <button onClick={() => setEditarFundas(true)} className="boton-marca">
          ✏️ Editar fundas
        </button>
      </div>

      <h2 className="titulo-marca">Modelos de {marca.nombre}</h2>

      {loading && <div>Cargando...</div>}

      {!loading && modelos.map((modelo) => (
        <div key={modelo.id} style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => !modoEliminar && onSelectModelo(modelo)}
            className={`boton-modelo${modoEliminar ? " vibrando" : ""}`}
            style={{ opacity: modoEliminar ? 0.6 : 1 }}
          >
            {modelo.nombre}
          </button>
          {modoEliminar && (
            <button
              onClick={() => setModeloAEliminar(modelo)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          )}
        </div>
      ))}

      {!loading && !modelos.length && <div>No hay modelos para esta marca.</div>}

      {showAñadir && (
        <AñadirModelo
          marca={marca}
          onClose={() => setShowAñadir(false)}
          onModeloAñadido={(nuevoModelo) => setModelos((prev) => [...prev, nuevoModelo])}
        />
      )}

      {modeloAEliminar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "white", padding: 20, borderRadius: 8, width: 300 }}>
            <h3>¿Eliminar modelo?</h3>
            <p>{modeloAEliminar.nombre}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={() => setModeloAEliminar(null)} className="boton-marca">
                Cancelar
              </button>
              <button onClick={confirmarEliminar} className="boton-marca" style={{ background: "red", color: "white" }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
