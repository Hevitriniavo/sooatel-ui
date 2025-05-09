import { useEffect } from "react";
import { convertStatusToReservation } from "../../services/convertStatus.js";
import dayjs from "dayjs";

const ReservationCard = ({ reservation }) => {
  useEffect(() => {
    console.log(reservation);
  }, [reservation]);

  const { customer, rooms, tables, status } = reservation.data;
  

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2
        className="text-4xl font-extrabold text-blue-700 mb-6 w-full"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        Détails de la Réservation
      </h2>
      <div className="flex flex-col justify-between gap-6">
        <div>
          <h3
            className="text-2xl font-medium text-gray-800 mb-2"
            style={{ fontFamily: "Verdana, sans-serif" }}
          >
            Informations de la Réservation
          </h3>
          <p className="text-sm first-letter:text-xl first-letter:ml-12 first-letter:font-bold first-letter:text-blue-600">
            La réservation décrit :{" "}
            <strong className="font-semibold">{reservation.title}</strong>. Elle
            débute le{" "}
            <strong className="font-semibold">
              {dayjs(reservation.start).format("DD/MM/YYYY HH:mm")}
            </strong>  et se termine le{" "}
            <strong className="font-semibold">
              {dayjs(reservation.end).format("DD/MM/YYYY HH:mm")}
            </strong>
            . Réservation{" "}
            <strong className="font-semibold">
              {convertStatusToReservation(status)}
            </strong>
            .
          </p>
        </div>

        <div className="flex-1 mb-6">
          <h3
            className="text-2xl font-medium text-gray-800 mb-2"
            style={{ fontFamily: "Verdana, sans-serif" }}
          >
            Informations du Client
          </h3>
          <p className="text-sm first-letter:text-xl first-letter:ml-12 first-letter:font-bold first-letter:text-blue-600">
            Le client Mme/Mr,{" "}
            <strong className="font-semibold text-gray-600">
              {customer.name}
            </strong>
            , a le contact{" "}
            <strong className="font-semibold text-gray-600">
              {customer.phoneNumber}
            </strong>
            .
          </p>
        </div>
      </div>

      {tables && rooms && (
        <div className="mb-6">
          <h3
            className="text-2xl font-medium text-gray-800 mb-2"
            style={{ fontFamily: "Verdana, sans-serif" }}
          >
            Informations sur la Chambre et la Table
          </h3>
          {rooms && (
            <p>
              <strong className="font-semibold text-gray-600">
                Chambre n° :
              </strong>{" "}
              {rooms.id}
            </p>
          )}
          {tables && (
            <p>
              <strong className="font-semibold text-gray-600">Table :</strong>{" "}
              {tables.id}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
