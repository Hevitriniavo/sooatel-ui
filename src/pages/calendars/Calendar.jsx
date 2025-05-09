import {useEffect, useState} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {apiUrl, fetchJson} from "../../services/api.js";
import Modal from "../../components/menus/menu-orders/(tantely)/Modal.jsx";
import ReservationCard from "../../components/reservations/ReservationCard.jsx";

const localizer = momentLocalizer(moment);

const TheCalendar = () => {
  const [events, setEvents] = useState([]);
  const [activeButton, setActiveButton] = useState('');
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        void  (async () => {
            try {
                const data = await fetchJson(apiUrl('/reservations'));
                const mappedEvents = data.map(reservation => ({
                    title: reservation.description,
                    start: new Date(reservation.reservationStart),
                    end: new Date(reservation.reservationEnd),
                    allDay: false,
                    data: {
                        reservationId: reservation.id,
                        customer: reservation.customer,
                        status: reservation.status,
                        room: reservation.room,
                        table: reservation.table,
                    },
                }));
                setEvents(mappedEvents);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        })()
    }, []);


    const handleShow = (event) => {
        setSelectedEvent(event);
    };
  const CustomToolbar = (toolbar) => {
      const isActive = (button) => activeButton === button;

    return (
        <>
            <div
                className="CalendarHead bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4 flex justify-between items-center">
                <div className="flex space-x-4">
                    <button
                        className={`${isActive('today') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`}
                        onClick={() => {
                            toolbar.onNavigate('TODAY');
                            setActiveButton('today');
                        }}
                    >
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        Aujourd'hui
                    </button>
                    <button
                        className={`${isActive('prev') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`}
                        onClick={() => {
                            toolbar.onNavigate('PREV');
                            setActiveButton('prev');
                        }}
                    >
                        Précédent
                    </button>
                    <button
                        className={`${isActive('next') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`}
                        onClick={() => {
                            toolbar.onNavigate('NEXT');
                            setActiveButton('next');
                        }}
                    >
                        Suivant
                    </button>
                </div>
                <span
                    className="text-lg font-semibold dark:text-white">{moment(toolbar.date).format('MMMM YYYY')}</span>
                <div className="flex space-x-4">
                    <button
                        className={`${isActive('month') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`}
                        onClick={() => {
                            toolbar.onView('month');
                            setActiveButton('month');
                        }}
                    >
                        Mois
                    </button>
                    <button
                        className={`${isActive('week') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`}
                        onClick={() => {
                            toolbar.onView('week');
                            setActiveButton('week');
                        }}
                    >
                        Semaine
                    </button>
                    <button
                        className={`${isActive('day') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`}
                        onClick={() => {
                            toolbar.onView('day');
                            setActiveButton('day');
                        }}
                    >
                        Jour
                    </button>
                    <button
                        className={`${isActive('agenda') ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'} py-2 px-4 rounded`}
                        onClick={() => {
                            toolbar.onView('agenda');
                            setActiveButton('agenda');
                        }}
                    >
                        Agenda
                    </button>
                </div>

            </div>

            <Modal isOpen={isShowModal} setIsOpen={setIsShowModal}>
                {selectedEvent && (
                    <div className="p-4">
                        <ReservationCard
                            reservation={selectedEvent}
                        />
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                className="px-2 py-1 text-black outline outline-1 outline-red-700 capitalize rounded-sm flex items-center gap-2"
                                onClick={() => setIsShowModal(false)}
                            >
                                annuler
                            </button>
                        </div>
                    </div>
                )}


            </Modal>
        </>
    );
  };

    return (
        <div className="w-[970px]">
            <div
                className="Calendar w-full max-w-full rounded-sm border border-gray-300 bg-white shadow-default dark:border-gray-600 dark:bg-gray-800 p-4">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{height: 500}}
                    selectable={true}
                    onSelectEvent={(event) => {
                        setIsShowModal(true)
                        handleShow(event)
                    }}
                    components={{
                        toolbar: CustomToolbar,
                    }}
                    className="dark:bg-gray-800 dark:text-white"
                />
            </div>
        </div>
    );
};

export default TheCalendar;
