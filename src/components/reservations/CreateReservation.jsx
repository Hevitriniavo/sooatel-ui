import { useState } from "react";
import { apiUrl } from "../../services/api";
import useToast from "../menus/menu-orders/(tantely)/hooks/useToast";
import { convertStatusToReservation } from "../../services/convertStatus";
import { Autocomplete, TextField, Button } from "@mui/material";

function CreateReservation({
  onCreate,
  createReservationModal,
  rooms,
  tables,
  statuses,
}) {
  const [formData, setFormData] = useState({
    reservationStart: "",
    reservationEnd: "",
    customer: {
      name: "",
      phoneNumber: "",
      customerId: null,
    },
    roomIds: [],
    tableIds: [],
    status: "",
    description: "",
  });

  const { showSuccess, showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" || name === "phoneNumber") {
      setFormData((prevData) => ({
        ...prevData,
        customer: { ...prevData.customer, [name]: value },
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleAutocompleteChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value.map((item) => item.id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.customer.name ||
      !formData.customer.phoneNumber ||
      !formData.reservationStart ||
      !formData.reservationEnd ||
      !formData.status ||
      !formData.roomIds ||
      !formData.tableIds
    ) {
      showError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...formData,
      customer: {
        ...formData.customer,
        customerId: null,
      },
    };
    try {
      const response = await fetch(apiUrl("/reservations"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const newReservation = await response.json();

      if (!response.ok) {
        showError(
          newReservation?.message ??
            "Erreur lors de la création de la réservation."
        );
        return;
      }

      showSuccess("Réservation créée avec succès.");
      onCreate(newReservation);
    } catch (err) {
      showError(err.message || "Erreur lors de la création de la réservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white">
      <div className="flex flex-col sm:flex-row sm:gap-10 sm:justify-evenly">
        <div className="sm:w-[320px] mb-4 sm:mb-0">
          <label htmlFor="name" className="block mb-2 font-bold">
            Nom du client
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Nom du client"
            value={formData.customer.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="sm:w-[320px] mb-4 sm:mb-0">
          <label htmlFor="phoneNumber" className="block mb-2 font-bold">
            Tèl du client
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Téléphone"
            value={formData.customer.phoneNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-10 sm:justify-evenly">
        <div className="mt-4 sm:w-[320px]">
          <label htmlFor="reservationStart" className="block mb-2 font-bold">
            Date de début
          </label>
          <input
            type="datetime-local"
            id="reservationStart"
            name="reservationStart"
            value={formData.reservationStart}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div className="mt-4 sm:w-[320px]">
          <label htmlFor="reservationEnd" className="block mb-2 font-bold">
            Date de fin
          </label>
          <input
            type="datetime-local"
            id="reservationEnd"
            name="reservationEnd"
            value={formData.reservationEnd}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-10 sm:justify-evenly">
        <div className="mt-4 sm:w-[320px]">
          <label htmlFor="tableIds" className="block mb-2 font-bold">
            Tables
          </label>
          <Autocomplete
            multiple
            className="w-full rounded"
            id="tableIds"
            options={tables}
            getOptionLabel={(table) => `Table ${table.number}`}
            onChange={(event, value) =>
              handleAutocompleteChange("tableIds", value)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Sélectionnez les tables"
              />
            )}
          />
        </div>

        <div className="mt-4 sm:w-[320px]">
          <label htmlFor="roomIds" className="block mb-2 font-bold">
            Chambres
          </label>
          <Autocomplete
            multiple
            id="roomIds"
            className="w-full rounded"
            options={rooms}
            getOptionLabel={(room) => `Chambre ${room.roomNumber}`}
            onChange={(event, value) =>
              handleAutocompleteChange("roomIds", value)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Sélectionnez les chambres"
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-10 pl-6">
        <div className="mt-4 sm:w-[320px]">
          <label htmlFor="status" className="block mb-2 font-bold">
            Statut
          </label>
          <Autocomplete
            id="status"
            options={statuses || []}
            value={formData.status || ""}
            onChange={(event, newValue) =>
              setFormData((prevData) => ({
                ...prevData,
                status: newValue || "",
              }))
            }
            getOptionLabel={(status) =>
              convertStatusToReservation(status.toLowerCase())
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Statut"
                variant="outlined"
                placeholder="Sélectionnez un statut"
                required
              />
            )}
            className="w-full sm:w-64"
            disableClearable
          />
        </div>
        <div className="mt-4 sm:w-[400px]">
          <label htmlFor="description" className="block mb-2 font-bold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="3"
          />
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button
          type="button"
          variant="contained"
          color="inherit"
          onClick={createReservationModal}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Création..." : "Créer"}
        </Button>
      </div>
    </form>
  );
}

export default CreateReservation;
