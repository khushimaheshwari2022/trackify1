import React from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "./SideMenu";

function Layout() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        {/* Fixed Sidebar - stays in place when scrolling */}
        <aside className="fixed left-0 top-0 h-screen z-50 hidden lg:block">
          <SideMenu />
        </aside>
        {/* Main Content with left margin to account for fixed sidebar (collapsed width: 64px) */}
        <main className="lg:ml-16 min-h-screen">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;
