import { useEffect, useState } from "react";
import { apiUrl } from "../../services/api";
import CreateReservation from "../../components/reservations/CreateReservation";
import { MdInfoOutline, MdDelete, MdEdit } from "react-icons/md";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";
import { convertStatusToReservation } from "../../services/convertStatus";
import UpdateStatusReservation from "../../components/status/UpdateStatusReservation";
import { truncate } from "../../services/truncate.js";
import formatDate from "../../services/formatDate.js";

function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tables, setTables] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const { showSuccess, showError } = useToast();
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalType, setModalType] = useState("");

  const toggleModal = (type, reservation = null) => {
    setModalType(type);
    setSelectedReservation(reservation);
    setIsModalOpen(!isModalOpen);
  };

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const [
        reservationsResponse,
        roomsResponse,
        customersResponse,
        statusesResponse,
        tablesResponse,
      ] = await Promise.all([
        fetch(apiUrl(`/reservations`)),
        fetch(apiUrl("/rooms")),
        fetch(apiUrl("/customers/all")),
        fetch(apiUrl("/reservations/status")),
        fetch(apiUrl("/tables/all")),
      ]);

      if (
        !reservationsResponse.ok ||
        !roomsResponse.ok ||
        !tablesResponse.ok ||
        !customersResponse ||
        !statusesResponse.ok
      ) {
        throw new Error(
          "Erreur lors de la récupération des chambres, clients ou statuts, tables"
        );
      }

      const reservationsData = await reservationsResponse.json();
      const customersData = await customersResponse.json();
      const roomsData = await roomsResponse.json();
      const statusesData = await statusesResponse.json();
      const tablesData = await tablesResponse.json();

      setReservations(reservationsData);
      setRooms(roomsData);
      setStatuses(statusesData);
      setCustomers(customersData);
      setTables(tablesData);
    } catch (err) {
      setError(err.message);
      showError("Erreur lors de la récupération des données.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchReservations();
  }, []);

  const handleUpdateStatus = async () => {
    try {
      const url = apiUrl(`/reservations/${selectedReservation.id}/status`);
      await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(status),
      });
      toggleModal("");
      showSuccess("Statut mis à jour avec succès.");
      void fetchReservations();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du statut de la salle:",
        error
      );
      showError("Erreur lors de la mise à jour du statut.");
    }
  };

  const confirmDelete = (reservation) => {
    const deleteReservation = reservations.find((r) => r.id === reservation.id);
    setReservationToDelete(deleteReservation);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await fetch(apiUrl(`/reservations/${reservationToDelete.id}`), {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      void fetchReservations();
      showSuccess("Reservation supprimée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression de la reservation:", error);
      showError("Erreur lors de la suppression de la reservation.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setReservationToDelete(null);
  };

  return (
    <div className="darkBody container pr-10 p-6 bg-white rounded-md sm:p-4 md:p-6 lg:p-8 xl:p-10">
      <h1 className="text-2xl font-bold mb-4">Liste des Réservations</h1>

      <button
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2"
        onClick={() => toggleModal("create")}
      >
        Créer un réservation
      </button>

      {isModalOpen && modalType === "create" && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="CreateModal bg-white">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">
                Créer une nouvelle réservation
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => toggleModal("")}
              >
                x
              </span>
            </div>
            <CreateReservation
              onCreate={(reservation) => {
                setReservations((prev) => [...prev, reservation]);
                toggleModal("savedModal");
              }}
              createReservationModal={() => toggleModal("")}
              rooms={rooms}
              tables={tables}
              customers={customers}
              statuses={statuses}
            />
          </div>
        </div>
      )}

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Date de début</th>
            <th className="px-4 py-2">Date de fin</th>
            <th className="px-4 py-2">Nom du client</th>
            <th className="px-4 py-2">Tèl du client</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">Table</th>
            <th className="px-4 py-2">Chambre</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="9" className="text-center py-2">
                Chargement...
              </td>
            </tr>
          ) : reservations.length === 0 ? (
            <tr className="border-b">
              <td colSpan="9" className="py-4 text-gray-500">
                <p className="flex flex-col items-center justify-center">
                  <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                  <span>Aucun réservations trouvé</span>
                </p>
              </td>
            </tr>
          ) : (
            reservations.map((reservation) => (
              <tr
                key={reservation.id}
                className="hover:bg-gray-100 text-center border-y"
              >
                <td className="px-4 py-2">
                  {formatDate(reservation.reservationStart)}
                </td>
                <td className="px-4 py-2">
                  {formatDate(reservation.reservationEnd)}
                </td>
                <td className="px-4 py-2">{reservation.customer.name}</td>
                <td className="px-4 py-2">
                  {reservation.customer.phoneNumber}
                </td>
                <td
                  className={`py-2 px-4 cursor-pointer ${
                    reservation.status.toLowerCase() !== "confirmed" &&
                    reservation.status.toLowerCase() !== "completed"
                      ? "text-red-500 font-bold"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => toggleModal("editStatus", reservation)}
                    className="w-full flex flex-col gap-1 items-center "
                  >
                    <span className="flex flex-row gap-1 items-center ">
                      <MdEdit />{" "}
                      {reservation.status.toLowerCase() !== "confirmed" &&
                        reservation.status.toLowerCase() !== "completed" && (
                          <span className="text-red-500 text-[10px]">⚠️ </span>
                        )}
                      {convertStatusToReservation(reservation.status)}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-2">
                  {reservation.tables.length > 0
                    ? reservation.tables.map((table) => table.number).join(", ")
                    : "Aucune table"}
                </td>
                <td className="px-4 py-2">
                  {reservation.rooms.length > 0
                    ? reservation.rooms
                        .map((room) => room.roomNumber)
                        .join(", ")
                    : "Aucune chambre"}
                </td>

                <td className="px-4 py-2">
                  {truncate(reservation.description, 20)}
                </td>
                <td className="py-2 px-4 flex flex-row gap-2 justify-center">
                  <button
                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                    onClick={() => confirmDelete(reservation)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center sm:w-[350px] md:w-[300px] lg:w-[400px]">
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer la réservation du Mme/Mr{" "}
              {reservationToDelete?.customer.name} ?
            </p>
            <div className="flex justify-between">
              <button
                className="bg-red-300 text-gray-800 py-2 px-4 rounded-md hover:bg-red-400"
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
      )}

      {isModalOpen && modalType === "editStatus" && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-1/2 sm:w-2/3 md:w-1/2 lg:w-1/3"
          >
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
            <UpdateStatusReservation
              onSave={handleUpdateStatus}
              onCancel={() => toggleModal("")}
              statuses={statuses}
              setStatus={setStatus}
              status={status}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationList;
