import { useEffect, useState } from "react";
import Modal from "./modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiUrl, fetchJson } from "../../../../services/api";

const schema = z.object({
    menuId: z.number().min(1, "la MenuId doit être supérieure à 0"),
    quantity: z.number().min(1, "La quantité doit être supérieure à 0"),
});

function MenuItems({ isOpen, setIsOpen, onSave }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        (async () => {
            const url = `${apiUrl("/menus/all")}`;
            try {
                const data = await fetchJson(url);
                setMenus(data || []); 
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    const handleConfirm = (data) => {
        onSave(data); 
        reset(); 
        setIsOpen(false);
    };

    return (
        <div>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className="space-y-4 w-96 p-2">
                    <h1 className="text-center text-2xl font-serif font-semibold">Système de Réservation</h1>
                    <div>
                        <label htmlFor="menuId" className="block text-md font-medium text-gray-700">
                            Sélectionnez le Menu
                        </label>
                        <select
                            id="menuId"
                            {...register("menuId", { valueAsNumber: true })}
                            className={`mt-1 block w-full border-2 border-gray-100 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-1 py-2 ${errors.menuId ? 'border-red-500' : ''}`}
                        >
                            <option value="">Sélectionnez un menu</option>
                            {menus.length > 0 ? (
                                menus.map((menu) => (
                                    <option key={menu.id} value={menu.id}>
                                        {menu.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Aucun menu disponible</option>
                            )}
                        </select>
                        {errors.menuId && <p className="text-red-500 text-sm">{errors.menuId.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="quantity" className="block w-full font-medium text-gray-700">
                            Quantité
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            {...register("quantity", { valueAsNumber: true })}
                            className={`mt-1 block w-full border-2 border-gray-100 outline-none focus:outline-1 focus:outline-double focus:outline-blue-400 px-1 py-2 ${errors.quantity ? 'border-red-500' : ''}`}
                        />
                        {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
                    </div>

                    <div className="flex justify-between space-x-2 mt-4">
                        <button
                            type="button"
                            className="bg-red-300 text-gray-800 rounded px-4 py-2 hover:bg-red-400"
                            onClick={() => setIsOpen(false)} 
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                            onClick={handleSubmit(handleConfirm)} 
                        >
                            Confirmer
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default MenuItems;
