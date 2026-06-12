import React, { useEffect, useState } from "react";
import { addFunda, getColoresDisponibles } from "../lib/catalogService";
import { getColorValue } from "../lib/colorUtils";
import "./CatalogViewer.css";

export const AñadirFunda = ({ marca, onClose, onFundaAñadida }) => {
  const [tipo, setTipo] = useState("");
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  const [loadingColores, setLoadingColores] = useState(false);

  useEffect(() => {
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
  }, []);

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
    if (!tipo.trim()) {
      alert("Debes escribir un tipo de funda");
      return;
    }

    const { data, error } = await addFunda(
      marca.id,
      tipo.trim(),
      coloresSeleccionados
    );
    if (error) {
      console.error("Error añadiendo funda:", error);
      alert("Error al añadir funda");
      return;
    }

    onFundaAñadida(data[0]);
    onClose();
  };

  const coloresPendientes = coloresDisponibles.filter(
    (color) => !coloresSeleccionados.includes(color)
  );

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <span className="eyebrow">{marca.nombre}</span>
            <h3>Añadir funda</h3>
          </div>
          <button onClick={onClose} className="drawer-close" title="Cerrar">
            ×
          </button>
        </div>

        <label className="form-field">
          <span>Tipo de funda</span>
          <input
            type="text"
            placeholder="Ej. Silicona"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
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
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={guardarFunda} className="btn btn-primary">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
