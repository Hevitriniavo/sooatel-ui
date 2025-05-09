import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import dayjs from 'dayjs';
import { convertMethodToPayment } from "../../services/convertMethodToPayment";
import { convertDepositWithdraw } from "../../services/convertStatus";

function CashHistory({ onClose }) {
  const [cashDetails, setCashDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showScrollbar, setShowScrollbar] = useState(false);

  useEffect(() => {
    const url = `${apiUrl("/histories")}`;
    fetchJson(url)
      .then((data) => {
        setCashDetails(data);
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setError("Erreur lors de la récupération des détails de la cash.");
      });
  }, []);


  if (!cashDetails) {
    return <div>Chargement des détails...</div>;
  }

  return (
    <div className="p-8 pt-0 sm:p-6 sm:pt-4 md:p-4 md:pt-2 lg:p-8 lg:pt-0">
        {error && <div className="bg-red-300 text-red-700 p-2 rounded mb-4">{error}</div>}
        {!error && (
          <>
            <h3 className="text-md font-semibold mb-4">Liste des hostoriques dans le caisse :</h3>
            <ul className="h-[300px] overflow-y-auto scrollbar-custom border border-collapse p-4"
             onMouseEnter={() => setShowScrollbar(true)}
             onMouseLeave={() => setShowScrollbar(false)}
             style={{
               scrollbarWidth: showScrollbar ? 'thin' : 'none',
               overflowY: showScrollbar ? 'scroll' : 'hidden'
             }}>
              {cashDetails.map((cash) => (
                <li key={cash.id} className="border-b border-gray-300 py-2 sm:py-1 md:py-2 lg:py-3">
                    <p><strong>Type de transaction:</strong> {convertDepositWithdraw(cash.transactionType)}</p>
                    <p><strong>Methode de payment:</strong> {convertMethodToPayment(cash.modeOfTransaction)}</p>
                  <p><strong>Prix:</strong> {cash.amount}</p>
                  <p><strong>Date:</strong> {dayjs(cash.transactionDate).format('YYYY-MM-DD HH:mm')}</p>
                  <p><strong>Description:</strong> {cash.description}</p>
                </li>
              ))}
            </ul>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Fermer
        </button>
      </div>
  );
}

export default CashHistory;
