import { useEffect, useState } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdInfoOutline } from "react-icons/md";
import { apiUrl, fetchJson } from '../../services/api';
import CreateUnit from "./CreateUnit.jsx";
import useToast from "../menus/menu-orders/(tantely)/hooks/useToast.jsx";

function UnitsList() {
    const [units, setUnits] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [unitName, setUnitName] = useState('');
    const [unitAbbreviation, setUnitAbbreviation] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showSuccess, showError } = useToast();
    const [unitToDelete, setUnitToDelete] = useState(null);

    const fetchUnits = async () => {
        try {
            const data = await fetchJson(apiUrl("/units/all"));
            setUnits(data);
        } catch (error) {
            showError('Erreur lors de la récupération des unités: ' + error.message);
        }
    };

    useEffect(() => {
        void fetchUnits();
    }, []);

    const confirmDelete = (unitId) => {
        const unit = units.find(u => u.id === unitId);
        setUnitToDelete(unit);
        setShowDeleteModal(true);
    };
    
    const handleDelete = async () => {
        try {
            await fetch(apiUrl(`/units/${unitToDelete.id}`), {
                method: 'DELETE',
            });
            setShowDeleteModal(false);
            void fetchUnits();
            showSuccess("Unit supprimée avec succès.");
        } catch (error) {
            console.error('Erreur lors de la suppression de la unit:', error);
            showError("Erreur lors de la suppression de la unit.");
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setUnitToDelete(null);
    };

    const handleEdit = (unit) => {
        setSelectedUnit(unit.id);
        setUnitName(unit.name);
        setUnitAbbreviation(unit.abbreviation);
        setShowEditModal(true);
    };

    const handleUpdateUnit = async () => {
        try {
            await fetchJson(apiUrl(`/units`), 'PUT', {
                id: selectedUnit,
                name: unitName,
                abbreviation: unitAbbreviation
            });
            setShowEditModal(false);
            setSelectedUnit(null);
            fetchUnits();
            showSuccess('Unité mise à jour avec succès');
        } catch (error) {
            showError('Erreur lors de la mise à jour de l\'unité: ' + error.message);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleCreate = async (newUnit) => {
        setUnits(oldUnits => [
            ...oldUnits,
            newUnit
        ]);
        showSuccess('Unité créée avec succès');
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8 bg-white darkBody">
            <div className='flex flex-row gap-4 fixed z-50'>
                <button
                    className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ml-2"
                    onClick={toggleModal}
                >
                    Créer un unité
                </button>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden darkBody relative top-10 sm:top-19 md:top-14 lg:top-16">
                <thead>
                <tr className="bg-gray-200">
                    <th className="py-2 px-4">Nom</th>
                    <th className="py-2 px-4">Abréviation</th>
                    <th className="py-2 px-4">Action</th>
                </tr>
                </thead>
                <tbody className='darkBody'>
                {units.length === 0 ? (
                    <tr className="text-center">
                        <td colSpan="6" className="py-4 text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                                <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                                <p>Aucune unité disponible</p>
                            </div>
                        </td>
                    </tr>
                ) : (
                    units.toSorted((a, b) => b.id - a.id).map((unit) => (
                        <tr key={unit.id} className="hover:bg-gray-100 text-center">
                            <td className="py-2 px-4">{unit.name.toLowerCase()}</td>
                            <td className="py-2 px-4">{unit.abbreviation.toLowerCase()}</td>
                            <td className="py-2 px-4 flex flex-row gap-2 justify-center">
                                <button
                                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                                    onClick={() => handleEdit(unit)}
                                >
                                    <FaRegEdit />
                                </button>
                                <button
                                    className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
                                    onClick={() => confirmDelete(unit.id)}
                                >
                                    <MdDelete />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            <CreateUnit isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onCreate={handleCreate} />
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="DeleteModal bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center">
                        <p className="mb-6">Êtes-vous sûr de vouloir supprimer l&apos;unité {unitToDelete?.name} ?</p>
                        <div className="flex justify-between">
                            <button
                                className="bg-red-300 text-gray-800 py-2 px-4 rounded-md hover:bg-red-400"
                                onClick={cancelDelete}
                            >
                                Non
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleDelete}
                            >
                                Oui
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="EditModal bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center">
                        <h2 className="text-lg font-semibold mb-4">Modifier l&apos;unité</h2>
                        <input
                            type="text"
                            value={unitName}
                            onChange={(e) => setUnitName(e.target.value)}
                            placeholder="Nom de l'unité"
                            className="border outline-none focus:border-blue-500 border-gray-300 p-2 mb-4 w-full"
                        />
                        <input
                            type="text"
                            value={unitAbbreviation}
                            onChange={(e) => setUnitAbbreviation(e.target.value)}
                            placeholder="Abréviation de l'unité"
                            className="border outline-none focus:border-blue-500 border-gray-300 p-2 mb-4 w-full"
                        />
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                                onClick={() => setShowEditModal(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleUpdateUnit}
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UnitsList;
