import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "./SideMenu";

function Layout() {
  return (
    <>
      <div className="bg-gray-100 flex h-screen">
        <div className="h-screen sticky top-0 hidden lg:flex">
          <SideMenu />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
