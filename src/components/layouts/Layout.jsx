import Header from "../headers/Header";
import Sidebar from "../sidebars/Sidebar";
import {Outlet, useLocation} from 'react-router-dom'

const noMainPath = ["/authentification","/authentification/forgot-password"];

function Layout({ showHeaderAndSidebar }) {
  const location = useLocation();

  if (noMainPath.includes(location.pathname)) {
    return (
      <div className="flex">
        {showHeaderAndSidebar && (
          <>
            <Header />
            <Sidebar />
          </>
        )}

        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex">
      {showHeaderAndSidebar && (
        <>
          <Header />
          <Sidebar />
        </>
      )}
      <main className="
         flex-1 pl-5 relative w-full lg:left-[250px] top-[100px] 
        overflow-x-scroll lg:overflow-x-hidden h-auto">
        <div className="
          w-full max-w-[1040px] h-screen flex flex-row flex-wrap gap-7
          max-h-[calc(100%-80px)] fixed bg-white pb-40 layoutDark
          overflow-y-scroll overflow-x-scroll scrollbar-custom text-gray-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
