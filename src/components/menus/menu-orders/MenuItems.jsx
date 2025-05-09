import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiUrl, fetchJson } from "../../../services/api";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const schema = z.object({
    menuId: z.number().min(1, "La MenuId doit être supérieure à 0"),
    quantity: z.number().min(1, "La quantité doit être supérieure à 0"),
});

function MenuItems({ onSave }) {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const [menus, setMenus] = useState([]);
    const [menuInput, setMenuInput] = useState("");

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const data = await fetchJson(apiUrl("/menus/all"));
                setMenus(data || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMenus();
    }, []);

    const handleMenuChange = (event, value) => {
        if (value) {
            setMenuInput(value.name);
            setValue("menuId", value.id); 
        } else {
            setMenuInput("");
            setValue("menuId", 0); 
        }
    };
    
    const handleConfirm = (data) => {
        if (!data.menuId || !data.quantity) {
            console.error("MenuId ou quantité manquante.");
            return;
        }
    
        onSave(data);
        reset(); 
        setMenuInput(""); 
    };
    

    return (
        <div className="w-full flex flex-row gap-4 items-start">
            <div className="flex flex-col w-full">
                <label htmlFor="menuInput">Menu Sélectionné</label>
                <Autocomplete
                    id="menuInput"
                    options={menus}
                    getOptionLabel={(menu) => menu.name || ""}
                    onChange={handleMenuChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tapez les noms du menu..."
                            variant="outlined"
                            error={!!errors.menuId}
                            helperText={errors.menuId?.message}
                        />
                    )}
                    sx={{
                        width: '250px',
                        height: '50px', 
                        '.MuiInputBase-root': { height: '40px' },
                    }}
                    value={menus.find((menu) => menu.name === menuInput) || null}
                />
            </div>

            {/* Champ de quantité */}
            <div className="flex flex-col w-full">
                <label htmlFor="quantity">Quantité</label>
                <input
                    id="quantity"
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                    className={`block w-full border-2 border-gray-300 
                        outline-none focus:outline-1 focus:outline-double 
                        focus:outline-blue-400 px-2 py-2 h-10 ${
                        errors.quantity ? "border-red-500" : ""
                    }`}
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
            </div>

            {/* Bouton de soumission */}
            <div className="w-full">
                <button
                    type="button"
                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mt-6"
                    onClick={handleSubmit(handleConfirm)}
                >
                    Ajouter
                </button>
            </div>
        </div>
    );
}

export default MenuItems;
