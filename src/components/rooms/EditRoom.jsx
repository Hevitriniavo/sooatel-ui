

const EditRoom = ({ roomToEdit, setRoomToEdit, floors, onSave, onCancel }) => {
    return (
        <div className="p-8"> 
            <h2 className="text-xl font-bold mb-4">{roomToEdit.id ? 'Modifier' : 'Créer'} un Room</h2>
            <div>
                <label htmlFor="roomNumber">N° de la salle:</label>
                <input
                    id="roomNumber"
                    type="number"
                    placeholder="Numéro de la salle"
                    value={roomToEdit.roomNumber || ''}
                    onChange={(e) => setRoomToEdit({ ...roomToEdit, roomNumber: e.target.value })}
                    className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
                />
            </div>
            <div>
                <label htmlFor="capacity">Capacité:</label>
                <input
                    id="capacity"
                    type="number"
                    placeholder="capacité"
                    value={roomToEdit.capacity || ''}
                    onChange={(e) => setRoomToEdit({ ...roomToEdit, capacity: e.target.value })}
                    className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
                />
            </div>
            <div>
                <label htmlFor="price">Prix:</label>
                <input
                    id="price"
                    type="number"
                    placeholder="Prix"
                    value={roomToEdit.price || ''}
                    onChange={(e) => setRoomToEdit({ ...roomToEdit, price: e.target.value })}
                    className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
                />
            </div>
            <div>
                <label htmlFor="floorId">N° Etage</label>
                <select
                    id="floorId"
                    value={roomToEdit.floorId || ''}
                    onChange={(e) => {
                        setRoomToEdit({ ...roomToEdit, floorId: e.target.value })
                    }}
                    className="mb-4 border outline-none focus:border-blue-500 rounded-md p-2 w-full"
                >
                    <option value="">Sélectionner une étage</option>
                    {floors.map(floor => (
                        <option key={floor.id} value={floor.id}>{floor.floorNumber}</option>
                    ))}
                </select>
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

export default EditRoom;
