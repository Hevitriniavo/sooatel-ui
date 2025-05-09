import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiUrl, fetchJson } from '../../services/api';
import useToast from '../menus/menu-orders/(tantely)/hooks/useToast';
import { convertMethodToPayment } from '../../services/convertMethodToPayment';
import { getArticle } from '../../services/getArticle';

const schema = z.object({
  quantity: z.string().refine((val) => parseFloat(val) > 0, {
    message: "La quantité doit être supérieure à zéro",
  }),
  cost: z.string().refine((val) => parseFloat(val) > 0, {
    message: "Le coût doit être supérieur à zéro",
  }),
  description: z.string().max(255, "La description ne doit pas dépasser 255 caractères").optional(),
  method: z.string().min(1, "La méthode de paiement est requise"),
});

function CreateStock({ onStockCreated, createStockModale, ingredientId, ingredientName }) {
  const { register, handleSubmit,  watch, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const [methods, setMethods] = useState([])
  const { showSuccess, showError } = useToast()
  const quantity = watch("quantity") || "0";
  const cost = watch("cost") || "0";

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await fetchJson(apiUrl("/payments/method"));
        setMethods(data); 
      } catch {
        showError("Failed to fetch payment methods");
      }
    };
    fetchPaymentMethods();

    if (ingredientId) {
      setValue("ingredientId", ingredientId);
    }
  }, [ingredientId, setValue]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      ingredientId,
      quantity: parseFloat(data.quantity),
      cost: parseFloat(data.cost)
    };
    
    try {
      const url = apiUrl("/stocks/add");
      await fetchJson(url,
        'POST',
        formattedData
      );

      showSuccess("Stock ajouté avec succès !");
      onStockCreated?.();
      reset();
    } catch (error) {
      if (error) {
        const jsonErr = JSON.parse(error.message);
        const message = jsonErr?.message;
        showError(message || "Fonds insuffisants pour ce retrait.");
      } else {
        showError("Erreur lors de l'ajout du stock.");
      }

      console.error(error);
    }
  };

  const calculateTotal = () => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(cost) || 0;
    return (qty * price).toFixed(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-8">
      <div className='flex flex-row gap-20'>
        <div>
          <label htmlFor="ingredient" className="block text-gray-700">Ingrédient</label>
          <input
            id="ingredient"
            type="text"
            value={ingredientName}
            readOnly
            className={`block w-full p-2 border rounded-md ${errors.ingredientId ? 'border-red-500' : 'border-gray-300'}`}
          />
          <input
            type="hidden"
            value={ingredientId}
            {...register("ingredientId", { required: true })}
          />
          {errors.ingredientId && <p className="text-red-500">{errors.ingredientId.message}</p>}
        </div>

        <div>
          <label htmlFor="method" className="block text-gray-700">Forme de paiement</label>
          {methods.length > 0 ? (
            <select
              id="method"
              {...register("method")}
              className={`block w-full p-2 border rounded-md ${errors.method ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option disabled value="">Sélectionner une méthode</option>
              {methods.map(item => (
                <option value={item} key={item}> {convertMethodToPayment(item)}</option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500">Aucune méthode de paiement disponible</p>
          )}
          {errors.method && <p className="text-red-500">{errors.method.message}</p>}
        </div>

      
      </div>
      <div className='flex flex-row gap-20'>
        <div>
          <label htmlFor="quantity" className="block text-gray-700">Quantité</label>
          <input
            id="quantity"
            type="text"
            {...register("quantity")}
            className={`block w-full p-2 border rounded-md ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
        </div>

        <div>
          <label htmlFor="cost" className="block text-gray-700">Prix Unitaire</label>
          <input
            id="cost"
            type="text"
            {...register("cost")}
            className={`block w-full p-2 border rounded-md ${errors.cost ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.cost && <p className="text-red-500">{errors.cost.message}</p>}
        </div>
      </div>


      <div>
        <label htmlFor="description" className="block text-gray-700">Description (facultatif)</label>
        <textarea
          id="description"
          type="text"
          {...register("description")}
          className={`block w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>
      <div className="mt-2 text-gray-800 font-semibold">
        Total prix {getArticle(ingredientName)} {calculateTotal()} Ar
      </div>

      <div className="flex flex-row gap-44">
        <button
          type="button"
          onClick={createStockModale}
          className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
        >
          Annuler
        </button>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Soumettre
        </button>
      </div>
    </form>
  );
}

export default CreateStock;
