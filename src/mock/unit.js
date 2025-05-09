import { run } from "./run.js";

const units = [
  { name: "Kilogramme", abbreviation: "kg" },
  { name: "Grammes", abbreviation: "g" },
  { name: "Litre", abbreviation: "L" },
  { name: "Millilitre", abbreviation: "mL" },
  { name: "Mètre", abbreviation: "m" },
  { name: "Centimètre", abbreviation: "cm" },
  { name: "Kilomètre", abbreviation: "km" },
  { name: "Mile", abbreviation: "mi" },
  { name: "Pound", abbreviation: "lb" },
  { name: "Ounce", abbreviation: "oz" }
];

run(units, '/units');
