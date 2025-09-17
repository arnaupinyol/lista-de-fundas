// backend/server.js
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------
   📂 Funciones auxiliares
------------------------- */
const readJSON = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    throw new Error(`Error leyendo ${filePath}: ${err.message}`);
  }
};

const writeJSON = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    throw new Error(`Error escribiendo ${filePath}: ${err.message}`);
  }
};

/* -------------------------
   📱 CATALOGO (Marcas, Modelos, Fundas)
------------------------- */

// Obtener catálogo
app.get("/api/catalog", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, "catalog.json"), "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Error leyendo catalog.json" });
  }
});

// Añadir marca
app.post("/api/catalog/marca", async (req, res) => {
  const { marca } = req.body;
  if (!marca) return res.status(400).json({ error: "Falta marca" });

  try {
    const catalog = await readJSON(path.join(__dirname, "catalog.json"));
    catalog.push({ marca, modelos: [] });
    await writeJSON(path.join(__dirname, "catalog.json"), catalog);

    res.json({ success: true, catalog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Añadir modelo a una marca
app.post("/api/catalog/modelo", async (req, res) => {
  const { marca, modelo } = req.body;
  if (!marca || !modelo) {
    return res.status(400).json({ error: "Falta marca o modelo" });
  }

  try {
    const catalog = await readJSON(path.join(__dirname, "catalog.json"));
    const brand = catalog.find((m) => m.marca === marca);
    if (!brand) return res.status(404).json({ error: "Marca no encontrada" });

    brand.modelos.push({ nombre: modelo, fundas: [] });
    await writeJSON(path.join(__dirname, "catalog.json"), catalog);

    res.json({ success: true, catalog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Añadir funda a un modelo
app.post("/api/catalog/funda", async (req, res) => {
  const { marca, modelo, funda } = req.body;
  if (!marca || !modelo || !funda) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const catalog = await readJSON(path.join(__dirname, "catalog.json"));
    const brand = catalog.find((m) => m.marca === marca);
    if (!brand) return res.status(404).json({ error: "Marca no encontrada" });

    const model = brand.modelos.find((mod) => mod.nombre === modelo);
    if (!model) return res.status(404).json({ error: "Modelo no encontrado" });

    if (!model.fundas.includes(funda)) {
      model.fundas.push(funda);
      await writeJSON(path.join(__dirname, "catalog.json"), catalog);
    }

    res.json({ success: true, catalog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------
   🎨 DESIGNS (Estilos por funda)
------------------------- */

// Obtener diseños
app.get("/api/designs", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, "designs.json"), "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Error leyendo designs.json" });
  }
});

// Añadir estilo a un tipo de funda
app.post("/api/designs/estilo", async (req, res) => {
  const { marca, tipo, estilo } = req.body;
  if (!marca || !tipo || !estilo) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const designs = await readJSON(path.join(__dirname, "designs.json"));
    if (!designs[marca]) designs[marca] = {};
    if (!designs[marca][tipo]) designs[marca][tipo] = [];

    if (!designs[marca][tipo].includes(estilo)) {
      designs[marca][tipo].push(estilo);
      await writeJSON(path.join(__dirname, "designs.json"), designs);
    }

    res.json({ success: true, designs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar estilo de una funda
app.delete("/api/designs/estilo", async (req, res) => {
  const { marca, tipo, estilo } = req.body;
  if (!marca || !tipo || !estilo) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const designs = await readJSON(path.join(__dirname, "designs.json"));
    if (designs[marca] && designs[marca][tipo]) {
      designs[marca][tipo] = designs[marca][tipo].filter((e) => e !== estilo);
      await writeJSON(path.join(__dirname, "designs.json"), designs);
    }

    res.json({ success: true, designs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------
   🚀 Iniciar servidor
------------------------- */
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});