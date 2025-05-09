
import { useForm } from 'react-hook-form';
import { apiUrl, fetchJson } from '../../services/api';
import useToast from '../menus/menu-orders/(tantely)/hooks/useToast';

const CreateCategorieIngredient = ({ onClose, onCategoryCreated }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {showError} = useToast()

    const onSubmit = async (data) => {
        try {
            await fetchJson(apiUrl("/ingredients/groups"), 'POST', data);
            onCategoryCreated();
            onClose();
        } catch {
            showError(`categorie ${data.name} existe déjà`)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='p-6 flex flex-col gap-4'>
            <div>
                <label htmlFor="name" className="block text-gray-700">Nom de la catégorie</label>
                <input
                    id="name"
                    type="text"
                    {...register("name", { required: 'Le nom est requis' })}
                    className={`mt-1 border outline-none focus:border-blue-500 block w-full p-2 rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className='flex flex-row justify-between gap-4'>

                <button type="button" onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                    Annuler
                </button>

                <button type="submit" className="bg-blue-500 text-white p-2 px-4 rounded-md hover:bg-blue-600">
                    Créer
                </button>
            </div>
        </form>

    );
};

export default CreateCategorieIngredient;
