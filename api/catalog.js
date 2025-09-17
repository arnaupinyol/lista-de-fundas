import fs from "fs/promises";
import path from "path";

const catalogPath = path.join(process.cwd(), "data", "catalog.json");

async function readCatalog() {
  const data = await fs.readFile(catalogPath, "utf-8");
  return JSON.parse(data);
}

async function writeCatalog(data) {
  await fs.writeFile(catalogPath, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const catalog = await readCatalog();
    return res.status(200).json(catalog);
  }

  if (req.method === "POST") {
    const { action, marca, modelo, funda } = req.body;
    let catalog = await readCatalog();

    if (action === "addMarca") {
      catalog.push({ marca, modelos: [] });
    }
    if (action === "addModelo") {
      const brand = catalog.find((m) => m.marca === marca);
      if (brand) brand.modelos.push({ nombre: modelo, fundas: [] });
    }
    if (action === "addFunda") {
      const brand = catalog.find((m) => m.marca === marca);
      const model = brand?.modelos.find((m) => m.nombre === modelo);
      if (model && !model.fundas.includes(funda)) model.fundas.push(funda);
    }

    await writeCatalog(catalog);
    return res.status(200).json(catalog);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Método ${req.method} no permitido`);
}
