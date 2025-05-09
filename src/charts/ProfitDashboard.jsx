import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import dayjs from "dayjs";
import { apiUrl } from "../services/api";
import { convertMethodToPayment } from "../services/convertMethodToPayment";
import CountUp from "react-countup";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend
);

export default function ProfitDashboard() {
    const [profits, setProfits] = useState([]);
    const [menuSaleProfits, setMenuSaleProfits] = useState([]);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalMenuProfit, setTotalMenuProfit] = useState(0);
    const [startDate, setStartDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const fetchData = async () => {
        try {
            const profitsRes = await fetch(apiUrl(`/profits?startDate=${startDate}&endDate=${endDate}`));
            const profitsData = await profitsRes.json();
            setProfits(profitsData);

            const menuSaleRes = await fetch(apiUrl(`/menuSaleProfits?startDate=${startDate}&endDate=${endDate}`));
            const menuSaleData = await menuSaleRes.json();
            setMenuSaleProfits(menuSaleData);

            const totalProfitRes = await fetch(apiUrl(`/totalProfit?startDate=${startDate}&endDate=${endDate}`));
            const totalProfitData = await totalProfitRes.json();
            setTotalProfit(totalProfitData);

            const totalMenuRes = await fetch(apiUrl(`/totalMenuSaleProfit?startDate=${startDate}&endDate=${endDate}`));
            const totalMenuData = await totalMenuRes.json();
            setTotalMenuProfit(totalMenuData);
        } catch (error) {
            console.error("Erreur lors du chargement des données", error);
        }
    };

    const barData = {
        labels: profits.map((item) => convertMethodToPayment(item.modeOfTransaction)),
        datasets: [
            {
                label: "Bénéfice / Perte (Ariary)",
                data: profits.map((item) => item.profitOrLoss),
                backgroundColor: profits.map((item) => (item.profitOrLoss < 0 ? "rgba(255, 99, 132, 0.6)" : "rgba(75, 192, 192, 0.6)")),
                borderColor: profits.map((item) => (item.profitOrLoss < 0 ? "rgba(255, 99, 132, 1)" : "rgba(75, 192, 192, 1)")),
                borderWidth: 1,
            },
        ],
    };

    const doughnutData = {
        labels: menuSaleProfits.map((item) => convertMethodToPayment(item.modeOfTransaction)),
        datasets: [
            {
                data: menuSaleProfits.map((item) => item.profitOrLoss),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="max-w-5xl mx-auto p-6 container">
            <h1 className="text-2xl font-bold text-center mb-6">Tableau de Bord des Bénéfices</h1>

            <div className="flex flex-col md:flex-row md:justify-between justify-center gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium">Date de début</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border rounded p-2 w-full md:w-auto"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Date de fin</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border rounded p-2 w-full md:w-auto"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold text-center mb-4">Bénéfices par Mode de Transaction</h2>
                    <Bar data={barData} />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-center mb-4">Ventes de Menu par Mode de Transaction</h2>
                    <div className="w-full sm:w-[15em]">
                        <Doughnut data={doughnutData} />
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    className={`p-4 rounded-lg text-center
                        ${totalProfit >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-900'}
                        dark:${totalProfit >= 0 ? 'bg-green-800 text-green-300' : 'bg-red-800 text-red-400'}`}
                >
                    <h3 className="text-lg font-medium">{totalProfit >= 0 ? 'Bénéfice' : 'Perte'}</h3>
                    <p className="text-2xl font-bold">
                        <CountUp
                            start={0}
                            end={Math.abs(totalProfit)}
                            duration={2}
                            separator=","
                            decimals={0}
                        />{' '}
                        Ar
                    </p>
                </div>

                <div
                    className={`p-4 rounded-lg text-center
                        ${totalMenuProfit >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                        dark:${totalMenuProfit >= 0 ? 'bg-blue-800 text-blue-300' : 'bg-gray-800 text-gray-300'}`}
                >
                    <h3 className="text-lg font-medium">{totalMenuProfit >= 0 ? 'Bénéfice des Menus' : 'Perte des Menus'}</h3>
                    <p className="text-2xl font-bold">
                        <CountUp
                            start={0}
                            end={Math.abs(totalMenuProfit)}
                            duration={2}
                            separator=","
                            decimals={0}
                        />{' '}
                        Ar
                    </p>
                </div>
            </div>

        </div>
    );
}
