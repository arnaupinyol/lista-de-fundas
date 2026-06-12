import React, { useEffect, useState } from "react";
import {
  getFundasPorMarca,
  getColoresDisponibles,
  addFunda,
  deleteFunda,
} from "../lib/catalogService";
import { getColorValue } from "../lib/colorUtils";
import "./CatalogViewer.css";

export const FundasManager = ({ marca, onVolver }) => {
  const [fundas, setFundas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAñadir, setShowAñadir] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  const [loadingColores, setLoadingColores] = useState(false);
  const [fundaAEliminar, setFundaAEliminar] = useState(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await getFundasPorMarca(marca.id);
      if (error) {
        console.error("Error cargando fundas:", error);
        setFundas([]);
      } else {
        setFundas(data || []);
      }
      setLoading(false);
    })();
  }, [marca]);

  useEffect(() => {
    if (!showAñadir || coloresDisponibles.length > 0) return;

    (async () => {
      setLoadingColores(true);
      const { data, error } = await getColoresDisponibles();
      if (error) {
        console.error("Error cargando colores:", error);
        setColoresDisponibles([]);
      } else {
        setColoresDisponibles(data || []);
      }
      setLoadingColores(false);
    })();
  }, [showAñadir, coloresDisponibles.length]);

  const cerrarModalAñadir = () => {
    setShowAñadir(false);
    setNuevoTipo("");
    setColoresSeleccionados([]);
  };

  const seleccionarColor = (event) => {
    const color = event.target.value;
    if (!color) return;

    setColoresSeleccionados((prev) =>
      prev.includes(color) ? prev : [...prev, color]
    );
    event.target.value = "";
  };

  const quitarColor = (color) => {
    setColoresSeleccionados((prev) => prev.filter((item) => item !== color));
  };

  const guardarFunda = async () => {
    if (!nuevoTipo.trim()) return;
    const { data, error } = await addFunda(
      marca.id,
      nuevoTipo.trim(),
      coloresSeleccionados
    );
    if (error) {
      alert("Error al añadir funda");
      return;
    }
    setFundas((prev) => [...prev, ...data]);
    cerrarModalAñadir();
  };

  const confirmarEliminar = async () => {
    if (!fundaAEliminar) return;
    const { error } = await deleteFunda(fundaAEliminar.id);
    if (error) {
      alert("Error al eliminar funda");
      return;
    }
    setFundas((prev) => prev.filter((f) => f.id !== fundaAEliminar.id));
    setFundaAEliminar(null);
  };

  const renderColorCircle = (color) => (
    <span key={color} title={color} className="color-name-pill">
      <span
        className="admin-color-chip"
        style={{ backgroundColor: getColorValue(color) }}
      />
      <span>{color}</span>
    </span>
  );

  const coloresPendientes = coloresDisponibles.filter(
    (color) => !coloresSeleccionados.includes(color)
  );

  return (
    <section className="catalog-view">
      <div className="screen-toolbar">
        <button onClick={onVolver} className="btn btn-ghost btn-with-logo">
          <span className="back-arrow">←</span>
          <span>Modelos</span>
        </button>

        <button onClick={() => setShowAñadir(true)} className="btn btn-primary">
          Nueva funda
        </button>
      </div>

      <header className="catalog-header">
        <div>
          <span className="eyebrow">{marca.nombre}</span>
          <h2 className="titulo-marca">Fundas</h2>
        </div>
        <span className="summary-pill">{fundas.length} fundas</span>
      </header>

      {loading && (
        <div className="state-panel">
          <span className="loader-dot" />
          Cargando fundas...
        </div>
      )}

      {!loading && !fundas.length && (
        <div className="empty-state">No hay fundas.</div>
      )}

      {!loading && fundas.length > 0 && (
        <div className="fundas-admin-list">
          {fundas.map((f) => (
            <article key={f.id} className="funda-admin-card">
              <div>
                <h3>{f.tipo_funda}</h3>
                <div className="admin-color-row">
                  {f.variaciones?.length
                    ? f.variaciones.map((color) => renderColorCircle(color))
                    : <span className="muted-text">Sin colores</span>}
                </div>
              </div>

              <button
                onClick={() => setFundaAEliminar(f)}
                className="btn btn-danger btn-small"
              >
                Eliminar
              </button>
            </article>
          ))}
        </div>
      )}

      {showAñadir && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="eyebrow">{marca.nombre}</span>
                <h3>Añadir funda</h3>
              </div>
              <button
                onClick={cerrarModalAñadir}
                className="drawer-close"
                title="Cerrar"
              >
                ×
              </button>
            </div>

            <label className="form-field">
              <span>Tipo de funda</span>
              <input
                type="text"
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value)}
                placeholder="Ej. Silicona"
              />
            </label>

            <label className="form-field">
              <span>Colores</span>
              <select
                className="color-select"
                onChange={seleccionarColor}
                defaultValue=""
                disabled={loadingColores || coloresPendientes.length === 0}
              >
                <option value="" disabled>
                  {loadingColores ? "Cargando colores..." : "Seleccionar color"}
                </option>
                {coloresPendientes.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </label>

            {coloresSeleccionados.length > 0 && (
              <div className="color-preview-row">
                {coloresSeleccionados.map((color) => (
                  <span
                    key={color}
                    title={color}
                    className="color-name-pill color-name-pill--removable"
                  >
                    <span
                      className="color-preview-dot"
                      style={{ backgroundColor: getColorValue(color) }}
                    />
                    <span>{color}</span>
                    <button
                      type="button"
                      onClick={() => quitarColor(color)}
                      className="color-remove-btn"
                      title={`Quitar ${color}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="modal-actions">
              <button
                onClick={cerrarModalAñadir}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button onClick={guardarFunda} className="btn btn-primary">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {fundaAEliminar && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card modal-card--narrow">
            <h3>Eliminar funda</h3>
            <p>{fundaAEliminar.tipo_funda}</p>
            <div className="modal-actions">
              <button
                onClick={() => setFundaAEliminar(null)}
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
