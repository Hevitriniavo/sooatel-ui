import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiUrl, fetchJson } from "../../../services/api";
import ManageMenuIngredients from "./ManageMenuIngredients";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import dayjs from "dayjs";

function MenuWithIngredients() {
  const { menuId } = useParams();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState(null);

  const fetchMenuWithIngredients = async () => {
    try {
      const parsedMenuId = parseInt(menuId, 10);
      if (isNaN(parsedMenuId)) {
        throw new Error("ID de menu invalide.");
      }

      const url = apiUrl(`/menu-ingredients/menu/${parsedMenuId}`);
      const data = await fetchJson(url);


      if (!data) {
        throw new Error("Données du menu non disponibles");
      }

      setMenu(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du menu:", error.message);
      setError("Erreur lors de la récupération des données du menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuWithIngredients();
  }, [menuId]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!menu) {
    return <p>Aucun menu trouvé.</p>;
  }

  const handleDelete = async () => {
    try {
      await fetch(
        apiUrl(
          `/menu-ingredients/menu/${menuId}/ingredient/${ingredientToDelete.id}`
        ),
        {
          method: "DELETE",
        }
      );
      setShowDeleteModal(false);
      fetchMenuWithIngredients();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'ingrédient.", error);
    }
  };

  const confirmDelete = (ingredientId) => {
    const ingredient = menu.ingredients.find((m) => m.id === ingredientId);
    setIngredientToDelete(ingredient);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setIngredientToDelete(null);
  };

  const nonEmptyIngredients = menu.ingredients.filter(
    (obj) => Object.keys(obj).length > 0
  );

  return (
    <div className="container mx-auto p-4 bg-white darkBody">
      <div className="flex flex-row gap-5 items-center">
        <ManageMenuIngredients
          onAddIngredients={fetchMenuWithIngredients}
          ingredients={menu.ingredients}
        />
        <Link to="/menuList" className="text-blue-500 hover:underline">
          Rétour au menu
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">{menu.menuName}</h1>
      <p className="mb-4">Prix : {menu.menuPrice} Ar</p>
      <p className="mb-4">Statut : {menu.status}</p>
      <p className="mb-4">{menu.menuDesc}</p>

      <h2 className="text-xl font-bold mt-6">Ingrédients :</h2>
      <table className="min-w-full shadow-md rounded-lg overflow-hidden mt-4 z-40">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Nom de l&apos;ingrédient</th>
            <th className="py-2 px-4">Quantité</th>
            <th className="py-2 px-4">Unité</th>
            <th className="py-2 px-4">Créé le</th>
            <th className="py-2 px-4">Mis à jour le</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {nonEmptyIngredients.length === 0 ? (
            <tr className="hover:bg-gray-100 text-center border-y z-40">
              <td
                colSpan="6"
                className="py-4 text-gray-500"
              >
                <span className="flex flex-col justify-center items-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <span>Aucun ingrédient disponible pour ce menu.</span>
                </span>
              </td>
            </tr>
          ) : (
            nonEmptyIngredients.map((ingredient, i) => (
              <tr key={i} className="hover:bg-gray-100 text-center border-y z-40">
                <td className="py-2 px-4">{ingredient.ingredientName}</td>
                <td className="py-2 px-4">{ingredient.quantity}</td>
                <td className="py-2 px-4">{ingredient.unitName}</td>
                <td className="py-2 px-4">
                  {dayjs(ingredient.createdAt).format("YYYY-MM-DD HH:mm")}
                </td>
                <td className="py-2 px-4">
                  {dayjs(ingredient.updatedAt).format("YYYY-MM-DD HH:mm")}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                    onClick={() => confirmDelete(ingredient.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showDeleteModal && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="relative top-6 bg-white p-8 rounded-lg shadow-lg w-full max-w-md DeleteModal">
            <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
            <p>
              Voulez-vous vraiment supprimer l&apos;ingredient{" "}
              {ingredientToDelete?.ingredientName} ?
            </p>
            <div className="mt-4 flex justify-between">
            <button
                className="bg-gray-300 text-black rounded p-2 hover:bg-gray-400"
                onClick={cancelDelete}
              >
                Non
              </button>
              <button
                className="bg-red-500 text-white rounded p-2 hover:bg-red-600 mr-2"
                onClick={handleDelete}
              >
                Oui
              </button>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuWithIngredients;
