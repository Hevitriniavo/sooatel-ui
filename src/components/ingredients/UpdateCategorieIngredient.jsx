

const UpdateCategorieIngredient = ({onSave, onCancel, setCategoryToEdit, categoryToEdit }) => {

    return (
        <div className="p-6">
            <input
                type="text"
                value={categoryToEdit.name || ''}
                onChange={(e) => setCategoryToEdit({...categoryToEdit, name: e.target.value})}
                className="p-2 border outline-none focus:border-blue-500  border-gray-300 rounded-md w-full mb-4"
            />
            <div className="flex justify-between">

                <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Annuler
                </button>

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={onSave}
                >
                    Sauvegarder
                </button>
            </div>
        </div>

    );
};

export default UpdateCategorieIngredient;