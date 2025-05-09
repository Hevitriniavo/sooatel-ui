import { convertStatusToReservation} from "../../services/convertStatus.js";


const UpdateStatusReservation = ({status, statuses, setStatus,  onSave, onCancel}) => {
    return (
        <div className="p-6 z-[100]">
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border outline-none focus:border-blue-500 p-2 rounded-md w-full mb-4"
            >
                {statuses.map(status => (
                    <option key={status} value={status}>
                        {convertStatusToReservation(status.toLowerCase())}
                    </option>
                ))}
            </select>
            <div className="flex justify-between">
                <button
                    className="bg-red-300 text-gray-800 py-2 px-4 rounded-md hover:bg-red-400"
                    onClick={onCancel}
                >
                    Annuler
                </button>

                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
                    onClick={onSave}
                >
                    Sauvegarder
                </button>
            </div>
        </div>
    )
}

export default UpdateStatusReservation
