import React, { useState, useEffect, useContext } from "react";
import AddStore from "../components/AddStore";
import AuthContext from "../AuthContext";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([
    {
      _id: "1",
      name: "Mumbai Central",
      address: "123 MG Road, Fort",
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=300&fit=crop"
    },
    {
      _id: "2",
      name: "Delhi NCR",
      address: "456 Connaught Place",
      city: "New Delhi",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&h=300&fit=crop"
    },
    {
      _id: "3",
      name: "Bangalore Tech",
      address: "789 Brigade Road",
      city: "Bangalore",
      image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=500&h=300&fit=crop"
    }
  ]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    // Commented out API call to show hardcoded data
    // fetchData();
  }, []);

  // Fetching all stores data
  const fetchData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-100 min-h-screen">
      <div className="flex flex-col gap-4 w-11/12 p-3">
        {/* Statistics Cards */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 shadow-lg">
          <span className="font-semibold px-4 text-slate-800">Store Overview</span>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4">
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-blue-600 text-base">
                Total Stores
              </span>
              <span className="font-semibold text-slate-700 text-base">
                {stores.length}
              </span>
              <span className="font-thin text-slate-500 text-xs">
                Active locations
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 sm:border-y-2 md:border-x-2 md:border-y-0 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-green-600 text-base">
                Cities Covered
              </span>
              <span className="font-semibold text-slate-700 text-base">
                {new Set(stores.map(store => store.city)).size}
              </span>
              <span className="font-thin text-slate-500 text-xs">
                Different cities
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 sm:border-y-2 md:border-x-2 md:border-y-0 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg border border-purple-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-purple-600 text-base">
                Top City
              </span>
              <span className="font-semibold text-slate-700 text-base">
                {stores.length > 0 ? stores[0].city : 'N/A'}
              </span>
              <span className="font-thin text-slate-500 text-xs">
                Most stores
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 border-y-2 md:border-x-2 md:border-y-0 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg border border-orange-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-orange-600 text-base">
                Store Status
              </span>
              <span className="font-semibold text-slate-700 text-base">
                All Active
              </span>
              <span className="font-thin text-slate-500 text-xs">
                100% operational
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-[#f5f5dc] text-xl">Manage Stores</span>
          <button
            className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold p-2 text-xs rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            onClick={modalSetting}
          >
            Add Store
          </button>
        </div>
        {showModal && <AddStore />}
        {/* Store Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((element, index) => {
            return (
              <div
                className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200/50 overflow-hidden"
                key={element._id}
              >
                <div className="relative">
                  <img
                    alt="store"
                    className="h-36 w-full object-cover"
                    src={element.image}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-slate-700">
                    Store #{index + 1}
                  </div>
                </div>
                <div className="p-3 flex flex-col gap-2">
                  <span className="font-bold text-slate-800 text-base">{element.name}</span>
                  <div className="flex items-center gap-2">
                    <img
                      alt="location-icon"
                      className="h-4 w-4 text-slate-600"
                      src={require("../assets/location-icon.png")}
                    />
                    <span className="text-slate-700 text-xs">{element.address + ", " + element.city}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {element.city}
                    </span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Store;
