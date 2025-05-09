import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { MdDelete } from 'react-icons/md';
import { apiUrl } from '../../../services/api';
import useToast from '../menu-orders/(tantely)/hooks/useToast';



const AddIngredientsToMenu = ({ onAddIngredients, ingredients, closeModal }) => {
    const [ingredientQuantities, setIngredientQuantities] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [selectedForDeletion, setSelectedForDeletion] = useState([]);

    const { showError, showSuccess } = useToast()
    const { menuId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setIngredientQuantities([]);
    }, [ingredients]);


    const addIngredient = () => {
        if (!selectedIngredient || !quantity || parseFloat(quantity) <= 0) {
            showError('Sélectionnez un ingrédient et entrez une quantité valide.');
            return;
        }

        const existingIngredient = ingredientQuantities.find(iq => iq.ingredientId === selectedIngredient.id);

        if (existingIngredient) {
            const updatedIngredients = ingredientQuantities.map(iq =>
                iq.ingredientId === selectedIngredient.id
                    ? { ...iq, quantity: iq.quantity + parseFloat(quantity) }
                    : iq
            );

            setIngredientQuantities(updatedIngredients);
        } else {
            const newIngredient = {
                ingredientId: selectedIngredient.id,
                name: selectedIngredient.name,
                quantity: parseFloat(quantity),
            };

            setIngredientQuantities([...ingredientQuantities, newIngredient]);
        }

        setSelectedIngredient(null);
        setQuantity('');
    };


    const toggleDeleteMode = (ingredientId) => {
        if (selectedForDeletion.includes(ingredientId)) {
            setSelectedForDeletion(selectedForDeletion.filter(id => id !== ingredientId));
        } else {
            setSelectedForDeletion([...selectedForDeletion, ingredientId]);
        }
    };

    const handleIngredientClick = (ingredientId) => {
        toggleDeleteMode(ingredientId);
    };

    const onSubmit = async (e) => {

        e.preventDefault()

        if (!menuId || ingredientQuantities.length === 0) {
            showError('Veuillez sélectionner un menu et ajouter au moins un ingrédient.');
            return;
        }



        const menuIngredientsData = {
            menuId: parseInt(menuId, 10),
            ingredients: ingredientQuantities.map(({ ingredientId, quantity }) => ({
                ingredientId,
                quantity,
            })),
        };

        try {
            const response = await fetch(apiUrl('/menus/add-ingredients'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuIngredientsData),
            });

            if (response.ok) {
                showSuccess('Ingrédients ajoutés avec succès !');
                onAddIngredients();
                closeModal();
                navigate(`/menu-ingredients/menu/${menuId}`);
            } else {
                showError('Erreur lors de l’ajout des ingrédients au menu.');
            }
        } catch {
            showError('Erreur lors de l’envoi des données.');
        }
    };

    const removeSelectedIngredients = () => {
        setIngredientQuantities(ingredientQuantities.filter(iq => !selectedForDeletion.includes(iq.ingredientId)));
        setSelectedForDeletion([]);
    };


    const handleQuantityChange = (e, ingredientId) => {
        const updatedQuantity = parseFloat(e.target.value);

        if (isNaN(updatedQuantity) || updatedQuantity < 0) {
            return;
        }

        const updatedIngredients = ingredientQuantities.map(ingredient =>
            ingredient.ingredientId === ingredientId
                ? { ...ingredient, quantity: updatedQuantity }
                : ingredient
        );

        setIngredientQuantities(updatedIngredients);
    };

    return (
        <form onSubmit={onSubmit}>
            <h1 className="text-2xl font-bold mb-4">Gestion des ingrédients de menus</h1>

            <div className="flex flex-row gap-2 border-b-[1px] pb-5 items-center">
                <Autocomplete
                    options={ingredients}
                    getOptionLabel={(option) => option.name || ''}
                    value={selectedIngredient}
                    onChange={(event, newValue) => setSelectedIngredient(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Ingrédient"
                            placeholder="Sélectionnez un ingrédient..."
                        />
                    )}
                    sx={{
                        width: '300px',
                        height: '50px',
                        '.MuiInputBase-root': { height: '40px' },
                    }}
                />
                <TextField
                    id="outlined-number"
                    label="Quantité"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{
                        width: '150px',
                        height: '50px',
                        '.MuiInputBase-root': { height: '40px' },
                    }}
                />


                <button
                    type="button"
                    onClick={addIngredient}
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 mb-2"
                >
                    Ajouter l&apos;ingrédient
                </button>
            </div>
            <div>
                <ul className="mt-4 pb-5">
                    {ingredientQuantities.map((ingredient) => (
                        <li
                            key={ingredient.ingredientId}
                            className={`flex items-center cursor-pointer hover:bg-gray-100 text-center dark:hover:bg-gray-600${selectedForDeletion.includes(ingredient.ingredientId) ? 'bg-gray-200' : ''
                                } transition-all`}
                            onClick={() => handleIngredientClick(ingredient.ingredientId)}
                        >
                            <input
                                type="checkbox"
                                className="mr-2 dark:hover:bg-gray-600"
                                checked={selectedForDeletion.includes(ingredient.ingredientId)}
                                onChange={() => toggleDeleteMode(ingredient.ingredientId)}
                            />
                            {ingredient.name} -
                            <input
                                type="number"
                                min="0"
                                value={ingredient.quantity}
                                className="mx-2 border px-2 py-1 rounded w-[6em] focus:outline-1 focus:outline-blue-600"
                                onChange={(e) => handleQuantityChange(e, ingredient.ingredientId)}
                            />

                            {selectedForDeletion.includes(ingredient.ingredientId) && (
                                <button
                                    type="button"
                                    onClick={removeSelectedIngredients}
                                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                                >
                                    <MdDelete />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>

            </div>


            <div className="mt-4 flex flex-wrap flex-row justify-between z-50">
                <button type="button" onClick={closeModal} className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 ml-2">
                    Annuler
                </button>

                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
                    Soumettre
                </button>
            </div>

        </form>
    );
};

export default AddIngredientsToMenu;
