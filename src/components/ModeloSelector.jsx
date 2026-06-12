import React, { useEffect, useMemo, useState } from "react";
import { getModelosPorMarca, deleteModelo } from "../lib/catalogService";
import { AñadirModelo } from "./AñadirModelo";
import { FundasManager } from "./FundasManager";
import "./CatalogViewer.css";

export const ModeloSelector = ({ marca, onSelectModelo, onVolver }) => {
  const [modelos, setModelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAñadir, setShowAñadir] = useState(false);
  const [modoEliminar, setModoEliminar] = useState(false);
  const [modeloAEliminar, setModeloAEliminar] = useState(null);
  const [editarFundas, setEditarFundas] = useState(false);
  const [busqueda, setBusqueda] = useState("");

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

  const modelosFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();
    if (!term) return modelos;
    return modelos.filter((modelo) =>
      modelo.nombre.toLowerCase().includes(term)
    );
  }, [modelos, busqueda]);

  const confirmarEliminar = async () => {
    if (!modeloAEliminar) return;
    const { error } = await deleteModelo(modeloAEliminar.id);
    if (error) {
      console.error("Error al eliminar modelo:", error);
      alert("Error eliminando el modelo");
      return;
    }
    setModelos((prev) => prev.filter((m) => m.id !== modeloAEliminar.id));
    setModeloAEliminar(null);
  };

  if (editarFundas) {
    return (
      <FundasManager
        marca={marca}
        onVolver={() => setEditarFundas(false)}
      />
    );
  }

  return (
    <section className="catalog-view">
      <div className="screen-toolbar">
        <button onClick={onVolver} className="btn btn-ghost btn-with-logo">
          <span className="back-arrow">←</span>
          <span>Marcas</span>
        </button>

        <div className="toolbar-actions">
          <button onClick={() => setShowAñadir(true)} className="btn btn-primary">
            Nuevo modelo
          </button>
          <button
            onClick={() => setModoEliminar((prev) => !prev)}
            className={`btn ${modoEliminar ? "btn-danger" : "btn-secondary"}`}
          >
            {modoEliminar ? "Cancelar eliminación" : "Eliminar"}
          </button>
          <button onClick={() => setEditarFundas(true)} className="btn btn-secondary">
            Fundas
          </button>
        </div>
      </div>

      <header className="catalog-header">
        <div>
          <span className="eyebrow">{marca.nombre}</span>
          <h2 className="titulo-marca">Modelos</h2>
        </div>
        <span className="summary-pill">{modelos.length} modelos</span>
      </header>

      <div className="control-row">
        <input
          className="search-input"
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar modelo"
        />
        {modoEliminar && (
          <span className="mode-chip mode-chip--danger">Modo eliminar activo</span>
        )}
      </div>

      {loading && (
        <div className="state-panel">
          <span className="loader-dot" />
          Cargando modelos...
        </div>
      )}

      {!loading && modelos.length === 0 && (
        <div className="empty-state">No hay modelos para esta marca.</div>
      )}

      {!loading && modelos.length > 0 && modelosFiltrados.length === 0 && (
        <div className="empty-state">No hay modelos con ese nombre.</div>
      )}

      {!loading && modelosFiltrados.length > 0 && (
        <div className="modelo-grid">
          {modelosFiltrados.map((modelo) => (
            <article
              key={modelo.id}
              className={`modelo-card${modoEliminar ? " modelo-card--delete" : ""}`}
            >
              <button
                onClick={() => onSelectModelo(modelo)}
                disabled={modoEliminar}
                className="modelo-card__button"
              >
                <span className="modelo-card__name">{modelo.nombre}</span>
                <span className="modelo-card__meta">Ver fundas</span>
              </button>

              {modoEliminar && (
                <button
                  onClick={() => setModeloAEliminar(modelo)}
                  className="modelo-delete-button"
                >
                  Eliminar
                </button>
              )}
            </article>
          ))}
        </div>
      )}

      {showAñadir && (
        <AñadirModelo
          marca={marca}
          onClose={() => setShowAñadir(false)}
          onModeloAñadido={(nuevoModelo) =>
            setModelos((prev) => [...prev, nuevoModelo])
          }
        />
      )}

      {modeloAEliminar && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card modal-card--narrow">
            <h3>Eliminar modelo</h3>
            <p>{modeloAEliminar.nombre}</p>
            <div className="modal-actions">
              <button
                onClick={() => setModeloAEliminar(null)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button onClick={confirmarEliminar} className="btn btn-danger">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
