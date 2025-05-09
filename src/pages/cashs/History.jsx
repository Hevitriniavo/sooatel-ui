import { useEffect, useState } from "react";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";
import { apiUrl, fetchJson } from "../../services/api";
import { MdInfoOutline } from "react-icons/md";
import { convertDepositWithdraw } from "../../services/convertStatus";
import { convertMethodToPayment } from "../../services/convertMethodToPayment";
import { truncate } from "../../services/truncate";
import { BiSolidShow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [histories, setHistories] = useState([]);
  const { showError } = useToast();
  const navigate = useNavigate()

  useEffect(() => {
    const url = `${apiUrl("/histories")}`;
    fetchJson(url)
      .then((data) => {
        setHistories(data);
      })
      .catch((error) => {
        console.error(error);
        showError("Erreur lors de la récupération des détails de la cash.");
      });
  }, []);

  const handleClick= (id) =>{
    navigate(`/history/${id}`)
  }

  return (
    <div className="container mx-auto pr-14 pl-6 darkBody bg-white">
     <div className="flex flex-row gap-4">
     <h1 className="text-2xl font-bold mb-4">Liste des historiques</h1>
      <button
        onClick={() => navigate("/cashs")}
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
      >
       Retour vers caisse
      </button>
     </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden darkBody">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 px-4">Date</th>
            <th className="p-2 px-4">Montant (Ar)</th>
            <th className="p-2 px-4">Type de Transaction</th>
            <th className="p-2 px-4">Mode de Paiement</th>
            <th className="p-2 px-4">Description</th>
            <th className="p-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {histories.length > 0 ? (
            histories
            .toSorted((a, b) => b.id - a.id)
            .map((history, i) => (
              <tr key={i} className="border hover:bg-gray-100 transition-all">
                <td className="p-3 border">
                  {new Date(history.transactionDate).toLocaleString()}
                </td>
                <td className="p-3 border font-semibold">
                  {history.amount} Ar
                </td>
                <td className="p-3 border">
                  {convertDepositWithdraw(history.transactionType)}
                </td>
                <td className="p-3 border">
                  {convertMethodToPayment(history.modeOfTransaction)}
                </td>
                <td className="p-3 border">
                  {truncate(history.description || "N/A", 15)}
                </td>
                <td className="py-2 px-4 flex flex-row justify-center gap-2">
                  <button
                    className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                    onClick={() => handleClick(history.id)}
                  >
                    <BiSolidShow />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center  w-full ">
                <div className="flex w-full justify-center items-center flex-col">
                  <MdInfoOutline className="text-4xl inline-block mb-2 text-gray-400" />
                  <span>Aucune catégorie trouvée</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default History;
