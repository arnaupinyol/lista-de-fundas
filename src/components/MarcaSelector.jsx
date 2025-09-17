// src/components/MarcaSelector.jsx
import React, { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import "./CatalogViewer.css";
import "./MarcaSelector.css";

export const MarcaSelector = ({ marcas = [], onSelectMarca, carrete }) => {
  const scrollRef = useRef(null);

  const exportarPDF = () => {
    // ... tu lógica actual para generar el PDF (la mantengo intacta)
    const agrupadoPorModelo = carrete.reduce((acc, item) => {
      if (!acc[item.modelo]) acc[item.modelo] = {};
      if (!acc[item.modelo][item.tipo]) acc[item.modelo][item.tipo] = {};
      const estiloClave = item.estilo || "sin-estilo";
      if (!acc[item.modelo][item.tipo][estiloClave]) {
        acc[item.modelo][item.tipo][estiloClave] = { ...item };
      } else {
        acc[item.modelo][item.tipo][estiloClave].cantidad += item.cantidad;
      }
      return acc;
    }, {});

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Carrete de fundas", 20, 20);

    let y = 30;

    if (Object.keys(agrupadoPorModelo).length === 0) {
      doc.setFontSize(12);
      doc.text("El carrete está vacío.", 20, y);
    } else {
      Object.entries(agrupadoPorModelo).forEach(([modelo, tipos]) => {
        doc.setFontSize(14);
        doc.text(`Modelo: ${modelo}`, 20, y);
        y += 10;

        Object.entries(tipos).forEach(([tipo, estilos]) => {
          const cantidadTotal = Object.values(estilos).reduce((sum, e) => sum + e.cantidad, 0);
          doc.setFontSize(12);
          doc.text(`• ${tipo}${cantidadTotal > 1 ? ` × ${cantidadTotal}` : ""}`, 25, y);
          y += 8;

          const estilosKeys = Object.keys(estilos);
          if (estilosKeys.length !== 1 || estilosKeys[0] !== "sin-estilo") {
            Object.entries(estilos).forEach(([estilo, itemEstilo]) => {
              const texto = estilo === "sin-estilo" ? `- sin estilo × ${itemEstilo.cantidad}` : `- ${estilo} × ${itemEstilo.cantidad}`;
              doc.text(texto, 35, y);
              y += 8;
            });
          } else {
            y += 2;
          }

          if (y > 280) {
            doc.addPage();
            y = 20;
          }
        });

        y += 8;
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
    }

    const fecha = new Date().toISOString().slice(0, 10);
    doc.save(`carrito-${fecha}.pdf`);
  };

  // duplicamos la lista para el efecto continua
  const logosDuplicados = [...marcas, ...marcas];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let cancelled = false;

    // recalcula la duración y el gap
    const recalc = () => {
      if (!el || cancelled) return;

      // esperar a que las imágenes carguen
      const imgs = el.querySelectorAll("img");
      const unloaded = Array.from(imgs).filter((img) => !img.complete || img.naturalWidth === 0);

      if (unloaded.length > 0) {
        // si hay imágenes sin cargar, añadimos listeners y salimos
        let loaded = 0;
        const onLoad = () => {
          loaded++;
          if (loaded === unloaded.length) {
            // todas cargadas -> recalcular otra vez
            setTimeout(recalc, 50);
            unloaded.forEach((i) => i.removeEventListener("load", onLoad));
          }
        };
        unloaded.forEach((i) => i.addEventListener("load", onLoad));
        return;
      }

      // ancho total que debe recorrer (solo la mitad, porque duplicamos)
      const totalWidth = el.scrollWidth / 2 || 0;

      // GAP: adaptamos según número de marcas y ancho visible para que no queden logos pegados
      const visibleWidth = el.clientWidth || window.innerWidth;
      const count = Math.max(1, marcas.length);
      // heurística: cuanto más logos, menos gap; mínimo 12px, máximo 80px
      const computedGap = Math.max(12, Math.min(80, Math.floor(visibleWidth / Math.max(4, count) / 4)));
      el.style.setProperty("--logo-gap", `${computedGap}px`);

      // velocidad en px/s (ajusta este valor si quieres más rápido/lento)
      const speed = 110; // px por segundo
      const duration = Math.max(6, totalWidth / speed); // segundos, mínimo 6s

      el.style.setProperty("--scroll-duration", `${duration}s`);
    };

    // usar ResizeObserver si existe (más preciso)
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(recalc);
      ro.observe(el);
      ro.observe(document.body);
    } else {
      window.addEventListener("resize", recalc);
    }

    // cálculo inicial
    recalc();

    return () => {
      cancelled = true;
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", recalc);
    };
  }, [marcas]);

  return (
    <div>
      <h1 className="titulo-marca">Elige una marca de móvil</h1>

      <div className="marca-carrusel">
        <div className="marca-scroll" ref={scrollRef}>
          {logosDuplicados.map((marcaObj, idx) => (
            <div
              key={`${marcaObj?.marca ?? "m"}-${idx}`}
              className="marca-item"
              onClick={() => onSelectMarca(marcaObj)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelectMarca(marcaObj)}
            >
              <img src={marcaObj.logo} alt={marcaObj.marca} className="logo-imagen" />
            </div>
          ))}
        </div>
      </div>

      <button onClick={exportarPDF} className="boton-exportar">
        📄 Exportar carrito a PDF
      </button>
    </div>
  );
};
