import  { useState } from 'react';
import { apiUrl } from '../../services/api';
import useToast from "../menus/menu-orders/(tantely)/hooks/useToast.jsx";

const CreateFloor = ({ onCreate, closeModal }) => {
    const [floorNumber, setFloorNumber] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {showSuccess, showError}= useToast()

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!floorNumber || !description) {
            setErrorMessage('Tous les champs doivent être remplis.');
            showError('Tous les champs doivent être remplis.');
            return;
        }

        const nouveauFloor = {
            floorNumber,
            description,
        };
        setIsLoading(true);
        try {
            const response = await fetch(apiUrl('/floors'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nouveauFloor),
            });

            if (response.ok) {
                const createdFloor = await response.json();
                onCreate(createdFloor); 
                setFloorNumber('');
                setDescription('');
                setErrorMessage('');
                showSuccess('L\'étage a été créé avec succès !');
            } else {
                console.error('Erreur lors de la création du floors');
                setErrorMessage('Erreur lors de la création du floors.');
                showError('Erreur lors de la création du floors.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
            setErrorMessage('Erreur lors de l\'envoi des données.');
            showError('Erreur lors de l\'envoi des données.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
                <input
                    type="number"
                    placeholder="Numéro de l'étage"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 border outline-none focus:border-blue-500 border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-3 border outline-none focus:border-blue-500 py-2  border-gray-300 rounded"
                />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {isLoading && <p>Loading...</p>}
            <div className="flex justify-between mt-4">

                <button type="button" onClick={closeModal}
                        className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600">
                    Annuler
                </button>
                <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
                    Créer
                </button>
            </div>
        </form>
    );
};

export default CreateFloor;
