import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiUrl, fetchJson } from "../../services/api";
import { useNavigate } from "react-router-dom";

const CustomerSchema = z.object({
  name: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères" }),
  phoneNumber: z.string().regex(/^(\+?\d{1,4}[-.\s]?)?(\d{10})$/, { message: "Numéro de téléphone invalide" })
});

const CreateCustomer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(CustomerSchema),
    mode: "onSubmit"
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await fetchJson(apiUrl("/customers"), 'POST', data);
      reset();
      navigate("/customers");
    } catch (error) {
      console.error("Erreur lors de la création du client :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="container bg-white w-[1109px] darkBody mx-auto p-10 pb-14">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 bg-white 
          shadow-lg rounded-lg CreateModal">
              <h2 className="text-2xl text-center font-semibold mb-4">Créer un Client</h2>

              <div className="flex flex-row gap-6 justify-between">
                  <div className="mb-4">
                      <label htmlFor="firstName" className="block text-gray-700">Nom</label>
                      <input
                          id="firstName"
                          type="text"
                          {...register("name")}
                          className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Prénom"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>

                  <div className="mb-4">
                      <label htmlFor="phoneNumber" className="block text-gray-700">Numéro de téléphone</label>
                      <input
                          id="phoneNumber"
                          type="tel"
                          {...register("phoneNumber")}
                          className={`mt-1 block w-full px-3 py-2 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="Numéro de téléphone"
                      />
                      {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                  </div>
              </div>
              <div className="text-right flex justify-between">
                  <button type="button"
                    className="bg-gray-300 text-gray-800 p-2 px-4 rounded-md hover:bg-gray-400 ml-2"
                    onClick={() => navigate("/customers")}>
                      Annuler
                  </button>

                  <button type="submit" className="bg-indigo-600 text-white p-2 px-4 rounded-md hover:bg-indigo-700"
                          disabled={isLoading}>
                      {isLoading ? "Enregistrement..." : "Enregistrer"}
                  </button>

              </div>
          </form>
      </div>
  );
};

export default CreateCustomer;
