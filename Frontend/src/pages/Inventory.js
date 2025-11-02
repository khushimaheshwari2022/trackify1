import React, { useState, useEffect, useContext } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";
import API_URL from "../config/api";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchProductsData();
    fetchSalesData();
  }, [updatePage]);

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`${API_URL}/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  };

  // Fetching Data of Search Products
  const fetchSearchData = () => {
    if (!searchTerm || searchTerm.trim() === '') {
      fetchProductsData();
      return;
    }
    fetch(`${API_URL}/api/product/search?searchTerm=${searchTerm}&userId=${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data || []);
      })
      .catch((err) => {
        console.log(err);
        fetchProductsData();
      });
  };

  // Fetching all stores data
  const fetchSalesData = () => {
    fetch(`${API_URL}/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  // Modal for Product ADD
  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  // Modal for Product UPDATE
  const updateProductModalSetting = (selectedProductData) => {
    console.log("Clicked: edit");
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };


  // Delete item
  const deleteItem = (id) => {
    console.log("Product ID: ", id);
    console.log(`${API_URL}/api/product/delete/${id}`);
    fetch(`${API_URL}/api/product/delete/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdatePage(!updatePage);
      });
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  // Handle Search Term
  const handleSearchTerm = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    
    if (searchValue.trim() === '') {
      // Reset to all products
      fetchProductsData();
    } else {
      // Use API search
      fetchSearchData();
    }
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-100 min-h-screen">
      <div className="flex flex-col gap-4 w-11/12 p-3">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 shadow-lg">
          <span className="font-semibold px-4 text-slate-800">Overall Inventory</span>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-4">
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-blue-600 text-base">
                Total Products
              </span>
              <span className="font-semibold text-slate-700 text-base">
                {products.length}
              </span>
              <span className="font-thin text-slate-500 text-xs">
                Last 7 days
              </span>
            </div>
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 sm:border-y-2 md:border-x-2 md:border-y-0 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-lg border border-yellow-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-yellow-600 text-base">
                Stores
              </span>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700 text-base">
                    {stores.length}
                  </span>
                  <span className="font-thin text-slate-500 text-xs">
                    Total stores
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700 text-base">
                    ₹{products.reduce((sum, item) => sum + ((item.price || 0) * (item.stock || 0)), 0).toLocaleString('en-IN')}
                  </span>
                  <span className="font-thin text-slate-500 text-xs">
                    Total Value
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 sm:border-y-2 md:border-x-2 md:border-y-0 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg border border-purple-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-purple-600 text-base">
                Top Selling
              </span>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700 text-base">
                    {products.length > 0 ? products.sort((a, b) => (b.price || 0) - (a.price || 0))[0]?.name || 'N/A' : 'N/A'}
                  </span>
                  <span className="font-thin text-slate-500 text-xs">
                    Highest Price
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700 text-base">
                    ₹{products.length > 0 ? (products.sort((a, b) => (b.price || 0) - (a.price || 0))[0]?.price || 0).toLocaleString('en-IN') : '0'}
                  </span>
                  <span className="font-thin text-slate-500 text-xs">Price</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 w-full md:w-1/4 border-y-2 md:border-x-2 md:border-y-0 bg-gradient-to-br from-red-50 to-rose-100 rounded-lg border border-red-200/50 shadow-sm min-h-[120px]">
              <span className="font-semibold text-red-600 text-base">
                Low Stocks
              </span>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700 text-base">
                    {products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length}
                  </span>
                  <span className="font-thin text-slate-500 text-xs">
                    Low Stock
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-700 text-base">
                    {products.filter(p => (p.stock || 0) === 0).length}
                  </span>
                  <span className="font-thin text-slate-500 text-xs">
                    Out of Stock
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
          />
        )}

        {/* Table  */}
        <div className="overflow-x-auto rounded-xl border bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-slate-200/50 shadow-lg">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold text-slate-800">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md border-slate-300/50 bg-white/80">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold p-2 text-xs rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                onClick={addProductModalSetting}
              >
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add Product
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-slate-200/50 text-sm">
            <thead>
              <tr className="bg-slate-100/50">
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  Products
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  Manufacturer
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  Stock
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  Price
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  Description
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  Availibility
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-slate-800">
                  More
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                products.map((element, index) => {
                return (
                  <tr key={element._id} className="hover:bg-white/50 transition-colors duration-200">
                    <td className="whitespace-nowrap px-4 py-2 text-slate-800 font-medium">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                      {element.manufacturer}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                      {element.stock}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700 font-semibold">
                      ₹{(element.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                      {element.description}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                      {element.stock > 0 ? "In Stock" : "Not in Stock"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                      <span
                        className="text-green-700 cursor-pointer hover:text-green-800 font-medium transition-colors duration-200"
                        onClick={() => updateProductModalSetting(element)}
                      >
                        Edit{" "}
                      </span>
                      <span
                        className="text-red-600 px-2 cursor-pointer hover:text-red-700 font-medium transition-colors duration-200"
                        onClick={() => deleteItem(element._id)}
                      >
                        Delete
                      </span>
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

export default Inventory;
