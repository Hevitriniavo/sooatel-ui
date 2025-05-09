import React, { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api";
import dayjs from "dayjs";
import { MdInfoOutline } from "react-icons/md";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast";

function MostSoldMenus() {
  const [mostSoldMenus, setMostSoldMenus] = useState([]);
  const [menuName, setMenuName] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();

  const fetchMostSoldMenus = async () => {
    setIsLoading(true);
    try {
      const data = await fetchJson(apiUrl(`/most-sold-menus?date=${selectedDate}`));
      setMostSoldMenus(groupByCategory(data));
    } catch (error) {
      showError("Erreur lors du chargement des menus : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMostSoldMenus();
  }, [selectedDate]);

  const groupByCategory = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const categoryId = item.category.id;
      if (!grouped[categoryId]) {
        grouped[categoryId] = {
          category: item.category,
          menus: [],
        };
      }
      grouped[categoryId].menus.push(...item.menus);
    });

    return Object.values(grouped);
  };

  const filteredData = mostSoldMenus
    .map((category) => {
      if (!category.category || !category.menus) return null;

      const filteredMenus = category.menus.filter((menu) =>
        menu.name.toLowerCase().includes(menuName.toLowerCase())
      );

      return filteredMenus.length > 0 ? { ...category, menus: filteredMenus } : null;
    })
    .filter(Boolean);

  return (
    <div className="darkBody container mx-auto p-4 bg-white pb-10 pr-14 sm:px-6 md:px-8 lg:px-14 xl:px-20">
      <h1 className="text-2xl font-bold mb-4">Liste des menus les plus vendus</h1>

      <div className="flex mb-4 gap-2">
        <input
          type="search"
          placeholder="Rechercher par nom du menu"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-60 outline-none"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 p-2 rounded-md outline-none"
        />
      </div>
      <div className="overflow-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Date</th>
              <th className="p-2">Nom</th>
              <th className="p-2">Quantité</th>
              <th className="p-2">Prix</th>
              <th className="p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">Chargement...</td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((category) => (
                <React.Fragment key={category.category.id}>
                  <tr className="bg-gray-100 text-center font-bold">
                    <td colSpan="5" className="py-2">{category.category.name}</td>
                  </tr>
                  {category.menus.map((menu) => (
                    <tr key={menu.id} className="text-center border-t">
                      <td className="p-2">{selectedDate}</td>
                      <td className="p-2">{menu.name || "N/A"}</td>
                      <td className="p-2">{menu.quantityMenuByName}</td>
                      <td className="p-2">{menu.price} Ar</td>
                      <td className="p-2">{menu.description || "N/A"}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr className="text-center">
                <td colSpan="5" className="py-4 text-gray-500">
                  <div className="flex flex-col items-center">
                    <MdInfoOutline className="text-4xl mb-2 text-gray-400" />
                    Aucun menu trouvé pour cette date
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MostSoldMenus;
