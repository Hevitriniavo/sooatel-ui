import {convertStatusMenu} from "../../services/convertStatus.js";


const UpdateStatusMenu = ({status, statuses, setStatus,  onSave, onCancel}) => {
    return (
        <div className="p-8 z-[100]">
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border outline-none focus:border-blue-500 p-2 rounded-md w-full mb-4"
            >
                {statuses.map(status => (
                    <option key={status} value={status}>
                        {convertStatusMenu(status.toLowerCase())}
                    </option>
                ))}
            </select>
            <div className="flex justify-end">
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
                    onClick={onSave}
                >
                    Sauvegarder
                </button>
                <button
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                    onClick={onCancel}
                >
                    Annuler
                </button>
            </div>
        </div>
    )
}

export default UpdateStatusMenu
