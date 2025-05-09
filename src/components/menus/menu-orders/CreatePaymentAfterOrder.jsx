import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import useToast from "./(tantely)/hooks/useToast.jsx";
import { apiUrl } from "../../../services/api.js";
import { convertStatusToPayment } from "../../../services/convertStatus.js";

const CreatePaymentAfterOrder = ({ type, number, onCancel, onSuccess }) => {
    const { showSuccess, showError } = useToast();
    const [selectedTables, setSelectedTables] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState([]);
    
    const [payload, setPayload] = useState({
        tableNumbers: [],
        roomNumbers: [],
        paymentMethod: "",
        status: "UNPAID",
        description: "",
    });

    const [data, setData] = useState({
        statuses: [],
        methods: [],
        tables: [],
        rooms: [],
    });

    const fetchData = async () => {
        try {
            const [methodsRes, tablesRes, roomsRes, statusesRes] = await Promise.all([
                fetch(apiUrl("/payments/method")),
                fetch(apiUrl("/tables/all")),
                fetch(apiUrl("/rooms")),
                fetch(apiUrl("/payments/status")),
            ]);

            const resTables = await tablesRes.json();
            const resRooms = await roomsRes.json();

            if (type === "table") {
                const selected = resTables.find((t) => t.number === number) || null;
                setSelectedTables(selected ? [selected] : []);
            }

            if (type === "room") {
                const selected = resRooms.find((r) => r.roomNumber === number) || null;
                setSelectedRooms(selected ? [selected] : []);
            }

            setData({
                methods: await methodsRes.json(),
                tables: resTables,
                rooms: resRooms,
                statuses: await statusesRes.json(),
            });
        } catch (error) {
            console.error(error);
            showError("Erreur lors du chargement des données.");
        }
    };

    useEffect(() => {
        void fetchData();
    }, []);

    const handleChange = (field, value) => {
        setPayload((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event) => {        
        event.preventDefault();

        const prePayload = {
            ... payload,
            roomNumbers: selectedRooms.map(r => r.roomNumber),
            tableNumbers: selectedTables.map(t => t.number)
        }
        
        try {
            const response = await fetch(apiUrl("/payments"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(prePayload),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la création du paiement.");
            }

            const json = await response.json()
            showSuccess("Paiement soumis avec succès !");
            onSuccess(json.id ?? number)
        } catch (error) {
            console.error(error);
            showError("Erreur lors de la soumission du paiement.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 shadow-md rounded">
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex flex-row gap-4 mb-4">
                    <div className="w-1/2">
                        <label htmlFor="tableNumbers" className="block text-gray-700">
                            Tables:
                        </label>
                        <Autocomplete
                            id="tableNumbers"
                            multiple
                            options={data.tables}
                            value={selectedTables}
                            getOptionLabel={(option) => `Table ${option.number}`}
                            onChange={(event, value) => {
                                console.log(value);
                                
                                setSelectedTables(value);
                                handleChange("tableNumbers", value.map((table) => table.number));
                            }}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" placeholder="Choisir des tables..." />
                            )}
                            className="w-full"
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="roomNumbers" className="block text-gray-700">
                            Chambres:
                        </label>
                        <Autocomplete
                            id="roomNumbers"
                            multiple
                            options={data.rooms}
                            value={selectedRooms}
                            getOptionLabel={(option) => `Chambre ${option.roomNumber}`}
                            onChange={(event, value) => {
                                setSelectedRooms(value);
                                handleChange("roomNumbers", value.map((room) => room.roomNumber));
                            }}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" placeholder="Choisir des chambres..." />
                            )}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-2">
                    <div className="w-1/2">
                        <label htmlFor="paymentMethod" className="block text-gray-700">
                            Payment Method:
                        </label>
                        <Autocomplete
                            id="paymentMethod"
                            options={data.methods}
                            getOptionLabel={(option) => option.toLowerCase()}
                            onChange={(event, value) => handleChange("paymentMethod", value ?? "")}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" placeholder="Choisir..." />
                            )}
                            className="w-full"
                        />
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="paymentMethod" className="block text-gray-700">
                            Payment Status:
                        </label>
                        <Autocomplete
                            id="status"
                            options={data.statuses}
                            getOptionLabel={(option) => convertStatusToPayment(option.toLowerCase())}
                            onChange={(event, value) => handleChange("status", value ?? "")}
                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" placeholder="Choisir..." />
                            )}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Description:</label>
                    <textarea
                        value={payload.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        rows="3"
                        maxLength={255}
                    />
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 rounded p-2 hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                    >
                        Submit Payment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePaymentAfterOrder;
