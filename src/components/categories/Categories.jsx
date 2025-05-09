import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import CreateCategories from "./CreateCategories";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import EditModal from "./EditModal";
import dayjs from "dayjs";
import useToast from "../menus/menu-orders/(tantely)/hooks/useToast.jsx";
import TextField from "@mui/material/TextField";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [error] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    void fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await fetchJson(apiUrl("/categories/all"));
      setCategories(data);
    } catch (error) {
      showError(
        "Erreur lors de la récupération des categories: " + error.message
      );
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCategoryCreated = () => {
    void fetchCategories();
    setIsModalOpen(false);
    showSuccess("Catégorie créée avec succès");
  };

  const handleDelete = async () => {
    try {
      await fetch(apiUrl(`/categories/${categoryToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      void fetchCategories();
      showSuccess("Catégorie supprimée avec succès");
    } catch (error) {
      showError("Erreur lors de la suppression de la catégorie");
      console.error("Erreur lors de la suppression de la catégorie", error);
    }
  };

  const confirmDelete = (categorieId) => {
    const category = categories.find((c) => c.id === categorieId);
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
      const url = apiUrl(`/categories`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryToEdit),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la mise à jour de la catégorie: ${response.statusText}`
        );
      }

      setShowEditCategoryModal(false);
      void fetchCategories();
      showSuccess("Catégorie mise à jour avec succès");
    } catch (error) {
      showError("Erreur lors de la mise à jour de la catégorie");
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-14 bg-white darkBody">
      <div className="flex flex-row gap-4 pt-4 w-full fixed bg-white z-50 darkBody sm:px-6 lg:px-12">
        <h1 className="text-2xl font-bold mb-4">Liste des catégories</h1>
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={toggleModal}
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Créer une catégorie
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
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
            <CreateCategories
              onClose={toggleModal}
              onCategoryCreated={handleCategoryCreated}
            />
          </div>
        </div>
      )}

      <table
       className="min-w-full bg-white shadow-md rounded-lg 
       overflow-hidden darkBody relative top-[100px] sm:top-[105px] md:top-[60px] lg:top-[70px]"
      >
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Nom</th>
            <th className="py-2 px-4">Créé le</th>
            <th className="py-2 px-4">Modifié le</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 ? (
            categories
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center DeleteModal">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="EditModal bg-white rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center">
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
            <EditModal
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

export default CategoriesList;
