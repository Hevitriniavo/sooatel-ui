

const EditFloor = ({ floorToEdit, setFloorToEdit, onSave, onCancel }) => {
    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-4">{floorToEdit.id ? 'Modifier' : 'Créer'} un Floor</h2>
            <div>
                <label htmlFor="floorNumber">N° de l'étage:</label>
                <input
                    id="floorNumber"
                    type="number"
                    placeholder="Numéro de l'étage"
                    value={floorToEdit.floorNumber || ''}
                    onChange={(e) => setFloorToEdit({ ...floorToEdit, floorNumber: e.target.value })}
                    className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
                />
            </div>
            <div>
                <label htmlFor="description">Déscription:</label>
                <textarea
                    id="description"
                    type="text"
                    placeholder="description"
                    value={floorToEdit.description || ''}
                    onChange={(e) => setFloorToEdit({ ...floorToEdit, description: e.target.value })}
                    className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
                />
            </div>

            <div className="flex justify-between">

                <button
                    className="bg-red-300 text-gray-800 py-2 px-4 rounded-md hover:bg-red-400"
                    onClick={onCancel}
                >
                    Annuler
                </button>

                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    onClick={onSave}
                >
                    Enregistrer
                </button>
            </div>
        </div>
    );
};

export default EditFloor;
