import { generateRandomNumbers } from "./generateRandomNumbers.js";
import { run } from "./run.js";
const groups = generateRandomNumbers(1, 20)
const ingredients = [
  { name: "Farine", unitId: 2 },
  { name: "Sucre", unitId: 2 },
  { name: "Sel", unitId: 3 },
  { name: "Poivre", unitId: 4 },
  { name: "Beurre", unitId: 5 },
  { name: "Lait", unitId: 6 },
  { name: "Oeufs", unitId: 7 },
  { name: "Tomates", unitId: 8 },
  { name: "Ail", unitId: 9 },
  { name: "Ciboulette", unitId: 10 },
  { name: "Basilic", unitId: 10 },
  { name: "Carottes", unitId: 10 },
  { name: "Pommes de Terre", unitId: 10 },
  { name: "Céleri", unitId: 10 },
  { name: "Courgettes", unitId: 10 },
  { name: "Poivrons", unitId: 10 },
  { name: "Aubergines", unitId: 10 },
  { name: "Laitue", unitId: 4 },
  { name: "Concombres", unitId: 5 },
  { name: "Radis", unitId: 2 },
  { name: "Brocolis", unitId: 3 },
  { name: "Épinards", unitId: 3 },
  { name: "Moutarde", unitId: 10 },
  { name: "Sauce Tomate", unitId: 10 },
  { name: "Vinaigre", unitId: 10 },
  { name: "Huile d'olive", unitId: 10 },
  { name: "Riz", unitId: 10 },
  { name: "Pâtes", unitId: 10 },
  { name: "Couscous", unitId: 10 },
  { name: "Quinoa", unitId: 2 }
];

console.log(ingredients.length);

run(ingredients.map((i, index) => ({
  ...i,
  groupId: groups[index % groups.length]  
})), "/ingredients")
