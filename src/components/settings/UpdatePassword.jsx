import { useState } from "react";
import useToast from "../menus/menu-orders/(tantely)/hooks/useToast";
import { apiUrl, fetchJson } from "../../services/api";
import {useAuthStore} from "../../stores/useAuthStore.js";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";

export function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = useAuthStore(state => state.token)
  const logout = useAuthStore(state => state.logout)
  const [error, setError] = useState("");
  const [success, ] = useState("");
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (newPassword !== confirmPassword) {
      showError("Les mots de passe ne correspondent pas.")
      return;
    }
    const decoded = jwtDecode(token);
    try {
      const payload = {
        email: decoded.sub,
        oldPassword,
        newPassword,
        confirmPassword,
      }
       await fetchJson(apiUrl("/password/change"), 'POST', payload);
        showSuccess("Mot de passe mis à jour avec succès !")
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
       logout()
       navigate('/')

    } catch (err) {
      try {
        const errorResponse = JSON.parse(err.message);
        if (errorResponse.message) {
          showError(Object.values(errorResponse.message).join(" "));
        }
      } catch {
        showError("Une erreur réseau est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="darkBody bg-white p-6 rounded-lg shadow-md space-y-6 text-gray-500 mb-20"
    >
      <div>
        <h3 className="text-lg font-semibold">Mot de passe</h3>
        <p className="text-sm text-gray-500">Mettre à jour le mot de passe</p>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Ancien mot de passe</label>
          <input
            type="password"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="mt-1 block w-full focus:outline focus:outline-1 focus:outline-blue-600 p-2 border border-gray-300 rounded-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nouveau mot de passe</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block w-full focus:outline focus:outline-1 focus:outline-blue-600 p-2 border border-gray-300 rounded-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Confirmer le mot de passe</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full focus:outline focus:outline-1 focus:outline-blue-600 p-2 border border-gray-300 rounded-sm"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setError("");
          }}
          className="px-4 py-2 border border-gray-500 text-gray-500 rounded-md hover:bg-gray-100"
        >
          Réinitialiser le formulaire
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Mettre à jour
        </button>
      </div>
    </form>
  );
}
