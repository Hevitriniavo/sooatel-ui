import {useEffect, useState} from "react";
import {apiUrl, fetchJson} from "../../services/api.js";
import CheckIcon from '@mui/icons-material/Check';
import formatDate from "../../services/formatDate.js";
import {Add, Delete, X} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate()


    const fetchData = async () => {
        try {
            const data = await fetchJson(apiUrl("/users"));
            setUsers(data);
        } catch {
            setError("Erreur lors du chargement des utilisateurs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchData()
    }, []);

    const confirmDelete = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        try {
            await fetchJson(apiUrl(`/users/${selectedUser.id}`), "DELETE");
            void fetchData()
        } catch (err) {
            console.log("Erreur lors de la suppression.", err);
        } finally {
            setShowModal(false);
            setSelectedUser(null);
        }
    };


    return (
        <div className="darkBody container pr-10 p-6 bg-white rounded-md ">
            <button
                onClick={() => navigate('/users/create')}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-700"
            >
                <Add/> Créer un utilisateur
            </button>

            <h1 className="text-2xl font-bold mb-4">Liste des Utilisateurs</h1>

            {loading ? (
                <p>Chargement...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : users.length === 0 ? (
                <p>Aucun utilisateur trouvé.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">ID</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Nom d&apos;utilisateur</th>
                        <th className="border border-gray-300 px-4 py-2">Créé le</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="text-center">
                            <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {formatDate(user.createdAt)}
                            </td>
                            <td className=" px-4  flex justify-center items-center py-2">
                                <button
                                    onClick={() => confirmDelete(user)}
                                    className="bg-red-500 text-white px-1 py-1 rounded hover:bg-red-700 transition flex items-center gap-1"
                                >
                                    <Delete/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96 DeleteModal">
                        <p className="text-center mb-4">Voulez-vous vraiment
                            supprimer <strong>{selectedUser?.username}</strong> ?</p>
                        <div className="flex justify-between gap-4">

                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-500 text-sm px-3 py-1 rounded hover:bg-red-400 flex items-center gap-2"
                            >
                                <X/>
                            </button>

                            <button
                                onClick={handleDelete}
                                className="text-white px-3 py-1 bg-green-400 rounded hover:bg-green-700 flex items-center gap-2"
                            >
                                <CheckIcon/>
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
