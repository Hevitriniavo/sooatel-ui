    import { useEffect, useState } from "react";
    import { apiUrl, fetchJson } from "../../../services/api";
    import CreateMenuOrder from "./CreateMenuOrder";
    import { MdAddBox, MdDelete, MdEdit, MdInfoOutline } from "react-icons/md";
    import UpdateStatusOrder from "../../status/UpdateStatusOrder.jsx";
    import dayjs from "dayjs";
    import Modal from "./Modal.jsx"
    import { convertStatusToOrder } from "../../../services/convertStatus.js";
    import useToast from "./(tantely)/hooks/useToast.jsx";
    import TextField from '@mui/material/TextField';

    function MenuOrdersList() {
        const [orderToDelete, setOrderToDelete] = useState(null);
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        const [orders, setOrders] = useState([]);
        const [statuses, setStatuses] = useState([]);
        const [showEditModal, setShowEditModal] = useState(false);
        const [status, setStatus] = useState('');
        const [selectedOrderId, setSelectedOrderId] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [currentPage, setCurrentPage] = useState(1);
        const [totalPages, setTotalPages] = useState(0);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);
        const [searchTerm, setSearchTerm] = useState('');
        const [hasPrevious, setHasPrevious] = useState(false);
        const [hasNext, setHasNext] = useState(false);
        const { showError, showSuccess } = useToast();

        useEffect(() => {
            void fetchOrders();
        }, [currentPage, searchTerm]);

        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const query = new URLSearchParams({
                    page: currentPage - 1 > 0 ? currentPage - 1 : 0,
                    size: 5
                }).toString();
                const data = await fetchJson(apiUrl(`/menu-orders/search?${query}`));
                setOrders(data.items || []);
                setIsLoading(false);
                setTotalPages(data?.pageInfo.totalPages || 0);
                setHasNext(data?.pageInfo?.hasNext || false);
                setHasPrevious(data?.pageInfo?.hasPrevious || false);
            } catch (err) {
                const errorMsg = err.message || 'Erreur lors de la récupération des menus order';
                setError(errorMsg);
                showError('Une erreur s\'est produite lors du chargement des menu orders.');
                setIsLoading(false);
            }
        };


        useEffect(() => {
            fetchJson(apiUrl("/menu-orders/status"))
                .then((data) => setStatuses(data))
                .catch((error) => console.log(error));
        }, []);

        const handleEditStatus = (order) => {
            setSelectedOrderId(order.id);
            setStatus(order.orderStatus);
            setShowEditModal(true);
        };

        const handleUpdateStatus = async () => {
            try {
                const url = apiUrl(`/menu-orders/${selectedOrderId}/status`);
                const res = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(status),
                });

                if (res.ok) {
                    setShowEditModal(false);
                    setSelectedOrderId(null);
                    void fetchOrders();
                    showSuccess("Le status a été mis à jour avec succès.");
                }

            } catch {
                showError("Erreur lors de la mise à jour du statut de la commande.");
            }
        };

        const handleNextPage = () => {
            if (currentPage < totalPages)
                setCurrentPage(prevPage => prevPage + 1);
        };

        const handlePrevPage = () => {
            if (currentPage > 1)
                setCurrentPage(prevPage => prevPage - 1);
        };

        const handlePageInputChange = (e) => {
            let value = parseInt(e.target.value);

            if (!isNaN(value)) {
                setCurrentPage(value);
            } else {
                setCurrentPage(1);
            }
        };

        const filteredMenuOrders = orders.filter((order) => {
            if (searchTerm) {
                return (order.room?.roomNumber || order.table?.number) === parseInt(searchTerm, 10);
            }
            return true;
        })


        const handleDelete = async () => {
            if (orderToDelete) {
                try {
                    const res = await fetch(apiUrl(`/menu-orders/${orderToDelete}`), {
                        method: "DELETE",
                    });
                    if (res.ok) {
                        showSuccess("Commande supprimée avec succès !");
                        void fetchOrders();
                        setIsDeleteModalOpen(false);
                        setOrderToDelete(null);
                    } else {
                        showError("Erreur lors de la suppression de la commande.");
                    }
                } catch (err) {
                    showError("Une erreur s'est produite.");
                }
            }
        };



        const openDeleteModal = (orderId) => {
            setOrderToDelete(orderId);
            setIsDeleteModalOpen(true);
        };

        const closeDeleteModal = () => {
            setIsDeleteModalOpen(false);
            setOrderToDelete(null);
        };

        return (
            <>
                <div className="w-full p-4 bg-white rounded shadow-lg darkBody pr-16">
                    <h2 className="text-2xl font-bold mb-4">Liste des Commandes</h2>
                    <div className="flex flex-row gap-2 items-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
                        flex flex-row gap-2 items-center mb-2"
                        >
                            <MdAddBox /> Ajouter une commande
                        </button>

                        <TextField
                            id="outlined-search"
                            label="Rechercher chambre / table"
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
                                        onClick={() => setSearchTerm('')}
                                        style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                                    >
                                    </button>
                                ),
                            }}
                            sx={{
                                width: '250px',
                                height: '50px',
                                '.MuiInputBase-root': { height: '40px' },
                            }}
                        />
                    </div>

                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-4 darkBody">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2">Chambre</th>
                                <th className="py-2">Table</th>
                                <th className="py-2">Menu</th>
                                <th className="py-2">Quantité</th>
                                <th className="py-2">Coût</th>
                                <th className="py-2">Statut</th>
                                <th className="py-2">Date de Commande</th>
                                <th className="py-2 px-4">Modifié le</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-2">Chargement...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-2 text-red-500">{error}</td>
                                </tr>
                            ) : filteredMenuOrders.length > 0 ? (
                                filteredMenuOrders.toSorted((a, b) => {
                                    const statusA = a.orderStatus?.toUpperCase() !== "AVAILABLE" ? 0 : 1;
                                    const statusB = b.orderStatus?.toUpperCase() !== "AVAILABLE" ? 0 : 1;

                                    if (statusA !== statusB) {
                                        return statusA - statusB
                                    }

                                    return (new Date(b.orderDate) - new Date(a.orderDate) || new Date(b.updatedAt) - new Date(a.updatedAt))
                                }).map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-100 text-center border-y">
                                        <td className="py-2">{order.room?.roomNumber || "-"}</td>
                                        <td className="py-2">{order.table?.number || "-"}</td>
                                        <td className="py-2">{order.menu?.name || "-"}</td>
                                        <td className="py-2">{order.quantity}</td>
                                        <td className="py-2">{order.cost}</td>
                                        <td className="py-2 px-4 cursor-pointer">
                                            <button
                                                onClick={() => handleEditStatus(order)}
                                                className={`w-full flex flex-col gap-1 items-center ${order.orderStatus?.toLowerCase() !== "delivered" ? 'text-red-500 font-bold' : ''}`}
                                            >
                                                <span className='flex flex-row text-sm gap-1 items-center '>
                                                    <MdEdit /> {order.orderStatus?.toLowerCase() !== "delivered" && (
                                                        <span className="text-red-500 text-[10px]">⚠️</span>
                                                    )}
                                                    {convertStatusToOrder(order.orderStatus?.toLowerCase())}
                                                </span>

                                            </button>
                                        </td>

                                        <td className="py-2">{dayjs(order.orderDate).format('YYYY-MM-DD HH:mm')}</td>
                                        <td className="py-2 px-4">{dayjs(order.updatedAt).format('YYYY-MM-DD HH:mm')}</td>

                                        <td className="py-2 px-4 flex justify-center items-center">
                                            <button
                                                onClick={() => openDeleteModal(order.id)}
                                                className="flex items-center justify-center w-8 h-8 text-white bg-red-500 hover:bg-red-600 rounded-full shadow-md"
                                            >
                                                <MdDelete className="text-lg" />
                                            </button>
                                        </td>
                                    </tr>
                                ))) : (
                                <tr className="hover:bg-gray-100 text-center border-y">
                                    <td colSpan="8" className="py-4 text-gray-500  ">
                                        <p className="flex flex-col items-center justify-center w-full">
                                            <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                                            <span>Aucun commande trouvé</span>
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {showEditModal && (
                        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                            <div className="bg-white rounded-lg shadow-lg EditModal">
                                <div className='flex flex-row justify-between items-center'>
                                    <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le statut</h2>
                                    <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                                relative bottom-4 text-[30px] hover:text-white cursor-pointer'
                                        onClick={() => setShowEditModal(false)}>
                                        x
                                    </span>
                                </div>
                                <UpdateStatusOrder
                                    onSave={handleUpdateStatus}
                                    onCancel={() => setShowEditModal(false)}
                                    statuses={statuses}
                                    setStatus={setStatus}
                                    status={status}
                                />
                            </div>
                        </div>
                    )}

                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                            <dir className=" mx-auto bg-white rounded CreateModal">
                                <div className='flex flex-row justify-between items-center'>
                                    <h2 className="text-center font-serif font-bold
                                text-xl pl-8 pt-8 pb-4">
                                        Formulaire de Commande
                                        <br /><span className="text-[10px]">nb : choisir table ou chambre</span>
                                    </h2>
                                    <span className='hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                                relative bottom-8 text-[30px] hover:text-white cursor-pointer'
                                        onClick={() => setIsModalOpen(false)}>
                                        x
                                    </span>
                                </div>
                                <CreateMenuOrder
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    onOrderCreated={() => {
                                        fetchOrders()
                                    }}
                                />
                            </dir>
                        </div>
                    )}

                    <div className="flex justify-between mt-4 items-center">
                        <button
                            onClick={handlePrevPage}
                            className={`${hasPrevious ? "bg-blue-500 hover:bg-blue-600 " : "bg-gray-500 hover:bg-gray-600 "} text-white px-4 py-2 rounded `}
                            disabled={!hasPrevious}
                        >
                            Précédent
                        </button>
                        <div className="flex items-center">
                            <span className="mr-2">Page {currentPage}/{totalPages}</span>
                            <input
                                type="number"
                                value={currentPage}
                                onChange={handlePageInputChange}
                                onBlur={handlePageInputChange}
                                onKeyDown={(e) => e.key === 'Enter' && handlePageInputChange(e)}
                                min={1}
                                max={totalPages}
                                className="border border-gray-300 rounded-md px-2 py-1 outline-none w-20"
                            />
                        </div>
                        <button
                            onClick={handleNextPage}
                            className={`${hasNext ? "bg-blue-500 hover:bg-blue-600 " : "bg-gray-500 hover:bg-gray-600 "} text-white px-4 py-2 rounded `}
                            disabled={!hasNext}
                        >
                            Suivant
                        </button>
                    </div>
                </div>
                <Modal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen}>
                    <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
                    <p>Êtes-vous sûr de vouloir supprimer cette commande ?</p>
                    <div className="flex justify-between gap-4 mt-4">
                        <button
                            onClick={closeDeleteModal}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Supprimer
                        </button>
                    </div>
                </Modal>
            </>
        );
    }

    export default MenuOrdersList;