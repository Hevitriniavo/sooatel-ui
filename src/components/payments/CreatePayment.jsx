import { useState, useEffect } from "react";
import useToast from "../menus/menu-orders/(tantely)/hooks/useToast";
import { apiUrl } from "../../services/api";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const CreatePayment = ({ onCreate, onCancel }) => {
    const { showSuccess, showError } = useToast();

    const [payload, setPayload] = useState({
        reservationId: null,
        tableNumbers: [],
        roomNumbers: [],
        paymentMethod: "",
        status: "UNPAID",
        description: "",
    });

    const [data, setData] = useState({
        reservations: [],
        statuses: [],
        methods: [],
        tables: [],
        rooms: [],
    });

    const fetchData = async () => {
        try {
            const [reservationsRes, methodsRes, tablesRes, roomsRes, statusesRes] =
                await Promise.all([
                    fetch(apiUrl("/reservations")),
                    fetch(apiUrl("/payments/method")),
                    fetch(apiUrl("/tables/tables-with-menu-orders")),
                    fetch(apiUrl("/rooms/rooms-with-menu-orders")),
                    fetch(apiUrl("/payments/status")),
                ]);

            setData({
                reservations: await reservationsRes.json(),
                methods: await methodsRes.json(),
                tables: await tablesRes.json(),
                rooms: await roomsRes.json(),
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
        try {
            const response = await fetch(apiUrl("/payments"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la création du paiement.");
            }

            const result = await response.json();
            console.log("Paiement créé :", result);
            showSuccess("Paiement soumis avec succès !");
            onCreate(result);
            onCancel();
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
                            getOptionLabel={(option) => `Table ${option.number}`}
                            onChange={(event, value) =>
                                handleChange(
                                    "tableNumbers",
                                    value.map((table) => table.number)
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Choisir des tables..."
                                />
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
                            getOptionLabel={(option) => `Chambre ${option.roomNumber}`}
                            onChange={(event, value) =>
                                handleChange(
                                    "roomNumbers",
                                    value.map((room) => room.roomNumber)
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Choisir des chambres..."
                                />
                            )}
                            className="w-full"
                        />
                    </div>
                </div>


                <div className="flex flex-row gap-2">

                    <div className="w-1/2">
                        <div className="w-full">
                            <label htmlFor="reservationId" className="block text-gray-700">
                                Reservation:
                            </label>
                            <Autocomplete
                                id="reservationId"
                                options={data.reservations}
                                getOptionLabel={(option) =>
                                    `${option.id} - ${option.customer.lastName}`
                                }
                                onChange={(event, value) =>
                                    handleChange("reservationId", value ? value.id : null)
                                }
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" placeholder="Choisir..."/>
                                )}
                                className="w-full"
                            />
                        </div>


                    </div>
                    <div className="w-1/2">
                        <label htmlFor="paymentMethod" className="block text-gray-700">
                            Payment Method:
                        </label>
                        <Autocomplete
                            id="paymentMethod"
                            options={data.methods}
                            getOptionLabel={(option) => option.toLowerCase()}
                            onChange={(event, value) =>
                                handleChange(
                                    "paymentMethod",
                                    value ?? ""
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Choisir..."
                                />
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

export default CreatePayment;
