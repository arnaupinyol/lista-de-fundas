import React, { useEffect, useState } from "react";
import { getFundasPorMarca, addModelo } from "../lib/catalogService";
import "./CatalogViewer.css";

export const AñadirModelo = ({ marca, onClose, onModeloAñadido }) => {
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [fundasMarca, setFundasMarca] = useState([]);
  const [fundasSeleccionadas, setFundasSeleccionadas] = useState([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await getFundasPorMarca(marca.id);
      if (error) {
        console.error("Error cargando fundas de marca:", error);
        setFundasMarca([]);
      } else {
        setFundasMarca(data || []);
      }
    })();
  }, [marca]);

  const toggleFunda = (tipo) => {
    setFundasSeleccionadas((prev) =>
      prev.includes(tipo) ? prev.filter((f) => f !== tipo) : [...prev, tipo]
    );
  };

  const guardarModelo = async () => {
    if (!nuevoNombre.trim()) {
      alert("Por favor escribe un nombre para el modelo");
      return;
    }

    const { data, error } = await addModelo(
      nuevoNombre.trim(),
      marca.id,
      fundasSeleccionadas
    );
    if (error) {
      console.error("Error al añadir modelo:", error);
      alert("Error al añadir modelo");
      return;
    }

    onModeloAñadido(data[0]);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <span className="eyebrow">{marca.nombre}</span>
            <h3>Añadir modelo</h3>
          </div>
          <button onClick={onClose} className="drawer-close" title="Cerrar">
            ×
          </button>
        </div>

        <label className="form-field">
          <span>Nombre del modelo</span>
          <input
            type="text"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            placeholder="Ej. Galaxy A15"
          />
        </label>

        <div className="form-field">
          <span>Fundas disponibles</span>
          <div className="checkbox-list">
            {fundasMarca.map((f) => (
              <label key={f.id} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={fundasSeleccionadas.includes(f.tipo_funda)}
                  onChange={() => toggleFunda(f.tipo_funda)}
                />
                <span>{f.tipo_funda}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={guardarModelo} className="btn btn-primary">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
