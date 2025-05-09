import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import { TextField, Autocomplete, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MdEdit } from "react-icons/md";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function OperationStatistics() {
  const [totalStocks, setTotalStocks] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [minTotalQuantity, setMinTotalQuantity] = useState(null);
  const [ingredientId, setIngredientId] = useState(null);
  const [date, setDate] = useState(null);
  const [maxTotalQuantity, setMaxTotalQuantity] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams();

      if (ingredientId !== null && ingredientId !== undefined) {
        queryParams.append("ingredientId", ingredientId);
      }

      if (minTotalQuantity !== null && minTotalQuantity !== undefined) {
        queryParams.append("minTotalQuantity", minTotalQuantity);
      }

      if (maxTotalQuantity !== null && maxTotalQuantity !== undefined) {
        queryParams.append("maxTotalQuantity", maxTotalQuantity);
      }

      if (date) {
        queryParams.append("date", date);
      }
      const url = `${apiUrl(
        "/operations/statistic"
      )}?${queryParams.toString()}`;

      try {
        const data = await fetchJson(url);
        setTotalStocks(data);
      } catch (error) {
        console.error("Error fetching operation statistics", error);
      }
    };

    void fetchData();
  }, [ingredientId, maxTotalQuantity, minTotalQuantity, date]);

  useEffect(() => {
    (async () => {
      const url = apiUrl("/ingredients/all");
      try {
        const data = await fetchJson(url);
        setIngredients(data);
      } catch (error) {
        console.error("Error fetching ingredients", error);
      }
    })();
  }, []);

  const chartData = {
    labels: totalStocks.map((stock) => stock.ingredientName),
    datasets: [
      {
        label: "Quantité Disponible",
        data: totalStocks.map((stock) => stock.totalQuantity),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container bg-white w-[1009px] darkBody mx-auto p-10 pb-14">
      <h2 className="text-xl font-semibold mb-4">
        Statistiques des Opérations
      </h2>

      <div className="flex gap-4 mb-4">
        <Autocomplete
          options={ingredients}
          getOptionLabel={(option) => option.name || "Nom indisponible"}
          className="w-[20%]"
          onChange={(_e, v) => setIngredientId(v?.id ?? null)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Nom de l'ingrédient"
              variant="outlined"
              fullWidth
            />
          )}
        />

        <input
          type="number"
          value={minTotalQuantity || ""}
          onChange={(e) =>
            setMinTotalQuantity(e.target.value ? Number(e.target.value) : "")
          }
          placeholder="Quantité min"
          className="border  outline-none focus:border-blue-500 border-gray-300 p-2 rounded-lg"
        />

        <input
          type="number"
          value={maxTotalQuantity || ""}
          onChange={(e) =>
            setMaxTotalQuantity(e.target.value ? Number(e.target.value) : "")
          }
          placeholder="Quantité max"
          className="border outline-none focus:border-blue-500 border-gray-300 p-2 rounded-lg"
        />
        <input
          type="date"
          value={date || ""}
          onChange={(e) => setDate(e.target.value)}
          className="border outline-none focus:border-blue-500 border-gray-300 p-2 rounded-lg"
        />
      </div>

      <div className="mb-6 w-[calc(100%-100px)] sm:w-[calc(100%-50px)] md:w-[calc(100%-70px)] lg:w-[calc(100%-90px)] xl:w-[calc(100%-100px)]">
        {totalStocks.length ? (
          <Bar data={chartData} options={{ responsive: true }} />
        ) : (
          <Typography variant="body1" textAlign="center" color="textSecondary">
            Aucune donnée disponible pour l&apos;instant.
          </Typography>
        )}
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg darkBody">
        <thead className="bg-gray-200 text-gray-700 ">
          <tr>
            <th className="py-2 px-4">Ingrédient</th>
            <th className="py-2 px-4">Quantité Totale</th>
          </tr>
        </thead>
        <tbody>
          {totalStocks.length > 0 ? (
            totalStocks.map((stock) => (
              <tr
                key={stock.ingredientName}
                className="border-b border-gray-200"
              >
                <td className="py-2 px-4 text-center">
                  {stock.ingredientName}
                </td>
                <td
                  className={`py-2 px-4 flex flex-row text-center justify-center ${
                    stock.totalQuantity <= 10 ? "text-red-500 text-[14px]" : ""
                  }`}
                >
                  {stock.totalQuantity <= 10 ? (
                    <div className="flex items-center gap-1 w-32">
                      ⚠️ <MdEdit />
                      {stock.totalQuantity}
                      stock faible
                    </div>
                  ) : (
                    stock.totalQuantity
                  )}
                  (en {stock.unitAbbreviation})
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="py-4 text-center text-gray-500">
                Aucune donnée disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OperationStatistics;
