import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../../services/api";
import MenuItems from "./MenuItems";
import { MdDelete } from "react-icons/md";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import useToast from "./(tantely)/hooks/useToast";

const schema = z.object({
  customerId: z.union([z.string(), z.number()]).optional(),
  roomId: z.union([z.string(), z.number()]).nullable().optional(),
  tableId: z.union([z.string(), z.number()]).nullable().optional(),
}).refine(data => data.roomId || data.tableId, {
  message: "Il faut choisir soit une table soit une chambre.",
  path: ["roomId"], 
});




function CreateMenuOrder({ onClose, onOrderCreated }) {
    const [menuRequest, setMenuRequest] = useState([]);
    const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(schema),
      });

    const [menuError, setMenuError] = useState("");
    const [customers, setCustomers] = useState([]);
    const [tables, setTables] = useState([]);
    const [rooms, setRooms] = useState([]);
    const {showError, showSuccess} = useToast()
    const [menus, setMenus] = useState([]);
     
    const handleConfirm = async (data) => {
     
        
        if (menuRequest.length === 0) {
            setMenuError("Veuillez ajouter au moins un élément de menu.");
            return;
        }
    


        const payload = {
            customerId: data.customerId ? Number(data.customerId) : null,
            roomNumber: data.roomId ? Number(data.roomId) : null,
            tableNumber: data.tableId ? Number(data.tableId) : null,
            menuItems: menuRequest,
        };
    
        try {
          const response = await fetch(apiUrl("/menu-orders"), {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
          });
  
          const data = await response.json();

          console.log(data);

          if (!response.ok) {
            const ingredientsList = data.message
            ? Array.from(
                  new Set(
                      data.message
                          .split(",")
                          .map((item) => item.trim().toLowerCase()) 
                  )
              ).map((item) => item.charAt(0).toUpperCase() + item.slice(1))
            : [];
        
        const formattedMessage = ingredientsList.length > 0 
            ? `Les ingrédients suivants sont insuffisants :\n• ${ingredientsList.join("\n• ")}`
            : `Erreur : ${response.statusText}`;

            setMenuError(formattedMessage);
            showError(formattedMessage);
            throw new Error(formattedMessage);

          }
  
          showSuccess("Commande créée avec succès !");
          onOrderCreated(data);
          onClose();
      } catch (error) {
          console.error("Erreur lors de la soumission :", error.message);
      }
    };
    
    const handleSave = useCallback((data) => {
      setMenuRequest((prev) => {
          const existingItemIndex = prev.findIndex(item => item.menuId === data.menuId);
          if (existingItemIndex !== -1) {
              const updatedMenuRequest = [...prev];
              updatedMenuRequest[existingItemIndex].quantity += data.quantity;
              return updatedMenuRequest;
          } else {
              return [...prev, data];
          }
      });
  }, []);
  

    const removeItem = (menuId) => {
        setMenuRequest(menuRequest.filter(item => item.menuId !== menuId));
    };

    useEffect(() => {
        const fetchData = async () => {
            const urls = [
                `${apiUrl("/customers/all")}`,
                `${apiUrl("/tables/all")}`,
                `${apiUrl("/rooms")}`,
                `${apiUrl("/menus/all")}`,
            ];

            try {
                const [customersData, tablesData, roomsData, menusData] = await Promise.all(
                    urls.map(url => fetchJson(url))
                );
                setCustomers(customersData || []);
                setTables(tablesData || []);
                setRooms(roomsData || []);
                setMenus(menusData || []);
            } catch (e) {
                console.log(e);
            }
        };

        fetchData();
    }, []);

    const handleCancel = () => {
        setMenuRequest([]);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4 p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 items-center">
            <Controller
              name="customerId"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col w-full">
                  <label htmlFor="customerId">Client</label>
                  <Autocomplete
                  
                    options={customers}
                    getOptionKey={(option, index) => option?.id ?? `default-key-${index}`}
                    getOptionLabel={(option) => option?.lastName || "Inconnu"}
                    onChange={(event, value) => field.onChange(value?.id || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sélectionnez un client"
                        variant="outlined"
                        error={!!errors.customerId}
                      />
                    )}
                  />
                </div>
              )}
            />
            <Controller
              name="roomId"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col w-full">
                  <label htmlFor="roomId">Chambre</label>
                  <Autocomplete
                    options={rooms}
                    getOptionKey={(option, index) => option?.id ?? `default-key-${index}`}
                    getOptionLabel={(option) => option?.roomNumber?.toString() || "Inconnu"}
                    onChange={(event, value) => field.onChange(value?.roomNumber || null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sélectionnez une chambre"
                        variant="outlined"
                        error={!!errors.roomId}
                      />
                    )}
                  />
                </div>
              )}
            />
    
            <Controller
              name="tableId"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col w-full">
                  <label htmlFor="tableId">Table</label>
                  <Autocomplete
                    options={tables}
                    getOptionKey={(option, index) => option?.id ?? `default-key-${index}`}
                    getOptionLabel={(option) => option?.number?.toString() || "Inconnu"}
                    onChange={(event, value) => field.onChange(value?.number || null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sélectionnez une table"
                        variant="outlined"
                        error={!!errors.tableId}
                      />
                    )}
                  />
                </div>
              )}
            />
          </div>
    
          <div>
            <MenuItems onSave={handleSave} />
            {menuError && <p className="text-red-500 text-sm">{menuError}</p>}
    
            {menuRequest.length > 0 && (
              <div className="mt-4">
                <h2 className="font-semibold">Articles sélectionnés :</h2>
                <ul className="mt-4 border border-collapse px-4 py-2 h-[100px] overflow-y-auto scrollbar-custom">
                  {menuRequest.map((item, index) => {
                    const menu = menus.find((m) => m.id === item.menuId);
                    return (
                      <li key={index} className="flex items-center justify-between py-2">
                        <span>
                          {menu ? menu.name : "Menu inconnu"} - Quantité: {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.menuId)}
                          className="bg-red-500 text-white rounded p-1 hover:bg-red-600 ml-2"
                        >
                          <MdDelete />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
    
          <div className="flex justify-between space-x-2 mt-4">
            <button
              type="button"
              className="ml-2 bg-gray-300 text-gray-800 rounded px-4 py-2 hover:bg-gray-400"
              onClick={handleCancel}
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
      );
}

export default CreateMenuOrder;
