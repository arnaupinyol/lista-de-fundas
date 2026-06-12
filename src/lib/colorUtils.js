const COLOR_NAME_MAP = {
  "amarillo pastel": "#f7e27e",
  azul: "#0074d9",
  "azul cielo": "#6ddcde",
  "azul oscuro": "#1f3a68",
  blanco: "#ffffff",
  "blanco transparente": "#ffffff80",
  dorado: "#d4af37",
  fucsia: "#e6007e",
  "gris claro": "#cccccc",
  "gris verdoso": "#7f8f84",
  lavanda: "#bfa7f2",
  "lila claro": "#da9bfa",
  morado: "#7d3c98",
  "naranja rojizo": "#f05a28",
  negro: "#050505",
  plata: "#c0c0c0",
  rojo: "#f52900",
  rosa: "#f5a6c8",
  "rosa claro": "#f8c8dc",
  "rosa pastel": "#ffd1dc",
  turquesa: "#3ccfd0",
  verde: "#3c8d40",
  "verde claro": "#9be28f",
  "verde oscuro": "#3c593e",
};

const CSS_COLOR_MAP = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  blue: "#0074d9",
  green: "#008000",
  pink: "#ffc0cb",
  purple: "#800080",
  gold: "#d4af37",
  silver: "#c0c0c0",
  gray: "#808080",
  transparent: "#ffffff00",
};

export const getColorValue = (color) => {
  if (!color) return "#ffffff";

  const value = String(color).trim();
  const normalized = value.toLowerCase();

  if (value.startsWith("#")) return value;
  if (COLOR_NAME_MAP[normalized]) return COLOR_NAME_MAP[normalized];
  if (CSS_COLOR_MAP[normalized]) return CSS_COLOR_MAP[normalized];

  return "#d7dce0";
};

export const getColorRgb = (color) => {
  const value = getColorValue(color).trim();

  if (!value.startsWith("#")) return null;

  let hex = value.slice(1);
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  if (hex.length < 6) return null;

  const rgbHex = hex.slice(0, 6);
  const r = parseInt(rgbHex.slice(0, 2), 16);
  const g = parseInt(rgbHex.slice(2, 4), 16);
  const b = parseInt(rgbHex.slice(4, 6), 16);

  if ([r, g, b].some(Number.isNaN)) return null;

  return { r, g, b };
};

export const isDarkColor = (color) => {
  const rgb = getColorRgb(color);
  if (!rgb) return false;

  const lum = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
  return lum < 80;
};
