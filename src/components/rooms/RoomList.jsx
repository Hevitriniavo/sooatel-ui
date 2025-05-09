import { useEffect, useState } from "react";
import { apiUrl } from "../../services/api";
import { MdInfoOutline, MdDelete, MdEdit } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import CreateRoom from "./CreateRoom";
import EditRoom from "./EditRoom";
import TextField from "@mui/material/TextField";
import { convertStatusToRoom } from "../../services/convertStatus.js";
import UpdateStatusRoom from "../status/UpdateStatusRoom.jsx";
import useToast from "../menus/menu-orders/(tantely)/hooks/useToast.jsx";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [floors, setFloors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { showSuccess, showError } = useToast();

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const [roomsResponse, statusesResponse, floorsResponse] =
        await Promise.all([
          fetch(apiUrl("/rooms")),
          fetch(apiUrl("/rooms/status")),
          fetch(apiUrl("/floors")),
        ]);

      if (!roomsResponse.ok || !statusesResponse.ok || !floorsResponse.ok) {
        throw new Error("Erreur lors de la récupération des données.");
      }

      setRooms(await roomsResponse.json());
      setStatuses(await statusesResponse.json());
      setFloors(await floorsResponse.json());
    } catch (err) {
      setError(err.message);
      showError("Erreur lors du chargement des données.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRooms();
  }, []);

  const toggleModal = (type, room = null) => {
    setModalType(type);
    setSelectedRoom(room);
    setIsModalOpen(!isModalOpen);
  };

  const handleCreateRoom = (newRoom) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
    toggleModal("");
  };

  const handleUpdateStatus = async () => {
    try {
      const url = apiUrl(`/rooms/${selectedRoom.id}/status`);
      await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(status),
      });
      toggleModal("");
      showSuccess("Statut mis à jour avec succès.");
      void fetchRooms();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de la salle:",
        error
      );
      showError("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleUpdateRoom = async () => {
    try {
      const url = apiUrl(`/rooms/${selectedRoom.id}`);
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedRoom),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      toggleModal("");
      void fetchRooms();
      showSuccess("Salle mise à jour avec succès.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la chambre:", error);
      showError("Erreur lors de la mise à jour de la salle.");
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(apiUrl(`/rooms/${selectedRoom.id}`), { method: "DELETE" });
      toggleModal("");
      void fetchRooms();
      showSuccess("Salle supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du rooms:", error);
      showError("Erreur lors de la suppression de la salle.");
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (searchTerm) {
      return room.roomNumber === parseInt(searchTerm, 10);
    }
    return true;
  });

  return (
    <div className="container mx-auto p-4 bg-white darkBody pr-14 sm:pr-12 md:pr-10 lg:pr-8">
      <div className="flex flex-row gap-4 pt-4 w-full fixed bg-white z-50 darkBody sm:gap-2 md:gap-3 lg:gap-4">
        <h2 className="text-2xl font-bold mb-4">Liste des chambres</h2>
        <button
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2"
          onClick={() => toggleModal("create")}
        >
          Créer chambre
        </button>
        <TextField
          id="outlined-search"
          label="Rechercher un chambre"
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

      {isLoading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <table
          className="min-w-full bg-white shadow-md rounded-lg overflow-hidden darkBody 
                relative top-[90px] sm:top-[100px] md:top-[120px] lg:top-[150px]"
        >
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Numéro de Salle</th>
              <th className="py-2 px-4">Capacité (en personnes)</th>
              <th className="py-2 px-4 hidden sm:table-cell">Prix (en Ar)</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRooms.length > 0 ? (
              filteredRooms
                .toSorted((a, b) => a.id - b.id)
                .map((room) => (
                  <tr
                    key={room.id}
                    className="hover:bg-gray-100 text-center border-y border-collapse sm:border-x md:text-left lg:border-t xl:text-right"
                  >
                    <td className="p-2">{room.roomNumber}</td>
                    <td className="p-2 ">{room.capacity}</td>
                    <td className="p-2 ">{room.price}</td>
                    <td
                      className={`p-2 cursor-pointer ${
                        room.status.toLowerCase() !== "available"
                          ? "text-red-500 font-bold"
                          : ""
                      }`}
                    >
                      <button
                        onClick={() => toggleModal("editStatus", room)}
                        className="w-full flex flex-row gap-1 items-center"
                      >
                        <span className="flex flex-row gap-1 items-center ">
                          {room.status.toLowerCase() !== "available" && (
                            <span className="text-red-500 text-[10px]">⚠️</span>
                          )}
                          <MdEdit />{" "}
                          {convertStatusToRoom(room.status.toLowerCase())}
                        </span>
                      </button>
                    </td>
                    <td className="p-2 flex justify-center items-center">
                      <button
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                        onClick={() => toggleModal("editRoom", room)}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                        onClick={() => toggleModal("delete", room)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr className="hover:bg-gray-100 text-center border-y">
                <td colSpan="8" className="py-4 text-gray-500  ">
                  <p className="flex flex-col items-center justify-center w-full">
                    <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                    <span>Aucun salle trouvé</span>
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {isModalOpen && modalType === "create" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg EditModal w-full sm:w-2/3 md:w-1/2 lg:w-1/3 py-2">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8">
                Ajouter le numéro du chambre
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-2  text-center text-[30px] hover:text-white cursor-pointer"
                onClick={() => toggleModal("")}
              >
                x
              </span>
            </div>
            <CreateRoom
              onCreate={handleCreateRoom}
              closeModal={() => toggleModal("")}
              statuses={statuses}
              floors={floors}
            />
          </div>
        </div>
      )}
      {isModalOpen && modalType === "editStatus" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-sm EditModal w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le statue</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => toggleModal("")}
              >
                x
              </span>
            </div>
            <UpdateStatusRoom
              onSave={handleUpdateStatus}
              onCancel={() => toggleModal("")}
              statuses={statuses}
              setStatus={setStatus}
              status={status}
            />
          </div>
        </div>
      )}
      {isModalOpen && modalType === "editRoom" && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-1/2 max-w-md EditModal">
            <span
              className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                        relative left-[408px] text-[30px] hover:text-white cursor-pointer"
              onClick={() => toggleModal("")}
            >
              x
            </span>
            <EditRoom
              roomToEdit={selectedRoom}
              setRoomToEdit={setSelectedRoom}
              onSave={handleUpdateRoom}
              onCancel={() => toggleModal("")}
              floors={floors}
            />
          </div>
        </div>
      )}
      {isModalOpen && modalType === "delete" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl EditModal">
            <p>
              Êtes-vous sûr de vouloir supprimer cette salle n°
              {selectedRoom?.roomNumber} ?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-300 text-gray-700 rounded px-4 py-2 ml-2"
                onClick={() => toggleModal("")}
              >
                Non
              </button>
              <button
                className="bg-blue-500 text-white rounded px-4 py-2"
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

export default RoomList;
