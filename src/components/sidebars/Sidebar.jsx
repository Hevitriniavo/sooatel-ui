import  { useState } from 'react';
import {FaAngleRight, FaRegListAlt} from "react-icons/fa";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { RiReservedLine } from "react-icons/ri";
import { AiOutlineStock } from "react-icons/ai";
import { RiMenuUnfold4Line } from "react-icons/ri";
import {
  MdKeyboardCommandKey, MdOutlineCalendarMonth,
  MdOutlineHome, MdMenuBook, MdOutlineSettings,
  MdMenu, MdOutlineLogin, MdPayment
} from "react-icons/md";
import { useTitleStore } from '../../stores/useTitleStore';
import {useAuthStore} from "../../stores/useAuthStore.js";
import {Person2, Person2Outlined} from '@mui/icons-material';

const menuItems = [
  {
    title: "Accueil",
    icon: <MdOutlineHome />,
    path: "/",
    subItems: [],
  },
  {
    title: "Caisses",
    icon: <MdKeyboardCommandKey />,
    path: "/cashs",
    subItems: [],
  },
  {
    title: "Commandes",
    icon: <MdKeyboardCommandKey />,
    path: "/orders/summary",
    subItems: [],
  },

  {
    title: "Payments",
    path: "/payments",
    icon: <MdPayment />,
    subItems: [],
  },
  
  {
    title: "stocks",
    icon: <AiOutlineStock />,
    path: "/stocks",
    subItems: [],
  },
  {
    title: "Menus",
    icon: <MdMenuBook />, 
    subItems: [
      {
        title: "Liste des menus",
        path: "/menuList",
      },
      {
        title: "Liste des menus vendu",
        path: "/menuSold",
      },
    ],
  },
  {
    title: "Catégories",
    icon: <RiReservedLine />,
    subItems: [
      {
        title: "Ingrédients",
        path: "/categoriesIngredientList",
        subItems: [],
      },
      {
        title: "Menus",
        path: "/categoriesListe",
        subItems: [],
      },
    ],
  },
  {
    title: "Unités",
    icon: <FaRegListAlt />,
    path: "/units",
    subItems: [],
  },
  {
    title: "Ingredients",
    icon: <MdOutlineSettings />,
    path: "/ingredients",
    subItems: [],
  },
  
  {
    title: "Tables",
    icon: <MdOutlineCalendarMonth />,
    path: "/tableList",
    subItems: [],
  },
  {
    title: "Chambres",
    icon: <AiOutlineStock />,
    path: "/roomList",
    subItems: [],
  },
  {
    title: "Étages",
    icon: <RiReservedLine />,
    path: "/floorList",
    subItems: [],
  },
  
  {
    title: "Réservations",
    icon: <RiReservedLine />,
    path: "/reservations",
    subItems: [],
  },
  
  {
    title: "Calendrier",
    icon: <MdOutlineCalendarMonth />,
    path: "/calendars",
    subItems: [],
  },

  {
    title: "Achat des stocks",
    icon: <AiOutlineStock />,
    path: "/purchaseList",
    subItems: [],
  },
  {
    title: "Clients",
    icon: <Person2 />,
    path: "/customers",
    subItems: [],
  },
  {
    title: "Users",
    icon: <Person2Outlined />,
    path: "/users",
    subItems: [],
  },
  {
    title: "Paramètres",
    icon: <MdOutlineSettings />,
    path: "/settings",
    subItems: [],
  },
];


