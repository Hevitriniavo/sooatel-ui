import { Fragment, useEffect, useState } from "react";
import { BiSolidShow } from "react-icons/bi";
import { apiUrl, fetchJson } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { MdAddBox, MdEdit, MdInfoOutline, MdPayment } from "react-icons/md";
import CreateMenuOrder from "../../components/menus/menu-orders/CreateMenuOrder";
import { convertType } from "../../services/convertType";
import UpdateStatusOrder from "../../components/status/UpdateStatusOrder.jsx";
import {
  convertStatusToOrder,
  convertStatusToPayment,
} from "../../services/convertStatus.js";
import { convertMethodToPayment } from "../../services/convertMethodToPayment.js";
import { formatPriceInAriary } from "../../services/formatePrice.js";
import CreatePaymentAfterOrder from "../../components/menus/menu-orders/CreatePaymentAfterOrder.jsx";
import Invoices from "../invoices/Invoices.jsx";
import useToast from "../../components/menus/menu-orders/(tantely)/hooks/useToast.jsx";
import UpdateStatusPayment from "../../components/status/UpdateStatusPayment.jsx";
import { Checkbox, TextField } from "@mui/material";

function OrderSummary() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [isGenerateInvoice, setIsGenerateInvoice] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [t, setT] = useState(null);
  const [n, setN] = useState(null);
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState([]);
  const [statusesPayment, setStatusesPayment] = useState([]);
  const [searchBoxNoDelivered, setSearchBoxNoDelivered] = useState(false);
  const [searchBoxDelivered, setSearchBoxDelivered] = useState(false);
  const [searchBoxPaid, setSearchBoxPaid] = useState(false);
  const [searchBoxNoPaid, setSearchBoxNoPaid] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditModalPayment, setShowEditModalPayment] = useState(false);
  const [status, setStatus] = useState("");
  const [statusPayment, setStatusPayment] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    void fetchApi();
  }, []);

  useEffect(() => {
    fetchJson(apiUrl("/menu-orders/status"))
      .then((data) => setStatuses(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetchJson(apiUrl("/payments/status"))
      .then((data) => setStatusesPayment(data))
      .catch((error) => console.log(error));
  }, []);

  const fetchApi = async () => {
    const url = apiUrl("/menu-orders/grouped");
    try {
      const data = await fetchJson(url);
      const orderData = groupByPaymentId(data);

      setOrders(orderData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (order) => {
    navigate(
      `/orders/by-${order.type.toLowerCase() === "table" ? "table" : "room"}/${
        order.number
      }`
    );
  };

  const handlePayment = () => {
    navigate("/payments");
  };

  const handleCreatePayment = (type, number) => {
    setIsPayment(true);
    setT(type);
    setN(number);
  };

  function groupByPaymentId(data) {
    const nullPayments = data.filter((item) => item.payment === null);
    const nonNullPayments = data.filter((item) => item.payment !== null);

    const grouped = nonNullPayments.reduce((acc, item) => {
      const key = `${item.type}_${item.number}`;

      if (!acc[key]) {
        acc[key] = {
          type: item.type,
          number: item.number,
          totalAmount: 0,
          menus: [],
          orderStatus: item.orderStatus,
          orderIds: item.orderIds,
          payment: item.payment,
        };
      }

      acc[key].totalAmount += item.payment.amount;
      acc[key].menus = [...new Set([...acc[key].menus, ...item.menus])];

      return acc;
    }, {});
    const groupedArray = Object.values(grouped);
    return [...nullPayments, ...groupedArray];
  }

  const handleEditStatus = (order) => {    
    setSelectedOrderId(order.orderIds);
    setStatus(order.orderStatus);
    setShowEditModal(true);
  };

  const handleEditStatusPayment = (payment) => {
    setSelectedPaymentId(payment.id);
    setStatusPayment(payment.status);
    setShowEditModalPayment(true);
  };

  const handleUpdateStatusPayment = async () => {
    setPaymentId(selectedPaymentId);
    try {
      const url = apiUrl(`/payments/update/status/${selectedPaymentId}`);
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusPayment),
      });

      if (res.ok) {
        setShowEditModalPayment(false);
        setSelectedPaymentId(null);
        setIsGenerateInvoice(true);
        void fetchApi();
        showSuccess("Statut mis à jour avec succès.");
      }
    } catch {
      showError("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const url = apiUrl(`/menu-orders/orderIds/status`);
      const payload = {
        orderIds: selectedOrderId,
        orderStatus: status,
      };
      console.log(payload);

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowEditModal(false);
        setSelectedOrderId(null);
        void fetchApi();
        showSuccess("Le status a été mis à jour avec succès.");
      }
    } catch {
      showError("Erreur lors de la mise à jour du statut de la commande.");
    }
  };


  const filteredMenuOrders = orders.filter((order) => {
    const matchNumber = searchTerm
      ? String(order.number).includes(searchTerm)
      : true;
    const matchStatus = searchBoxDelivered ? order.orderStatus.toLowerCase() !== "not_delivered" : true;
    const matchStatusDelivered = searchBoxNoDelivered ? order.orderStatus.toLowerCase() !== "delivered" : true;
    const matchStatusNoPaid = searchBoxNoPaid ? order.payment?.status.toLowerCase() !== "paid" : true;
    const matchStatusPaid = searchBoxPaid ? order.payment?.status.toLowerCase() !== "unpaid" : true;
    return matchNumber && matchStatus && matchStatusDelivered && matchStatusPaid && matchStatusNoPaid;
  });

  return (
    <div className="text-gray-700 p-4 rounded-lg">
      <div className="flex flex-row justify-between pt-4 w-[950px] fixed bg-white z-50 pb-2 darkBody">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600
                        flex flex-row gap-2 items-center"
        >
          <MdAddBox /> Ajouter une commande
        </button>
        <div>
          <h4>Afficher seulement les commandes:</h4>
          <Checkbox
            id="searchBoxNoDelivered"
            checked={searchBoxNoDelivered}
            onChange={(e) => setSearchBoxNoDelivered(e.target.checked)}
          />
          <label htmlFor="searchBoxNoDelivered">
             non livré
          </label>
          <Checkbox
            id="searchBoxDelivered"
            checked={searchBoxDelivered}
            onChange={(e) => setSearchBoxDelivered(e.target.checked)}
          />
          <label htmlFor="searchBoxDelivered">
            livré
          </label>
          <Checkbox
            id="searchBoxNoPaid"
            checked={searchBoxNoPaid}
            onChange={(e) => setSearchBoxNoPaid(e.target.checked)}
          />
          <label htmlFor="searchBoxNoPaid">
             non payé
          </label>
          <Checkbox
            id="searchBoxPaid"
            checked={searchBoxPaid}
            onChange={(e) => setSearchBoxPaid(e.target.checked)}
          />
          <label htmlFor="searchBoxPaid">
            Payé
          </label>
        </div>
        <div>
          <TextField
            id="outlined-search"
            label="Rechercher chambre / table"
            type="number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: searchTerm && (
                <button
                  type="button"
                  className="flex items-center"
                  onClick={() => setSearchTerm("")}
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                ></button>
              ),
            }}
            sx={{
              width: "150px",
              height: "50px",
              ".MuiInputBase-root": { height: "40px" },
            }}
          />
        </div>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600
                        flex flex-row gap-2 items-center"
          onClick={handlePayment}
        >
          <MdPayment color="white" /> Payer maintenant
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg text-center relative top-[80px] darkBody">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Numero</th>
            <th className="py-2 px-4">Menus</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMenuOrders.length > 0 ? (
            filteredMenuOrders
              .toSorted((a, b) => a.id - b.id)
              .map((order, i) => (
                <Fragment key={i}>
                  {order.payment === null ? (
                    <tr>
                      <td colSpan="6" className="py-1 text-gray-500">
                        <div className="flex justify-between gap-64 mx-4 mr-[calc(5rem+2px)] items-center">
                          <p className="text-sm font-semibold text-yellow-600">
                            Pas de facture
                          </p>

                          <p className="text-sm text-center font-semibold text-yellow-600 mr-auto">
                            <span className="ml-2 text-sm text-yellow-600">
                              Non définie
                            </span>
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr className="border-gray-200">
                      <td colSpan="6" className="py-2 text-gray-500">
                        <div className="flex justify-between items-center mx-4 mr-[calc(5rem+2px)]">
                          <p
                            className={`cursor-pointer text-center text-sm font-semibold text-green-600 mr-auto ${
                              order.payment.status.toLowerCase() === "unpaid"
                                ? "text-red-500 font-bold"
                                : ""
                            }`}
                          >
                            <button
                              onClick={() => {
                                handleEditStatusPayment(order.payment);
                              }}
                              className="w-full flex flex-row gap-1 items-center justify-center text-center"
                            >
                              <span
                                className={`flex text-sm flex-row  gap-1 items-center text-center ${
                                  order.payment.status.toLowerCase() === "paid"
                                    ? "text-green-500"
                                    : ""
                                }`}
                              >
                                {order.payment.status.toLowerCase() ===
                                  "unpaid" && (
                                  <>
                                    <MdEdit />
                                    <span className="text-red-500 text-[10px]">
                                      ⚠️
                                    </span>
                                  </>
                                )}
                                {convertStatusToPayment(
                                  order.payment.status.toLowerCase()
                                )}
                              </span>
                            </button>
                          </p>

                          <p className="text-sm font-semibold text-green-600 mr-auto">
                            <span className="ml-2 text-sm text-gray-600 px-4">
                              {convertMethodToPayment(
                                order.payment.paymentMethod
                              )}
                            </span>
                          </p>

                          <p className="text-sm font-semibold text-green-600 mr-auto">
                            <span className="ml-2 text-sm text-gray-600 px-4">
                              {formatPriceInAriary(order.payment.amount)}
                            </span>
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr className="border-gray-200 border-b">
                    <td className="py-2 px-4 cursor-pointer text-green-600">
                      <button
                        onClick={() => handleEditStatus(order)}
                        className={`w-full flex flex-col gap-1 items-center  ${
                          order.orderStatus?.toLowerCase() !== "delivered"
                            ? "text-red-500 font-bold"
                            : ""
                        }`}
                      >
                        <span className="flex flex-row text-sm gap-1 items-center ">
                          <MdEdit />{" "}
                          {order.orderStatus?.toLowerCase() !== "delivered" && (
                            <span className="text-red-500 text-[10px]">⚠️</span>
                          )}
                          {convertStatusToOrder(
                            order.orderStatus?.toLowerCase()
                          )}
                        </span>
                      </button>
                    </td>
                    <td className="py-2 px-4">{convertType(order.type)}</td>
                    <td className="py-2 px-4">{order.number}</td>
                    <td className="py-2 px-2">
                      {order.menus.map((m) => m.toLowerCase()).join(", ")}
                    </td>
                    <td className="py-2 px-4 flex flex-row justify-center gap-2">
                      <button
                        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                        onClick={() => handleClick(order)}
                      >
                        <BiSolidShow />
                      </button>

                      {order.payment === null ? (
                        <button
                          className="bg-yellow-500 text-white px-2 py-2 rounded-lg hover:bg-yellow-600"
                          onClick={() =>
                            handleCreatePayment(order.type, order.number)
                          }
                        >
                          <MdPayment color="white" />
                        </button>
                      ) : (
                        <>
                          {String(order.payment.status).toLowerCase() ===
                            "unpaid" && (
                            <button
                              className="bg-yellow-500  text-white px-2 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2"
                              onClick={() =>
                                handleCreatePayment(order.type, order.number)
                              }
                            >
                              <MdPayment color="white" className="text-lg" />
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                </Fragment>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="mx-auto bg-white rounded w-full max-w-lg sm:max-w-md CreateModal" >
            <div className="flex flex-row justify-between items-center">
              <h2
                className="text-center font-serif font-bold
                                text-xl pl-8 pt-8 pb-4"
              >
                Formulaire de Commande
                <br />
                <span className="text-[10px]">
                  nb : choisir table ou chambre
                </span>
              </h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                                relative bottom-8 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                x
              </span>
            </div>
            <CreateMenuOrder
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onOrderCreated={() => {
                void fetchApi();
              }}
            />
          </div>
        </div>
      )}

      {isGenerateInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl EditModal relative">
            <span
              className="hover:bg-red-500 px-5  flex text-center justify-between items-center
                                  absolute top-0  right-0 rounded text-[30px] hover:text-white cursor-pointer"
              onClick={() => setIsGenerateInvoice(false)}
            >
              x
            </span>
            <Invoices paymentId={paymentId} />
          </div>
        </div>
      )}

      {isPayment && (
        <div className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center">
          <div className="relative top-6 bg-white rounded-lg shadow-lg w-full max-w-md EditModal">
            <span
              className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                        relative left-[408px] text-[30px] hover:text-white cursor-pointer"
              onClick={() => setIsPayment(false)}
            >
              x
            </span>
            <CreatePaymentAfterOrder
              number={n}
              type={t}
              onCancel={() => {
                setIsPayment(false);
                setT(null);
                setN(null);
              }}
              onSuccess={(id) => {
                setPaymentId(id);
                setIsGenerateInvoice(true);
                void fetchApi();
                setIsPayment(false);
                setT(null);
                setN(null);
              }}
            />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg EditModal">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le statut</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                                relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditModal(false)}
              >
                x
              </span>
            </div>
            <UpdateStatusOrder
              onSave={handleUpdateStatus}
              onCancel={() => setShowEditModal(false)}
              statuses={statuses}
              setStatus={setStatus}
              status={status}
            />
          </div>
        </div>
      )}

      {showEditModalPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-sm EditModal">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl pl-8 pt-8 pb-4">Modifier le statut</h2>
              <span
                className="hover:bg-red-500 px-5 flex justify-center items-center w-[40px]
                            relative bottom-4 text-[30px] hover:text-white cursor-pointer"
                onClick={() => setShowEditModalPayment(false)}
              >
                x
              </span>
            </div>
            <UpdateStatusPayment
              onSave={handleUpdateStatusPayment}
              onCancel={() => setShowEditModalPayment(false)}
              statuses={statusesPayment}
              setStatus={setStatusPayment}
              status={statusPayment}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderSummary;
