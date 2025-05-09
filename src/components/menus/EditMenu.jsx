

const EditMenu = ({ menuToEdit, setMenuToEdit, categories, onSave, onCancel }) => {
    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-4">{menuToEdit.id ? 'Modifier' : 'Créer'} un Menu</h2>
            <input
                type="text"
                placeholder="Nom"
                value={menuToEdit.name || ''}
                onChange={(e) => setMenuToEdit({ ...menuToEdit, name: e.target.value })}
                className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
            />
            <input
                type="number"
                placeholder="Prix"
                value={menuToEdit.price || ''}
                onChange={(e) => setMenuToEdit({ ...menuToEdit, price: e.target.value })}
                className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
            />
            <textarea
                placeholder="Description"
                value={menuToEdit.description || ''}
                onChange={(e) => setMenuToEdit({ ...menuToEdit, description: e.target.value })}
                className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
            />
            <select
                value={menuToEdit.categoryId || ''}
                onChange={(e) => setMenuToEdit({ ...menuToEdit, categoryId: e.target.value })}
                className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
            >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <div className="flex justify-between">

                <button
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
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

export default EditMenu;
