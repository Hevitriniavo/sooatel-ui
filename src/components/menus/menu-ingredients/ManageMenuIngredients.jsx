import { useState, useEffect } from 'react';
import { apiUrl } from '../../../services/api';
import AddIngredientsToMenu from './AddIngredientsToMenu';
import { MdAddBox } from "react-icons/md";

const ManageMenuIngredients = ({ onAddIngredients}) => {
    const [ingredientsList, setIngredientsList] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch(apiUrl('/ingredients/all'));
                const data = await response.json();
                setIngredientsList(data);
            } catch (error) {
                setError('Erreur lors de la récupération des données');
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

    const handleAddIngredients = () => {
        onAddIngredients();  
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <p>Chargement en cours...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className=" MenuList">
            <button 
                onClick={openModal} 
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 flex flex-row items-center gap-2"
            >
                <MdAddBox /> Ajouter des ingrédients au menu
            </button>

            {isModalOpen && (
                <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="modal-content bg-white p-6 rounded shadow-lg relative CreateModal">
                        <button 
                            onClick={handleCloseModal} 
                            className="absolute top-0 right-0 px-4 p-2 hover:bg-red-400 hover:text-white text-gray-600 text-2xl"
                        >
                            X
                        </button>
                        <AddIngredientsToMenu 
                            onAddIngredients={handleAddIngredients} 
                            ingredients={ingredientsList} 
                            closeModal={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMenuIngredients;
