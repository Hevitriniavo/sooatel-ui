import { run } from "./run.js";

const ingredientsGroups = [
  { name: "Légumes" },
  { name: "Fruits" },
  { name: "Viandes" },
  { name: "Fruits de mer" },
  { name: "Produits laitiers" },
  { name: "Céréales & Grains" },
  { name: "Légumineuses" },
  { name: "Herbes & Épices" },
  { name: "Huiles & Graisses" },
  { name: "Noix & Graines" },
  { name: "Boissons" },
  { name: "Condiments & Sauces" },
  { name: "Produits de boulangerie" },
  { name: "Pâtes & Nouilles" },
  { name: "Fromages" },
  { name: "Conserves & Pickles" },
  { name: "Desserts & Sucreries" },
  { name: "Aliments congelés" },
  { name: "Boissons alcoolisées" },
  { name: "Divers" }
];


run(ingredientsGroups, '/ingredients/groups');
