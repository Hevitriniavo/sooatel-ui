import { generateRandomNumbers } from "./generateRandomNumbers.js";
import { run } from "./run.js";

const menus = [
  { name: "Burger Deluxe", description: "Un burger juteux avec fromage, laitue et tomates", price: 12.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Pizza Margherita", description: "Pizza classique avec tomate, mozzarella et basilic", price: 9.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Plateau de Sushi", description: "Sushi variés avec poisson frais et légumes", price: 18.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Salade César au Poulet", description: "Poulet grillé avec sauce César et croûtons", price: 10.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Sauté de Légumes", description: "Légumes mélangés sautés dans de la sauce soja", price: 8.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Steak de Boeuf", description: "Steak de boeuf juteux servi avec purée de pommes de terre", price: 22.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Saumon Grillé", description: "Saumon grillé à la perfection avec sauce au beurre citronné", price: 16.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Pâtes Primavera", description: "Pâtes avec une variété de légumes frais", price: 12.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Canard Laqué", description: "Canard rôti avec une peau croustillante et une sauce savoureuse", price: 25.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Poulet Tikka Masala", description: "Curry de poulet épicé avec une sauce tomate crémeuse", price: 14.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Poisson et Frites", description: "Filets de poisson frits avec frites croustillantes", price: 11.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Samosa de Légumes", description: "Pâtisserie frite remplie de légumes épicés", price: 5.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Brochettes de Crevettes Grillées", description: "Brochettes de crevettes grillées à l'ail et aux herbes", price: 15.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Burritos au Boeuf", description: "Boeuf enveloppé dans une tortilla avec riz et haricots", price: 10.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Côtes de Porc", description: "Côtes de porc cuites lentement avec sauce barbecue", price: 20.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Wrap de Falafel", description: "Falafel croustillant enroulé dans du pain pita avec sauce tahini", price: 8.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Aubergine Parmesan", description: "Tranches d'aubergines panées cuites au four avec sauce marinara et fromage", price: 13.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Soupe Tom Yum", description: "Soupe thaï épicée avec crevettes, champignons et herbes", price: 9.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Kofta d'Agneau", description: "Boulettes d'agneau grillées avec sauce au yaourt", price: 17.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Risotto aux Champignons", description: "Risotto crémeux aux champignons sauvages et fromage parmesan", price: 14.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Schnitzel de Poulet", description: "Escalope de poulet panée et frite servie avec des pommes de terre", price: 12.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Pizza Végétarienne", description: "Pizza garnie de légumes variés", price: 10.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Crevettes Tempura", description: "Crevettes enrobées de pâte et frites servies avec sauce", price: 12.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Sauté de Tofu", description: "Tofu sauté avec légumes et sauce soja", price: 9.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Boeuf Wellington", description: "Filet de boeuf enroulé dans une pâte feuilletée et cuit à la perfection", price: 30.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Schnitzel de Porc", description: "Escalope de porc panée et frite servie avec un quartier de citron", price: 14.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Shawarma de Poulet", description: "Poulet grillé servi avec pita et houmous", price: 12.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Spaghetti Bolognese", description: "Pâtes classiques avec sauce bolognaise riche en viande", price: 13.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Poulet Sichuan", description: "Poulet épicé cuit avec des poivrons de Sichuan et de l'ail", price: 16.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Curry d'Agneau", description: "Agneau tendre cuit dans une sauce au curry parfumée", price: 17.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Légumes Grillés", description: "Légumes de saison grillés avec de l'huile d'olive et des herbes", price: 10.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Fajitas de Poulet", description: "Poulet grillé avec poivrons et oignons servi avec des tortillas", price: 13.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Paella de Fruits de Mer", description: "Plat espagnol de riz avec une variété de fruits de mer", price: 19.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Roll de Homard", description: "Homard frais mélangé avec de la mayo servi dans un pain grillé", price: 24.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Sandwich au Poulet Grillé", description: "Poulet grillé avec laitue et tomate dans un pain", price: 9.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Fondue au Fromage", description: "Fromage fondu servi avec des cubes de pain et des légumes", price: 16.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Tacos de Crevettes", description: "Tacos doux remplis de crevettes grillées et salsa fraîche", price: 12.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Sauté de Boeuf", description: "Boeuf tendre sauté avec des légumes et de la sauce soja", price: 15.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Soupe de Légumes", description: "Soupe de légumes copieuse avec une variété de légumes frais", price: 7.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Tourte au Poulet", description: "Poulet et légumes dans une sauce crémeuse, cuits dans une tourte", price: 11.49, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Wrap au Canard Laqué", description: "Canard laqué enveloppé dans des crêpes avec sauce hoisin", price: 18.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Mac and Cheese", description: "Macaroni avec fromage crémeux et sauce au cheddar", price: 8.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Pâté en Croûte", description: "Viande hachée dans une pâte feuilletée, cuite au four", price: 14.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" },
  { name: "Poulet à la Provençale", description: "Poulet rôti avec herbes de Provence et légumes", price: 15.99, categoryId: generateRandomNumbers(1, 20)[0], status: "AVAILABLE" }
];


console.log(menus.length);

run(
    menus.map(m => ({
    ...m,
    status: 'ACTIVE',
    price: Math.floor(m.price)  * 100
  }))
  , "/menus");
