import { useState } from "react";
import jsPDF from "jspdf";

const marcasModelos = {
  Apple: ["iPhone 14", "iPhone 14 Pro", "iPhone 12 Pro Max"],
  Samsung: ["Galaxy S23", "Galaxy A52"],
  Xiaomi: ["Redmi Note 11", "Mi 11 Lite"],
};

const tiposDeFundas = ["Silicona", "Transparente", "Magsafe", "Libro", "Antigolpes"];

export default function App() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [pedido, setPedido] = useState([]);

  const agregarAFundas = () => {
    const tipos = tiposDeFundas.map((tipo) => ({
      tipo,
      cantidad: 0,
    }));
    setPedido([...pedido, { marca, modelo, fundas: tipos }]);
  };

  const actualizarCantidad = (indexPedido, indexFunda, cantidad) => {
    const nuevoPedido = [...pedido];
    nuevoPedido[indexPedido].fundas[indexFunda].cantidad = cantidad;
    setPedido(nuevoPedido);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    pedido.forEach((item, i) => {
      doc.text(`${item.marca} - ${item.modelo}`, 10, y);
      y += 6;
      item.fundas.forEach((funda) => {
        if (funda.cantidad > 0) {
          doc.text(`  ${funda.tipo}: ${funda.cantidad}`, 12, y);
          y += 6;
        }
      });
      y += 4;
    });

    doc.save("pedido-fundas.pdf");
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestor de Pedido de Fundas</h1>

      <div className="flex gap-4 mb-4">
        <select className="border p-2" onChange={(e) => setMarca(e.target.value)} value={marca}>
          <option value="">Marca</option>
          {Object.keys(marcasModelos).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        {marca && (
          <select className="border p-2" onChange={(e) => setModelo(e.target.value)} value={modelo}>
            <option value="">Modelo</option>
            {marcasModelos[marca].map((mod) => (
              <option key={mod}>{mod}</option>
            ))}
          </select>
        )}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={agregarAFundas}
          disabled={!marca || !modelo}
        >
          Añadir
        </button>
      </div>

      {pedido.map((item, i) => (
        <div key={i} className="mb-4 border rounded p-2">
          <h2 className="font-semibold">{item.marca} - {item.modelo}</h2>
          {item.fundas.map((f, j) => (
            <div key={j} className="flex items-center gap-2 my-1">
              <label className="w-32">{f.tipo}</label>
              <input
                type="number"
                className="border p-1 w-20"
                min="0"
                value={f.cantidad}
                onChange={(e) => actualizarCantidad(i, j, parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>
      ))}

      {pedido.length > 0 && (
        <button
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
          onClick={exportarPDF}
        >
          Exportar a PDF
        </button>
      )}
    </div>
  );
}
