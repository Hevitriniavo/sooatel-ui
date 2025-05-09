import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api.js";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import dayjs from "dayjs";
import useToast from "../menus/menu-orders/(tantely)/hooks/useToast.jsx";
import TextField from "@mui/material/TextField";
import CreateCategorieIngredient from "./CreateCategorieIngredient.jsx";
import UpdateCategorieIngredient from "./UpdateCategorieIngredient.jsx";

const CategoriesIngredientList = () => {
  const [ingredientGroups, setIngredientGroups] = useState([]);
  const [error] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    void fetchIngredientGroup();
  }, []);

  const fetchIngredientGroup = async () => {
    try {
      const data = await fetchJson(apiUrl("/ingredients/groups"));
      setIngredientGroups(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des ingredients groups:",
        error
      );
      showError("Impossible de charger les ingredients groups");
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCategoryCreated = () => {
    void fetchIngredientGroup();
    setIsModalOpen(false);
    showSuccess("Catégorie créée avec succès");
  };

  const handleDelete = async () => {
    try {
      await fetch(apiUrl(`/ingredients/groups/${categoryToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      void fetchIngredientGroup();
      showSuccess("Catégorie supprimée avec succès");
    } catch (error) {
      showError("Erreur lors de la suppression de la catégorie");
      console.error("Erreur lors de la suppression de la catégorie", error);
    }
  };

  const confirmDelete = (categorieId) => {
    const category = ingredientGroups.find((c) => c.id === categorieId);
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category || {});
    setShowEditCategoryModal(true);
  };

  const handleSaveEdit = async () => {
    if (!categoryToEdit || !categoryToEdit.id || !categoryToEdit.name) {
      console.error("Les informations de la catégorie sont incomplètes.");
      showError("Les informations de la catégorie sont incomplètes.");
      return;
    }

    try {
      await fetchJson(apiUrl(`/ingredients/groups/${categoryToEdit.id}`), "PUT", {
        name: categoryToEdit.name,
      });
      setShowEditCategoryModal(false);
      void fetchIngredientGroup();
      showSuccess("Catégorie mise à jour avec succès");
    } catch (error) {
      showError("Erreur lors de la mise à jour de la catégorie");
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
    }
  };

  return (
    <div className="container mx-auto pr-14 pl-6 bg-white darkBody sm:px-8 md:px-12 lg:px-16">
      <div className="flex flex-row gap-4 pt-4 w-full fixed bg-white z-50 darkBody sm:pt-6 md:pt-8 lg:pt-10">
        <h1 className="text-2xl font-bold mb-4">
          Liste des catégories ingredient
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={toggleModal}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Créer une catégorie ingredient
        </button>
        <TextField
          id="outlined-search"
          label="Rechercher une catégorie"
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
        <div className="fixed inset-0 flex items-center justify-center 
        z-50 bg-black bg-opacity-50 sm:bg-opacity-60 md:bg-opacity-70">
          <div className="CreateModal bg-white rounded-md shadow-md z-[9999]">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">
                Créer une nouvelle catégorie
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={toggleModal}
              >
                x
              </span>
            </div>
            <CreateCategorieIngredient
              onClose={toggleModal}
              onCategoryCreated={handleCategoryCreated}
            />
          </div>
        </div>
      )}

      <table
        className="min-w-full bg-white shadow-md rounded-lg overflow-hidden darkBody relative 
        top-[140px] sm:top-[110px] md:top-[90px] lg:top-[100px] px-4 sm:px-6 md:px-8">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Nom</th>
            <th className="py-2 px-4">Créé le</th>
            <th className="py-2 px-4">Modifié le</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredientGroups.length > 0 ? (
            ingredientGroups
              .filter((category) =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .toSorted((a, b) => b.id - a.id)
              .map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-100 text-center border-y border-collapse"
                >
                  <td className="py-3 px-4 ">{category.name}</td>
                  <td className="py-3 px-4">
                    {dayjs(category.createdAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-3 px-4">
                    {dayjs(category.updatedAt).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mr-2"
                      onClick={() => handleEditCategory(category)}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                      onClick={() => confirmDelete(category.id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center  w-full ">
                <div className="flex w-full justify-center items-center flex-col">
                  <MdInfoOutline className="text-4xl inline-block mb-2 text-gray-400" />
                  <span>Aucune catégorie trouvée</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center max-w-[500px] DeleteModal">
            <div>
              <p className="mb-6">
                Êtes-vous sûr de vouloir supprimer le catégorie{" "}
                {categoryToDelete?.name} ?
              </p>
              <div className="flex justify-between">
                <button
                  className="bg-red-300 text-gray-800 px-4 py-2 rounded hover:bg-red-400"
                  onClick={cancelDelete}
                >
                  Non
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleDelete}
                >
                  Oui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:px-4 md:px-6 lg:px-8">
          <div className="EditModal bg-white rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center max-w-[600px]">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier la catégorie</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditCategoryModal(false)}
              >
                x
              </span>
            </div>
            <UpdateCategorieIngredient
              category={categoryToEdit}
              setCategoryToEdit={setCategoryToEdit}
              categoryToEdit={categoryToEdit}
              onSave={handleSaveEdit}
              onCancel={() => setShowEditCategoryModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesIngredientList;
