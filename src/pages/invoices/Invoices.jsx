import { useEffect, useState } from "react";
import { apiUrl, fetchJson } from "../../services/api.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import { formatToFourDigits } from "../../services/formatToFourDigits.js";
import { convertMethodToPayment } from "../../services/convertMethodToPayment.js";
import { convertStatusToPayment } from "../../services/convertStatus.js";

const Invoices = ({ paymentId }) => {
  const [invoices, setInvoices] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchJson(apiUrl(`/invoices/${paymentId}`));
        setInvoices(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des factures:", error);
        setError("Erreur lors de la récupération des factures.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, [paymentId]);

  const currentDate = dayjs().format("DD/MM/YYYY HH:mm:ss");

  const groupOrders = () => {
    if (!invoices?.orders) return [];

    const groupedOrders = [];
    let tempGroup = [invoices.orders[0]];

    invoices.orders.slice(1).forEach((order) => {
      const lastOrder = tempGroup[tempGroup.length - 1];

      const lastOrderIsUnpaid = lastOrder?.payment?.status === "UNPAID";
      const currentOrderIsUnpaid = order?.payment?.status === "UNPAID";

      const timeDiff = dayjs(order.orderDate).diff(
        dayjs(lastOrder.orderDate),
        "minute"
      );
      if (
        lastOrderIsUnpaid ||
        (lastOrder?.payment?.status === "PAID" && currentOrderIsUnpaid) ||
        timeDiff <= 1
      ) {
        tempGroup.push(order);
      } else {
        groupedOrders.push(tempGroup);
        tempGroup = [order];
      }
    });

    if (tempGroup.length > 0) {
      groupedOrders.push(tempGroup);
    }

    return groupedOrders;
  };

  const lastGroup = groupOrders().slice(-1)[0];
  const lastOrder = lastGroup ? lastGroup[lastGroup.length - 1] : null;

  const roomNumbersString = [
    ...new Set(
      invoices?.orders
        ?.filter((o) => o.room != null)
        .map((o) => o.room.roomNumber)
    ),
  ].join("-");

  const tableNumbersString = [
    ...new Set(
      invoices?.orders
        ?.filter((o) => o.table != null)
        .map((o) => o.table.number)
    ),
  ].join("-");

  const generatePDF = () => {
    if (!lastOrder) return;

    const doc = new jsPDF({ unit: "mm", format: [80, 140] });
    let startY = 10;
    const marginLeft = 5;

    doc.setFontSize(6);
    doc.text("UTOPIA", marginLeft, startY);
    doc.text("By Sooatel", marginLeft, (startY += 4));
    doc.text("Ankasina Antananarivo", marginLeft, (startY += 4));
    doc.text("Tel: 038 42 779 74", marginLeft, (startY += 4));

    doc.setFontSize(8);
    doc.text("FACTURE", 40, (startY += 6), { align: "center" });
    doc.setFontSize(6);
    doc.text(`Date: ${currentDate}`, marginLeft, (startY += 6));
    doc.text(
      `Facture: ${formatToFourDigits(invoices?.payment?.id || 0)}`,
      marginLeft,
      (startY += 4)
    );
    doc.text(
      `Méthode de paiement: ${
        convertMethodToPayment(invoices?.payment.paymentMethod) ||
        "Non spécifié"
      }`,
      marginLeft,
      (startY += 4)
    );

    doc.text(
      `Status de paiement: ${
        convertStatusToPayment(invoices?.payment.status) || "Non spécifié"
      }`,
      marginLeft,
      (startY += 4)
    );

    doc.text(
      `N° de la table: ${tableNumbersString || "___"}`,
      marginLeft,
      (startY += 4)
    );
    doc.text(
      `N° de la chambre: ${roomNumbersString || "___"}`,
      marginLeft,
      (startY += 4)
    );

    doc.line(marginLeft, (startY += 4), 75, startY);

    lastGroup.forEach((order) => {
      doc.text(`Article: ${order.menu.name}`, marginLeft, (startY += 5));
      doc.text(`Qté: x${order.quantity}`, marginLeft, (startY += 5));
      doc.text(`Prix: ${order.cost.toFixed(2)} MGA`, marginLeft, (startY += 5));
      doc.line(marginLeft, (startY += 4), 75, startY);
    });

    doc.setFontSize(7);
    const totalAmount = lastGroup.reduce(
      (total, order) => total + order.cost,
      0
    );
    doc.text(
      `Montant total: ${totalAmount.toFixed(2)} MGA`,
      marginLeft,
      (startY += 6)
    );

    doc.setFontSize(6);
    doc.text(
      "Utopia vous remercie et à très bientôt!",
      marginLeft,
      (startY += 8)
    );

    doc.save("facture.pdf");
  };

  const printInvoice = () => {
    if (!lastOrder) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Facture</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 10px; text-align: left; padding-left: 10px; }
            h2 { margin: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h2>UTOPIA</h2>
          <p>By Sooatel<br/>Ankasina Antananarivo<br/>Tel: 038 42 779 74</p>
          <hr/>
          <h3>FACTURE</h3>
          <p>Date: ${currentDate}</p>
          <p>Facture: ${formatToFourDigits(invoices?.payment?.id || 0)}</p>
          <p>Dernière commande: ${dayjs(lastOrder.orderDate).format(
            "DD/MM/YYYY HH:mm:ss"
          )}</p>
          <p>Paiement méthod: ${
            convertMethodToPayment(invoices?.payment.paymentMethod) ||
            "Non spécifié"
          }</p>
          <p>Paiement status: ${
            convertStatusToPayment(invoices?.payment.status) || "Non spécifié"
          }</p>
          <p>N° de la table: ${tableNumbersString || "___"}</p>
          <p>N° de la chambre: ${roomNumbersString || "___"}</p>

          <!-- Affichage des commandes -->
          ${lastGroup
            .map(
              (order) => `
            <h4>${order.menu.name}</h4>
            <p>Quantité: x${order.quantity}</p>
            <p>Prix: ${order.cost.toFixed(2)} MGA</p>
          `
            )
            .join("")}

          <hr/>
          <h4>Montant total: ${lastGroup
            .reduce((sum, order) => sum + order.cost, 0)
            .toFixed(2)} MGA</h4>

          <p>Utopia vous remercie et à très bientôt!</p>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full bg-white rounded p-5 flex flex-col gap-5 h-[550px] overflow-y-auto scrollbar-custom">
        {isLoading && <p>Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && lastOrder && (
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-3 items-center">
                <img
                  src="/UTOPIA-B.png"
                  alt="UTOPIA-B"
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">By Sooatel</span>
                  <span className="text-xs">
                    Ankasina Antananarivo
                    <br />
                    Tel: 038 42 779 74
                  </span>
                </div>
              </div>
              <h1 className="text-2xl font-bold underline text-center">
                Facture
              </h1>
            </div>

            <div className="flex flex-col mb-6">
              <ul className="list-inside">
                <li className="py-1 px-4">Date: {currentDate}</li>
                <li className="py-1 px-4">
                  Dernière commande:{" "}
                  {dayjs(lastOrder.orderDate).format("DD/MM/YYYY HH:mm:ss")}
                </li>
                <li className="py-1 px-4">
                  Numéro de facture:{" "}
                  {formatToFourDigits(invoices?.payment?.id || 0)}
                </li>
                <li className="py-1 px-4">
                  Mode de paiement:{" "}
                  {convertMethodToPayment(invoices?.payment?.paymentMethod) ||
                    "Non spécifié"}
                </li>
                <li className="py-1 px-4">
                  Statut paiement:{" "}
                  {convertStatusToPayment(invoices?.payment?.status)}
                </li>
                <li className="py-1 px-4">
                  N° de la table: {tableNumbersString || "___"}
                </li>
                <li className="py-1 px-4">
                  N° de la chambre: {roomNumbersString || "___"}
                </li>
              </ul>
            </div>

            <div className="mb-4">
              <table className="w-full border border-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Désignation</th>
                    <th className="py-2 px-4 border">Quantité</th>
                    <th className="py-2 px-4 border">Prix U</th>
                    <th className="py-2 px-4 border">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {lastGroup.map((order, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">{order.menu.name}</td>
                      <td className="py-2 px-4 border">{order.quantity}</td>
                      <td className="py-2 px-4 border">
                        {order.menu.price} MGA
                      </td>
                      <td className="py-2 px-4 border">{order.cost} MGA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2">
              <h4>
                Montant total:{" "}
                {lastGroup
                  .reduce((sum, order) => sum + order.cost, 0)
                  .toFixed(2)}{" "}
                MGA
              </h4>
            </div>

            <div className="flex flex-row justify-between gap-6 pt-5">
              <button
                onClick={generatePDF}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                disabled={!lastOrder}
              >
                Télécharger la Facture PDF
              </button>
              <button
                onClick={printInvoice}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                disabled={!lastOrder}
              >
                Imprimer la Facture
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
