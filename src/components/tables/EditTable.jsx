

const EditTable = ({ tableToEdit, setTableToEdit, onSave, onCancel }) => {
    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-4">{tableToEdit.id ? 'Modifier' : 'Créer'} un Table</h2>
            <input
                type="number"
                placeholder="Numéro de la table"
                value={tableToEdit.number || ''}
                onChange={(e) => setTableToEdit({ ...tableToEdit, number: e.target.value })}
                className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
            />
            <input
                type="number"
                placeholder="Capacité de la table"
                value={tableToEdit.capacity || ''}
                onChange={(e) => setTableToEdit({ ...tableToEdit, capacity: e.target.value })}
                className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
            />

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

export default EditTable;
