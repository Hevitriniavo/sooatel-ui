import React, { useEffect, useState } from "react";
import CreateMenu from "./CreateMenu";
import { apiUrl } from "../../services/api";
import { MdDelete, MdInfoOutline, MdEdit, MdMoreVert } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import EditMenu from "./EditMenu";
import { useNavigate } from "react-router-dom";
import { truncate } from "../../services/truncate.js";
import { convertStatusMenu } from "../../services/convertStatus.js";
import UpdateStatusMenu from "../status/UpdateStatusMenu.jsx";
import useToast from "./menu-orders/(tantely)/hooks/useToast.jsx";
import TextField from "@mui/material/TextField";

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [status, setStatus] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const [menuToEdit, setMenuToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState({});
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const [menusResponse, categoriesResponse, statusesResponse] =
        await Promise.all([
          fetch(apiUrl(`/menus/all`)),
          fetch(apiUrl("/categories/all")),
          fetch(apiUrl("/menus/status")),
        ]);

      if (!menusResponse.ok || !categoriesResponse.ok || !statusesResponse.ok) {
        throw new Error(
          "Erreur lors de la récupération des menus, catégories ou statuts"
        );
      }

      const menusData = await menusResponse.json();
      const categoriesData = await categoriesResponse.json();
      const statusesData = await statusesResponse.json();

      setMenus(menusData);
      setCategories(categoriesData);
      setStatuses(statusesData);
    } catch (err) {
      setError(err.message);
      showError("Erreur lors de la récupération des données.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMenus();
  }, []);

  const handleEditStatus = (menu) => {
    setSelectedMenuId(menu.id);
    setStatus(menu.status);
    setShowEditModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      const url = apiUrl(
        `/menus/${selectedMenuId}/status?status=${encodeURIComponent(status)}`
      );
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setShowEditModal(false);
      setSelectedMenuId(null);
      void fetchMenus();
      showSuccess("Statut mis à jour avec succès.");
    } catch {
      showError("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleEditMenu = (menu) => {
    setMenuToEdit(menu || {});
    setShowEditMenuModal(true);
  };

  const handleUpdateMenu = async () => {
    if (
      !menuToEdit ||
      !menuToEdit.name ||
      !menuToEdit.price ||
      !menuToEdit.categoryId
    ) {
      showError("Les informations du menu sont incomplètes.");
      return;
    }

    try {
      const url = apiUrl("/menus");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuToEdit),
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la mise à jour du menu: ${response.statusText}`
        );
      }

      setShowEditMenuModal(false);
      showSuccess("Menu mis à jour avec succès.");
      void fetchMenus();
    } catch {
      showError("Erreur lors de la mise à jour du menu.");
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(apiUrl(`/menus/${menuToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      void fetchMenus();
      showSuccess("Menu supprimé avec succès.");
    } catch {
      showError("Erreur lors de la suppression du menu.");
    }
  };

  const confirmDelete = (menuId) => {
    const menu = menus.find((m) => m.id === menuId);
    setMenuToDelete(menu);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMenuToDelete(null);
  };

  const filteredMenus = menus.filter((menu) =>
    menu.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menusByCategory = categories.reduce((acc, category) => {
    acc[category.id] = {
      categoryName: category.name,
      menus: filteredMenus
        .filter((menu) => menu.categoryId === category.id)
        .toSorted((a, b) => b.id - a.id),
    };
    return acc;
  }, {});

  const handleClickRow = (menuId) => {
    navigate(`/menu-ingredients/menu/${menuId}`);
  };

  const toggleDetails = (menuId) => {
    setDetailsVisible((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  return (
    <div className="container bg-white darkBody mx-auto pl-4 sm:pl-6 md:pl-8 lg:pl-10 h-auto">
      <div className="flex flex-row gap-2 sm:gap-4 pt-4 w-full fixed bg-white z-50 darkBody">
        <h1 className="text-2xl font-bold mb-4">Liste des Menus</h1>
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2"
          onClick={toggleModal}
        >
          Créer un menu
        </button>
        <TextField
          id="outlined-search"
          label="Rechercher un menu"
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
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="CreateModal bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">
                Créer une nouvelle menu
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                         relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={toggleModal}
              >
                x
              </span>
            </div>
            <CreateMenu
              onCreate={(menu) => {
                setMenus((prev) => [...prev, menu]);
                toggleModal();
              }}
              createMenuModal={toggleModal}
              categories={categories}
              statuses={statuses}
            />
          </div>
        </div>
      )}

      <table
        className="min-w-full darkBody shadow-md rounded-lg relative top-[100px] sm:top-[80px] md:top-[60px] lg:top-[70px] bg-white"
      >
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Nom</th>
            <th className="py-2 px-4">Prix</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Statut</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="9" className="text-center py-2">
                Chargement...
              </td>
            </tr>
          ) : menus.length === 0 ? (
            <tr className="text-center">
              <td colSpan="6" className="py-4 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <p>Aucune menus disponible</p>
                </div>
              </td>
            </tr>
          ) : (
            Object.entries(menusByCategory).map(
              ([, { categoryName, menus }]) =>
                menus.length > 0 && (
                  <React.Fragment key={categoryName}>
                    <tr className="text-center">
                      <td colSpan="9" className="font-bold text-lg pt-10">
                        {categoryName}
                      </td>
                    </tr>

                    {menus.map((menu) => (
                      <tr
                        key={menu.id}
                        className="hover:bg-gray-100 text-center border-y"
                      >
                        <td className="py-2 px-4">{menu.name}</td>
                        <td className="py-2 px-4">{menu.price}</td>
                        <td className="py-2 px-4">
                          {truncate(menu.description, 20)}
                        </td>
                        <td
                          className={`py-2 px-4 cursor-pointer ${
                            menu.status.toLowerCase() !== "active"
                              ? "text-red-500 font-bold"
                              : ""
                          }`}
                        >
                          <button
                            onClick={() => handleEditStatus(menu)}
                            className="w-full flex flex-row gap-1 items-center justify-center"
                          >
                            <span className="flex text-sm flex-row gap-1 items-center ">
                              <MdEdit />{" "}
                              {menu.status.toLowerCase() !== "active" && (
                                <span className="text-red-500 text-[10px]">
                                  ⚠️
                                </span>
                              )}
                              {convertStatusMenu(menu.status.toLowerCase())}
                            </span>
                          </button>
                        </td>
                        <td className="py-2 px-4 flex flex-row justify-center gap-2">
                          <button
                            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                            onClick={() => handleEditMenu(menu)}
                          >
                            <FaRegEdit />
                          </button>
                          <button
                            className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                            onClick={() => confirmDelete(menu.id)}
                          >
                            <MdDelete />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => toggleDetails(menu.id)}
                              className="detail focus:outline-none rounded p-2 bg-gray-200 z-40"
                            >
                              <MdMoreVert />
                            </button>
                            {detailsVisible[menu.id] && (
                              <div className="absolute text-start right-[1px] bottom-9 w-72 bg-gray-300 shadow-md rounded-md z-50">
                                <button
                                  onClick={() => handleClickRow(menu.id)}
                                  className="detail block text-start px-4 py-2 hover:bg-gray-100 w-full border-y border-white"
                                >
                                  Voir détail
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
            )
          )}
        </tbody>
      </table>

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-sm EditModal">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le statut</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditModal(false)}
              >
                x
              </span>
            </div>
            <UpdateStatusMenu
              onSave={handleUpdateStatus}
              onCancel={() => setShowEditModal(false)}
              statuses={statuses}
              setStatus={setStatus}
              status={status}
            />
          </div>
        </div>
      )}

      {showEditMenuModal && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="relative top-6 bg-white rounded-lg shadow-lg w-full max-w-md EditModal">
            <span
              className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                        relative left-[408px] text-[30px] hover:text-white cursor-pointer"
              onClick={() => setShowEditMenuModal(false)}
            >
              x
            </span>
            <EditMenu
              menuToEdit={menuToEdit}
              setMenuToEdit={setMenuToEdit}
              categories={categories}
              onSave={handleUpdateMenu}
              onCancel={() => setShowEditMenuModal(false)}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div
            className="relative top-6 bg-white p-8 rounded-lg shadow-lg
                    w-full max-w-md DeleteModal"
          >
            <p>Voulez-vous vraiment supprimer le menu {menuToDelete?.name} ?</p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-300 text-black rounded p-2 hover:bg-red-400"
                onClick={cancelDelete}
              >
                Non
              </button>
              <button
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mr-2"
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
};

export default MenuList;
