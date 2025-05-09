import {apiUrl, fetchJson} from "../../services/api.js";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import useToast from "../menus/menu-orders/(tantely)/hooks/useToast.jsx";

const unitSchema = z.object({
    name: z.string().min(1, "Le nom de l'unité est requis"),
    abbreviation: z.string().min(1, "L'abréviation est requise"),
});

function CreateUnit({isModalOpen, setIsModalOpen, onCreate}) {
    const {  showError } = useToast();
    const {
        register: registerUnit,
        handleSubmit: handleSubmitUnit,
        formState: { errors: unitErrors },
        reset: resetUnitForm,
    } = useForm({
        resolver: zodResolver(unitSchema),
    });
    const onSubmitUnit = async (data) => {
        try {
            const savedUnit = await fetchJson(apiUrl("/units"), 'POST', data);
            await onCreate(savedUnit)
            setIsModalOpen(false);
            resetUnitForm();
        } catch (error) {
            console.error('Erreur lors de la soumission de l\'unité:', error);
            showError('Erreur lors de la création de l\'unité.');
        }
    };

    if (!isModalOpen)
        return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="CreateModal bg-white p-6 rounded-md shadow-md w-[90%] sm:w-[400px] md:w-[500px]" >
                <h2 className="text-xl mb-4">Créer une nouvelle unité</h2>
                <form onSubmit={handleSubmitUnit(onSubmitUnit)}>
                    <div className="mb-4">
                        <label htmlFor="unitName" className="block text-gray-700">Nom de l&apos;unité</label>
                        <input
                            id="unitName"
                            type="text"
                            {...registerUnit("name")}
                            className={`mt-1 block  focus:border-blue-500 w-full p-2 outline-none border rounded-md ${unitErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {unitErrors.name && <p className="text-red-500 text-sm">{unitErrors.name.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="abbreviation" className="block text-gray-700">Abréviation</label>
                        <input
                            id="abbreviation"
                            type="text"
                            {...registerUnit("abbreviation")}
                            className={`mt-1 block w-full p-2 border outline-none focus:border-blue-500 rounded-md ${unitErrors.abbreviation ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {unitErrors.abbreviation &&
                            <p className="text-red-500 text-sm">{unitErrors.abbreviation.message}</p>}
                    </div>
                    <div className="flex flex-row gap-4 sm:gap-8 lg:gap-16 xl:gap-44">

                        <button type="button" onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400">
                            Annuler
                        </button>
                        <button type="submit" className="bg-blue-500 text-white p-2 px-4 rounded-md hover:bg-blue-600">
                            Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUnit;