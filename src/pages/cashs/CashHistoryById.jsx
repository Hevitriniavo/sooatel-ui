import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { convertMethodToPayment } from "../../services/convertMethodToPayment";
import { convertDepositWithdraw } from "../../services/convertStatus";

function CashHistoryById() {
  const [cashDetails, setCashDetails] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("ID de l'historique non fourni.");
      return;
    }

    const url = apiUrl(`/histories/${id}`);
    fetchJson(url)
      .then((data) => {
        setCashDetails(data);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setError("Erreur lors de la récupération des détails du cash by id.");
      });
  }, [id]);

  if (!cashDetails) {
    return <div>Chargement des détails...</div>;
  }

  return (
    <div className="p-8">
      {error && (
        <div className="bg-red-300 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      {!error && (
        <>
          <h3 className="text-md font-semibold mt-4">
            Liste des historiques dans la caisse par id:
          </h3>
          <ul className="h-auto border border-collapse p-4">
            <li key={cashDetails.id} className="flex flex-col gap-2">
              <p>
                <strong>Type de transaction:</strong>{" "}
                {convertDepositWithdraw(cashDetails.transactionType)}
              </p>
              <p>
                <strong>Méthode de paiement:</strong>{" "}
                {convertMethodToPayment(cashDetails.modeOfTransaction)}
              </p>
              <p>
                <strong>Prix:</strong> {cashDetails.amount} Ar
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {dayjs(cashDetails.transactionDate).format("YYYY-MM-DD HH:mm")}
              </p>
              <p>
                <strong>Description:</strong> {cashDetails.description}
              </p>
            </li>
            <button
              onClick={() => navigate("/history")}
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 relative top-3"
            >
              Retour vers l&apos;historique
            </button>
          </ul>
        </>
      )}
    </div>
  );
}

export default CashHistoryById;
