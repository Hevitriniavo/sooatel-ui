import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import dayjs from "dayjs";
import { truncate } from "../../services/truncate.js";
import { MdInfoOutline } from "react-icons/md";

function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(8);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error] = useState(null);

  useEffect(() => {
    const url = `${apiUrl("/purchases")}?size=${size}&page=${
      page - 1
    }&startDate=${startDate}&endDate=${endDate}`;
    fetchJson(url)
      .then((d) => {
        setPurchases(d.items || []);
      })
      .catch((e) => console.log(e));
  }, [size, page, startDate, endDate]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = purchases.reduce(
      (sum, item) => sum + item.quantity * item.cost,
      0
    );
    setTotalPrice(total);
  }, [purchases]);

  return (
    <div className="w-full p-4 bg-gray-100 darkBody pr-14 sm:pr-10 md:pr-6 lg:pr-14">
      {error && (
        <div className="bg-red-300 text-red-700 p-2 rounded mb-4">{error}</div>
      )}

      <div className="relative flex gap-4 items-center mb-4 flex-col sm:flex-row sm:mb-6 md:mb-8 lg:mb-10">
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onBlur={() => document.activeElement.blur()}
          className="border border-gray-300 p-2 rounded-md sm:mr-4 outline-none"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onBlur={() => document.activeElement.blur()}
          className="border border-gray-300 p-2 rounded-md outline-none"
        />
        <p className="mt-4 sm:mt-0 sm:ml-3 text-xl font-semibold">
          Prix total : {totalPrice} Ar
        </p>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg darkBody sm:px-6 md:px-8 lg:px-10">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Nom Ingrédient</th>
              <th className="py-2 px-4">Quantité</th>
              <th className="py-2 px-4">Coût</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Créé à</th>
              <th className="py-2 px-4">Mis à jour à</th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases
                .toSorted((a, b) => b.id - a.id)
                .map((purchase) => (
                  <tr
                    key={purchase.purchaseId}
                    className="border-b border-gray-200"
                  >
                    <td className="py-2 px-4">{purchase.ingredientName}</td>
                    <td className="py-2 px-4">{purchase.quantity}</td>
                    <td className="py-2 px-4">{purchase.cost} Ar</td>
                    <td className="py-2 px-4">
                      {truncate(purchase.description, 10)}
                    </td>
                    <td className="py-2 px-4">
                      {dayjs(purchase.createdAt).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td className="py-2 px-4">
                      {dayjs(purchase.updatedAt).format("YYYY-MM-DD HH:mm")}
                    </td>
                  </tr>
                ))
            ) : (
              <tr className="text-center">
                <td colSpan="6" className="py-4 text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                    Aucune donnée disponible
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => p - 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PurchaseList;
