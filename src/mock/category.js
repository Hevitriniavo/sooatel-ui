import { run } from "./run.js";

const categories = [
  { name: "Fast Food" },
  { name: "Cuisine Française" },
  { name: "Cuisine Italienne" },
  { name: "Cuisine Chinoise" },
  { name: "Cuisine Indienne" },
  { name: "Cuisine Mexicaine" },
  { name: "Steakhouse" },
  { name: "Végétarien" },
  { name: "Vegan" },
  { name: "Fruits de mer" },
  { name: "Grillades" },
  { name: "Pizzeria" },
  { name: "Sushi" },
  { name: "Bistro" },
  { name: "Burgers" },
  { name: "Café" },
  { name: "Bar à Salades" },
  { name: "Crêperie" },
  { name: "Brasserie" },
  { name: "Traiteur" }
];

run(categories, '/categories');
