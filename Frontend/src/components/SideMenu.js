import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";

function SideMenu() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const [hovered, setHovered] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const expanded = hovered; // expand when hovered

  const handleSignOut = () => {
    authContext.signout();
    navigate("/login");
  };

  return (
    <div
      className={`h-screen flex flex-col justify-between transition-all duration-300 ${expanded ? "w-64" : "w-16"} bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo at top */}
      <div className="px-2 py-4 border-b border-white/20 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <img
            className="h-12 w-auto drop-shadow-lg"
            src={require("../assets/onlylogo.png")}
            alt="Trackify Logo"
          />
        </div>
      </div>
      
      <div className="px-2 py-4">
        <nav aria-label="Main Nav" className="mt-2 flex flex-col space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 px-2 py-2 text-white/90 hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            {expanded && <span className="text-sm font-medium"> Dashboard </span>}
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-white/80 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105">
              <Link to="/inventory">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 7h-8v6h8V7zm-2 4h-4V9h4v2zm4-12H3C1.9 1 1 1.9 1 3v18c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H3V5h18v14z"/>
                  </svg>
                  {expanded && <span className="text-sm font-medium"> Inventory </span>}
                </div>
              </Link>
            </summary>
          </details>

          <Link
            to="/purchase-details"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-white/80 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 7h-3V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6h4v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
            </svg>
            {expanded && <span className="text-sm font-medium"> Purchase Details</span>}
          </Link>
          <Link
            to="/sales"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-white/80 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
            </svg>
            {expanded && <span className="text-sm font-medium"> Sales</span>}
          </Link>

          <Link
            to="/sales-prediction"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-white/80 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
            {expanded && <span className="text-sm font-medium"> Predictions</span>}
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-white/80 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105">
              <Link to="/manage-store">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {expanded && <span className="text-sm font-medium"> Manage Store </span>}
                </div>
              </Link>
            </summary>
          </details>
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-white/20 relative bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
        <div 
          className="flex items-center gap-2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 p-3 hover:from-slate-700/90 hover:to-slate-600/90 cursor-pointer transition-all duration-200 hover:shadow-lg"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <img
            alt="Profile"
            src={localStorageData.imageUrl}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20 shadow-lg"
          />

          {expanded && (
            <div className="flex-1">
              <p className="text-xs">
                <strong className="block font-medium text-white">
                  {localStorageData.firstName + " " + localStorageData.lastName}
                </strong>

                <span className="text-white/80"> {localStorageData.email} </span>
              </p>
            </div>
          )}

          {/* Dropdown arrow */}
          <svg 
            className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Profile dropdown menu */}
        {showProfileMenu && (
          <div className="absolute bottom-full left-0 right-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50 rounded-lg shadow-2xl mb-1 z-50 backdrop-blur-sm">
            <div className="py-1">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-gradient-to-r hover:from-slate-700/80 hover:to-slate-600/80 hover:text-white flex items-center gap-2 transition-all duration-200 rounded-md mx-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideMenu;
