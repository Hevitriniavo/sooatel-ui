import { useCallback, useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import CreateIngredient from "./CreateIngredient";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import useFetch from "../../hooks/useFetch";
import EditIngredients from "./EditIngredients";
import dayjs from "dayjs";
import useToast from "../menus/menu-orders/(tantely)/hooks/useToast.jsx";
import TextField from "@mui/material/TextField";

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [ingredientName, setIngredientName] = useState(null);
  const [unitId, setUnitId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showSuccess, showError } = useToast();

  const { data: units } = useFetch(() => apiUrl("/units/all"));
  const [searchTerm, setSearchTerm] = useState("");

  const fetchIngredients = async () => {
    try {
      const data = await fetchJson(apiUrl("/ingredients/all"));
      setIngredients(data);
    } catch {
      showError("Erreur lors de la récupération des ingrédients");
      setError("Erreur lors de la récupération des ingrédients");
    }
  };

  useEffect(() => {
    void fetchIngredients();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalOpen = useCallback((data) => {
    setIsModalOpen(data);
    void fetchIngredients();
  }, []);

  const handleDelete = async () => {
    try {
      await fetch(apiUrl(`/ingredients/${ingredientToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      showSuccess("Ingrédient supprimé avec succès");
      void fetchIngredients();
    } catch (error) {
      showError("Erreur lors de la suppression de l'ingrédient");
      console.error("Erreur lors de la suppression de l'ingredients:", error);
    }
  };

  const confirmDelete = (ingredientId) => {
    const ingredient = ingredients.find((i) => i.id === ingredientId);
    setIngredientToDelete(ingredient);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setIngredientToDelete(null);
  };

  const handleEdit = (ingredient) => {
    setSelectedIngredient(ingredient.id);
    setIngredientName(ingredient.name);
    setUnitId(ingredient.unitId);
    setShowEditModal(true);
  };

  const handleUpdateIngredient = async () => {
    if (!ingredientName || !unitId) {
      const errorMessage = "Veuillez fournir un nom et sélectionner une unité";
      showError(errorMessage);
      setError(errorMessage);
      return;
    }

    try {
      await fetchJson(apiUrl(`/ingredients`), "PUT", {
        id: selectedIngredient,
        name: ingredientName,
        unitId: unitId,
      });
      setShowEditModal(false);
      setSelectedIngredient(null);
      void fetchIngredients();
      showSuccess("Ingrédient mis à jour avec succès");
    } catch {
      const errorMessage = "Erreur lors de la mise à jour de l'ingrédient";
      showError(errorMessage);
      setError(errorMessage);
    }
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="darkBody container mx-auto pl-4 pr-12 bg-white sm:pl-6 
    sm:pr-8 md:pl-8 md:pr-10 lg:pl-10 lg:pr-12">
      <div className="flex flex-row gap-4 pt-4 w-full fixed bg-white z-50 darkBody sm:pt-5 md:pt-6 lg:pt-8">
      <h1 className="text-2xl font-bold mb-4">Liste des Ingrédients</h1>
      {error && <p className="text-red-500">{error}</p>}
        <button
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2"
          onClick={toggleModal}
        >
          Créer un ingrédient
        </button>
        <TextField
          id="outlined-search"
          label="Rechercher un ingrédient"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: searchTerm && (
              <button
                type="button"
                className="flex items-center"
                onClick={() => setSearchTerm("")}
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
              ></button>
            ),
          }}
          sx={{
            width: "250px",
            height: "50px",
            ".MuiInputBase-root": { height: "40px" },
          }}
        />
      </div>

      {isModalOpen && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center ">
          <div  className="CreateModal bg-white rounded-lg shadow-lg w-full 
          max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">
                Ajouter un nouvel ingrédient
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={toggleModal}
              >
                x
              </span>
            </div>
            <CreateIngredient
              onModalOpen={handleModalOpen}
              onToggle={toggleModal}
            />
          </div>
        </div>
      )}

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden darkBody 
      relative top-[90px] sm:top-[80px] md:top-[90px] lg:top-[100px]">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Nom</th>
            <th className="py-2 px-4">Créé le</th>
            <th className="py-2 px-4">Modifié le</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredIngredients.length === 0 ? (
            <tr className="text-center">
              <td colSpan="5" className="py-4 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <p>Aucun ingrédient disponible</p>
                </div>
              </td>
            </tr>
          ) : (
            filteredIngredients
              .slice()
              .sort((a, b) => b.id - a.id)
              .map((ingredient) => (
                <tr
                  key={ingredient.id}
                  className="hover:bg-gray-100 text-center border-y"
                >
                  <td className="py-2 px-4">{ingredient.name}</td>
                  <td className="py-3 px-4">
                    {dayjs(ingredient.createdAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-3 px-4">
                    {dayjs(ingredient.updatedAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-2 px-4 flex flex-row gap-2 justify-center">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                      onClick={() => handleEdit(ingredient)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
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
          <div className="bg-white p-8 rounded-lg shadow-lg DeleteModal sm:p-6 md:p-8 lg:p-10">
            <p>
              Êtes-vous sûr de vouloir supprimer l&apos;ingrédient{" "}
              {ingredientToDelete?.name} ?
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={cancelDelete}
              >
                Non
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                onClick={handleDelete}
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg EditModal sm:w-full 
          md:w-[400px] lg:w-[500px] xl:w-[600px] sm:p-4 md:p-6 lg:p-8">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier l&apos;ingrédient</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditModal(false)}
              >
                x
              </span>
            </div>
            <EditIngredients
              ingredientName={ingredientName}
              setIngredientName={setIngredientName}
              unitId={unitId}
              setUnitId={setUnitId}
              units={units}
              onSave={handleUpdateIngredient}
              onCancel={() => setShowEditModal(false)}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientList;