export const SidebarToggleButton = ({ handleSidebarToggle, openSidebar }) => (
  <button
    className="fixed top-4 left-20 z-50 rounded-full p-3 bg-slate-100 text-2xl flex 
    items-center justify-center hover:bg-slate-200 lg:hidden"
    onClick={handleSidebarToggle}
  >
    {openSidebar ? <MdMenu className="text-gray-500 text-xl" /> : <RiMenuUnfold4Line className="text-gray-500 text-xl" />}
  </button>
);

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate()
  const removeAuth = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState(null);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState({});
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const setTitle = useTitleStore(state => state.setTitle);

  const handleSubmenuToggle = (index) => {
    setActiveTab(index);
    setIsToggleSubmenu(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSidebarToggle = () => {
    setOpenSidebar(!openSidebar);
  };

  const handleChangeTitle = (title) => {
    setTitle(title);
  };

  const handleCloseSidebar = () => {
    if (window.innerWidth < 1024) {
      setOpenSidebar(false);
    }
  };

  const  logout = () => {
    if (window.innerWidth < 1024) {
      setOpenSidebar(false);
    }
    removeAuth();
    navigate("/authentification")
  }


  return (
    <>
      <SidebarToggleButton handleSidebarToggle={handleSidebarToggle} openSidebar={openSidebar} />
      <div
        className={`Sidebar fixed top-20 left-0 w-64 h-screen bg-white shadow-md flex flex-col
          overflow-y-scroll overflow-x-hidden max-h-[calc(100%-80px)] transition-transform duration-300 
          ease-in-out ${openSidebar ? 'translate-x-0 z-10' : '-translate-x-full'} lg:translate-x-0 lg:block`}
        onMouseEnter={() => setShowScrollbar(true)}
        onMouseLeave={() => setShowScrollbar(false)}
        style={{
          scrollbarWidth: showScrollbar ? 'thin' : 'none',
          overflowY: showScrollbar ? 'scroll' : 'hidden'
        }}
      >
        <div className="flex items-center justify-between p-4 text-2xl font-bold text-gray-500">
          <span>Tableau de bord</span>
        </div>

        <ul className="space-y-2 p-4 text-gray-500 ">
          {menuItems.map((item, index) => (
            <li key={index} className="space-y-2">
              {item.subItems.length > 0 ? (
                <>
                  <button
                    onClick={() => handleSubmenuToggle(index)}
                    className={`button w-full flex items-center p-2 rounded-lg hover:bg-gray-100 ${activeTab === index && isToggleSubmenu[index] ? '' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-gray-700">{item.title}</span>
                    </div>
                    <FaAngleRight className={`ml-auto text-gray-500 transition-transform duration-300 ease-in-out ${activeTab === index && isToggleSubmenu[index] ? 'rotate-90' : ''}`} />
                  </button>
                  <div className={`pl-4 transition-all duration-300 ease-in-out ${activeTab === index && isToggleSubmenu[index] ? 'h-auto' : 'h-0 overflow-hidden'}`}>
                    <ul className={`transition-opacity duration-300 ease-in-out ${activeTab === index && isToggleSubmenu[index] ? 'opacity-100' : 'opacity-0'}`}>
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} onClick={() => { handleChangeTitle(subItem.title); handleCloseSidebar(); }}>
                          <Link
                            to={subItem.path}
                            className={`button flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === subItem.path ? 'bg-gray-200 dark:bg-gray-500' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              {subItem.icon}
                              <span className="text-gray-700">{subItem.title}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`button flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === item.path ? 'bg-gray-200 dark:bg-gray-500' : ''}`}
                  onClick={() => { handleChangeTitle(item.title); handleCloseSidebar(); }}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-gray-700">{item.title}</span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="Authentification p-4 bg-white">
          <button
            className={`button flex items-center p-2 rounded-lg hover:bg-gray-100 ${location.pathname === '/authentification' ? '' : ''}`}
            onClick={logout}
          >
            <MdOutlineLogin className="text-gray-500 text-xl" />
            <span className="ml-2 text-gray-700">Se déconnecter</span>
          </button>
        </div>
      </div>

      <style jsx="true">{`
        body {
          overflow-y: hidden; /* Masquer la barre de défilement sur le corps */
        }
        .Sidebar::-webkit-scrollbar {
          width: ${showScrollbar ? '8px' : '0px'}; /* Largeur de la barre de défilement */
        }
        .Sidebar::-webkit-scrollbar-thumb {
          background-color: gray; /* Couleur de la barre de défilement */
          border-radius: 10px; /* Coins arrondis */
        }
      `}</style>
    </>
  );
}
