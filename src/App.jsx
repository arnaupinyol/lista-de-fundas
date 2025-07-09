import { useState } from 'react';

const productosDisponibles = [
  'Manzanas',
  'Pan',
  'Leche',
  'Huevos',
  'Arroz',
  'Pasta',
  'Jabón',
  'Papel higiénico',
];

export default function App() {
  const [seleccionados, setSeleccionados] = useState([]);

  const toggleProducto = (producto) => {
    if (seleccionados.includes(producto)) {
      setSeleccionados(seleccionados.filter((p) => p !== producto));
    } else {
      setSeleccionados([...seleccionados, producto]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">🛒 Lista de la compra</h1>

      <ul className="space-y-2">
        {productosDisponibles.map((producto) => (
          <li key={producto}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={seleccionados.includes(producto)}
                onChange={() => toggleProducto(producto)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span>{producto}</span>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">✅ Seleccionados:</h2>
        {seleccionados.length > 0 ? (
          <ul className="list-disc list-inside text-green-600">
            {seleccionados.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No has seleccionado nada aún.</p>
        )}
      </div>
    </div>
  );
}
