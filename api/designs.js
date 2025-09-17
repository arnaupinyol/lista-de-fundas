import fs from "fs/promises";
import path from "path";

const designsPath = path.join(process.cwd(), "data", "designs.json");

async function readDesigns() {
  const data = await fs.readFile(designsPath, "utf-8");
  return JSON.parse(data);
}

async function writeDesigns(data) {
  await fs.writeFile(designsPath, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const designs = await readDesigns();
    return res.status(200).json(designs);
  }

  if (req.method === "POST") {
    const { marca, tipo, estilo } = req.body;
    let designs = await readDesigns();

    if (!designs[marca]) designs[marca] = {};
    if (!designs[marca][tipo]) designs[marca][tipo] = [];

    if (!designs[marca][tipo].includes(estilo)) {
      designs[marca][tipo].push(estilo);
    }

    await writeDesigns(designs);
    return res.status(200).json(designs);
  }

  if (req.method === "DELETE") {
    const { marca, tipo, estilo } = req.body;
    let designs = await readDesigns();

    if (designs[marca]?.[tipo]) {
      designs[marca][tipo] = designs[marca][tipo].filter((e) => e !== estilo);
    }

    await writeDesigns(designs);
    return res.status(200).json(designs);
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).end(`Método ${req.method} no permitido`);
}
