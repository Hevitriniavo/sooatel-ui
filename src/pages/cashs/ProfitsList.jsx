import { useState, useEffect } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";
import { convertMethodToPayment } from "../../services/convertMethodToPayment";

const ProfitsList = () => {
  const [profits, setProfits] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalMenuProfit, setTotalMenuProfit] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const {  showError } = useToast();

  useEffect(() => {
    fetchProfits();
    fetchTotalProfit();
    fetchTotalMenuProfit();
  }, [startDate, endDate]);

  const fetchProfits = async () => {
    let url = apiUrl("/profits");
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    try {
      const data = await fetchJson(url);
      setProfits(data);
    } catch (error) {
      showError("Erreur lors de la récupération des profits: " + error.message);
    }
  };

  const fetchTotalProfit = async () => {
    let url = apiUrl("/totalProfit");
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    try {
      const data = await fetchJson(url);
      setTotalProfit(data);
    } catch (error) {
      showError("Erreur lors de la récupération du bénéfice total: " + error.message);
    }
  };

  const fetchTotalMenuProfit = async () => {
    let url = apiUrl("/totalMenuSaleProfit");
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    try {
      const data = await fetchJson(url);
      setTotalMenuProfit(data);
    } catch (error) {
      showError("Erreur lors de la récupération du bénéfice des ventes: " + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg sm:max-w-xl sm:p-4 md:max-w-2xl md:p-5 lg:max-w-4xl lg:p-6">
      <h2 className="text-2xl font-semibold mb-4">Bénéfices par Méthode de Paiement</h2>
      <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
        <label className="block text-gray-700">Sélectionner une période :</label>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col sm:flex-row md:flex-col lg:flex-row">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
          <span className="self-center">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>
      </div>
      <table className="w-full border-collapse border border-gray-300 mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Méthode de Paiement</th>
            <th className="border p-2">Bénéfices</th>
          </tr>
        </thead>
        <tbody>
          {profits.map((profit, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{convertMethodToPayment(profit.modeOfTransaction)}</td>
              <td className={`border p-2 font-semibold ${profit.profitOrLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                {profit.profitOrLoss.toFixed(2)} Ar
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-lg font-semibold mt-4">Bénéfice Total: {totalProfit.toFixed(2)} Ar</h3>
      <h3 className="text-lg font-semibold mt-4">Bénéfice Total des Ventes de Menu: {totalMenuProfit.toFixed(2)} Ar</h3>
    </div>
  );
};

export default ProfitsList;
