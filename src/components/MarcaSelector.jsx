import React from "react";
import "./CatalogViewer.css";

export const MarcaSelector = ({ marcas = [], loading, onSelectMarca }) => {
  return (
    <section className="catalog-view">
      <header className="catalog-header catalog-header--hero">
        <div>
          <span className="eyebrow">Catálogo</span>
          <h1 className="titulo-marca">Marcas</h1>
        </div>
        <span className="summary-pill">{marcas.length} marcas</span>
      </header>

      {loading && (
        <div className="state-panel">
          <span className="loader-dot" />
          Cargando marcas...
        </div>
      )}

      {!loading && marcas.length === 0 && (
        <div className="empty-state">No hay marcas disponibles.</div>
      )}

      {!loading && marcas.length > 0 && (
        <div className="marca-grid">
          {marcas.map((marcaObj) => (
            <button
              key={marcaObj.id}
              onClick={() => onSelectMarca(marcaObj)}
              className="marca-card"
            >
              <span className="marca-card__media">
                <img
                  className="logo-imagen"
                  src={marcaObj.logo}
                  alt=""
                  aria-hidden="true"
                />
              </span>
              <span className="marca-card__name">{marcaObj.nombre}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
