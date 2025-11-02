import React, { useState, useEffect, useContext } from "react";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import AuthContext from "../AuthContext";
import API_URL from "../config/api";

function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [purchase, setAllPurchaseData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchPurchaseData();
    fetchProductsData();
  }, [updatePage]);

  // Fetching Data of All Purchase items
  const fetchPurchaseData = () => {
    fetch(`${API_URL}/api/purchase/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllPurchaseData(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`${API_URL}/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  };

  // Modal for Sale Add
  const addSaleModalSetting = () => {
    setPurchaseModal(!showPurchaseModal);
  };

  
  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-100 min-h-screen">
      <div className="flex flex-col gap-4 w-11/12 p-3">
        {showPurchaseModal && (
          <AddPurchaseDetails
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            handlePageUpdate={handlePageUpdate}
            authContext = {authContext}
          />
        )}

        {/* Statistics Cards */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 shadow-lg">
          <span className="font-semibold px-4 text-slate-800">Purchase Overview</span>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4">
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-blue-600 text-base">
                Total Purchases
              </span>
              <span className="font-semibold text-slate-700 text-base">
                {purchase.length}
              </span>
              <span className="font-thin text-slate-500 text-xs">
                This month
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 sm:border-y-2 md:border-x-2 md:border-y-0 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-green-600 text-base">
                Total Amount
              </span>
              <span className="font-semibold text-slate-700 text-base">
                ₹{purchase.reduce((sum, item) => sum + (item.TotalPurchaseAmount || 0), 0).toLocaleString('en-IN')}
              </span>
              <span className="font-thin text-slate-500 text-xs">
                Total spent
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 sm:border-y-2 md:border-x-2 md:border-y-0 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg border border-purple-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-purple-600 text-base">
                Avg Purchase
              </span>
              <span className="font-semibold text-slate-700 text-base">
                ₹{purchase.length > 0 ? Math.round(purchase.reduce((sum, item) => sum + (item.TotalPurchaseAmount || 0), 0) / purchase.length).toLocaleString('en-IN') : '0'}
              </span>
              <span className="font-thin text-slate-500 text-xs">
                Per transaction
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 border-y-2 md:border-x-2 md:border-y-0 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg border border-orange-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-orange-600 text-base">
                Total Items
              </span>
              <span className="font-semibold text-slate-700 text-base">
                {purchase.reduce((sum, item) => sum + (item.QuantityPurchased || 0), 0)}
              </span>
              <span className="font-thin text-slate-500 text-xs">
                Units purchased
              </span>
            </div>
          </div>
        </div>

        {/* Table  */}
        <div className="overflow-x-auto rounded-xl border bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-slate-200/50 shadow-lg">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold text-slate-800">Purchase Details</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold p-2 text-xs rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                onClick={addSaleModalSetting}
              >
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add Purchase
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-slate-200/50 text-sm">
            <thead>
              <tr className="bg-slate-100/50">
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  Product Name
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  Quantity Purchased
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  Purchase Date
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  Total Purchase Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/50">
              {purchase.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                    No purchases found. Add your first purchase to get started.
                  </td>
                </tr>
              ) : (
                purchase.map((element, index) => {
                return (
                  <tr key={element._id} className="hover:bg-white/50 transition-colors duration-200">
                    <td className="whitespace-nowrap px-4 py-2 text-slate-800 font-medium">
                      {element.ProductID?.name || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                      {element.QuantityPurchased || 0}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                      {element.PurchaseDate && new Date(element.PurchaseDate).toLocaleDateString() ==
                      new Date().toLocaleDateString()
                        ? "Today"
                        : element.PurchaseDate || 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700 font-semibold">
                      ₹{(element.TotalPurchaseAmount || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PurchaseDetails;
