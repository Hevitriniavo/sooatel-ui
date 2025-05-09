import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import MenuItems from "./MenuItems";
import { apiUrl, fetchJson } from "../../../../services/api";

const schema = z.object({
    customerId: z.string().nullable(),
    roomId: z.string().nullable(),
    tableId: z.string().nullable(),
});

function ReservationForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [menuRequest, setMenuRequest] = useState([]);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const [menuError, setMenuError] = useState("");
    const [customers, setCustomers] = useState([]);
    const [tables, setTables] = useState([]);
    const [rooms, setRooms] = useState([]);

    const findByNumber = (number, type) => {
        if (type === 'table') {
            return tables.find((table) => table.number === number);
        } else if (type === 'room') {
            return rooms.find((room) => room.roomNumber === number);
        } else {
            return null;
        }
    };

    const handleConfirm = async (data) => {
        if (menuRequest.length === 0) {
            setMenuError("Veuillez ajouter au moins un élément de menu.");
            return;
        }
    
        setMenuError("");

        const table = findByNumber(data.tableId, 'table')
        const room = findByNumber(data.roomId, 'room')
        const payload = {
            customerId: data.customerId ? Number(data.customerId) : null,
            roomId: room ? Number(room.id) : null,
            tableId: table ? Number(table.id) : null,
            menuItems: menuRequest,
        };
    
        console.log(payload);
        
        try {
            const response = await fetchJson(`${apiUrl("/menu-orders")}`, 'POST', payload);
            console.log('Réponse du serveur:', response);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la commande:', error);
        }
    };
    

    const handleSave = useCallback((data) => {
        setMenuRequest((prev) => [...prev, data]); 
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const urls = [
                `${apiUrl("/customers/all")}`,
                `${apiUrl("/tables/all")}`,
                `${apiUrl("/rooms")}`
            ];

            try {
                const [customersData, tablesData, roomsData] = await Promise.all(
                    urls.map(url => fetchJson(url))
                );
                setCustomers(customersData || []);
                setTables(tablesData || []);
                setRooms(roomsData || []);
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-[900px] mx-auto p-4 bg-white rounded">
            <h1 className="text-center text-3xl font-serif font-bold text-purple-600 mb-4">
                Formulaire de Réservation
            </h1>

            <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4">
                <div>
                    <label htmlFor="customerId" className="block text-md font-medium text-gray-700">
                        Sélectionnez un Client
                    </label>
                    <select
                        id="customerId"
                        {...register("customerId")}
                        className={`mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2 ${errors.customerId ? 'border-red-500' : ''}`}
                    >
                        <option value="">Sélectionnez un client</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.lastName}</option>
                        ))}
                    </select>
                    {errors.customerId && <p className="text-red-500 text-sm">{errors.customerId.message}</p>}
                </div>

                <div>
                    <label className="block text-md font-medium text-gray-700">
                        Éléments de Menu
                    </label>
                    <span className="text-gray-500 text-sm cursor-pointer hover:text-blue-400" onClick={() => setIsOpen(!isOpen)}>
                        Ajoutez plusieurs éléments de menu si nécessaire. {menuRequest.length > 0 && `(${menuRequest.length} élément${menuRequest.length > 1 ? 's' : ''})`}
                    </span>
                    <MenuItems isOpen={isOpen} setIsOpen={setIsOpen} onSave={handleSave} />
                    {menuError && <p className="text-red-500 text-sm">{menuError}</p>}
                </div>

                <div>
                    <label htmlFor="roomId" className="block text-md font-medium text-gray-700">
                        Sélectionnez une Chambre
                    </label>
                    <select
                        id="roomId"
                        {...register("roomId")}
                        className={`mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2 ${errors.roomId ? 'border-red-500' : ''}`}
                    >
                        <option value="">Sélectionnez une chambre</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>{room.roomNumber}</option>
                        ))}
                    </select>
                    {errors.roomId && <p className="text-red-500 text-sm">{errors.roomId.message}</p>}
                </div>

                <div>
                    <label htmlFor="tableId" className="block text-md font-medium text-gray-700">
                        Sélectionnez une Table
                    </label>
                    <select
                        id="tableId"
                        {...register("tableId")}
                        className={`mt-1 block w-full border-2 border-gray-300 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-2 py-2 ${errors.tableId ? 'border-red-500' : ''}`}
                    >
                        <option value="">Sélectionnez une table</option>
                        {tables.map(table => (
                            <option key={table.id} value={table.id}>{table.number}</option>
                        ))}
                    </select>
                    {errors.tableId && <p className="text-red-500 text-sm">{errors.tableId.message}</p>}
                </div>

                <div className="flex justify-between space-x-2 mt-4">
                    <button
                        type="button"
                        className="bg-red-300 text-gray-800 rounded px-4 py-2 hover:bg-red-400"
                        onClick={() => {

                        }} 
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                    >
                        Confirmer
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ReservationForm;
