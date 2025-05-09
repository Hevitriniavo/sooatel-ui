import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import dayjs from 'dayjs';

function Operation() {
  const [operations, setOperations] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [stockId, setStockId] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const url = `${apiUrl("/operations")}?size=${size}&page=${page - 1}&stockId=${stockId}&type=${type}&startDate=${startDate}&endDate=${endDate}`;
    fetchJson(url)
      .then((d) => {
        setOperations(d.items || []);
      })
      .catch((e) => console.log(e));
      
  }, [size, page, stockId, type, startDate, endDate]);


  useEffect(() => {
     setPage(1)
  }, [stockId, type, startDate, endDate]);




  return (
    <div className="w-[989px] p-4 bg-gray-100 flex flex-col">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setPage((p) => p - 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>

      <div className="flex gap-4 items-center py-4 bg-gray-100 rounded-lg">
        <input
          type="number"
          value={stockId}
          onChange={(e) => setStockId(e.target.value)}
          placeholder="Stock ID"
          className="border border-gray-300 p-2 rounded-lg"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        >
          <option value="" disabled>Sélectionnez le type d'opération</option>
          <option value="INITIAL">Initial</option>
          <option value="SORTIE">Sortie</option>
          <option value="ENTRY">Entrée</option>
        </select>

        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
        />

      </div>

      <div className="flex-grow overflow-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-2 px-4">Id</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Description</th>
            </tr>
          </thead>
          <tbody>
            {operations.length > 0 ? (
              operations.map((o) => (
                <tr key={o.id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{o.id}</td>
                  <td className="py-2 px-4">{o.type.toLowerCase()}</td>
                  <td className="py-2 px-4">{dayjs(o.date).format('YYYY-MM-DD HH:mm')}</td>
                  <td className="py-2 px-4">
                    {o.description.length >= 100
                      ? o.description.slice(0, 100) + " ..."
                      : o.description}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Operation;
