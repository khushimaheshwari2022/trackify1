import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
export const data = {
  labels: ["Apple", "Knorr", "Shoop", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [0, 1, 5, 8, 9, 15],
      borderColor: [
        "rgb(33, 6, 87)",
        "rgb(232, 182, 116)",
        "rgba(245, 158, 11, 1)",
        "rgb(18, 11, 43)",
        "rgb(203, 212, 178)",
        "rgba(36, 35, 4, 0.74)",
      ],
      backgroundColor: [
        "rgb(33, 6, 87)",
        "rgb(232, 182, 116)",
        "rgba(245, 158, 11, 1)",
        "rgb(18, 11, 43)",
        "rgb(203, 212, 178)",
        "rgba(36, 35, 4, 0.74)",
      ],
      borderWidth: 0,
    },
  ],
};

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);

  const [chart, setChart] = useState({
    options: {
      chart: {
        id: "basic-bar",
        background: "transparent",
        toolbar: {
          show: false,
        },
      },
      theme: {
        mode: "light",
        palette: "palette1",
      },
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
      },
      grid: {
        borderColor: "#e2e8f0",
        strokeDashArray: 4,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
    },
    series: [
      {
        name: "series",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  // Update Chart Data
  const updateChartData = (salesData) => {
    setChart({
      ...chart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: [...salesData],
        },
      ],
    });
  };

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
  }, []);

  // Fetching total sales amount
  const fetchTotalSaleAmount = () => {
    fetch(
      `http://localhost:4000/api/sales/get/${authContext.user}/totalsaleamount`
    )
      .then((response) => response.json())
      .then((datas) => setSaleAmount(datas.totalSaleAmount));
  };

  // Fetching total purchase amount
  const fetchTotalPurchaseAmount = () => {
    fetch(
      `http://localhost:4000/api/purchase/get/${authContext.user}/totalpurchaseamount`
    )
      .then((response) => response.json())
      .then((datas) => setPurchaseAmount(datas.totalPurchaseAmount));
  };

  // Fetching all stores data
  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setStores(datas));
  };

  // Fetching Data of All Products
  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setProducts(datas))
      .catch((err) => console.log(err));
  };

  // Fetching Monthly Sales
  const fetchMonthlySalesData = () => {
    fetch(`http://localhost:4000/api/sales/getmonthly`)
      .then((response) => response.json())
      .then((datas) => updateChartData(datas.salesAmount))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-4 md:grid-cols-3 lg:grid-cols-4 p-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-100 min-h-screen">
        <article className="group flex flex-col gap-3 rounded-xl border border-slate-200/50 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-slate-300/50 backdrop-blur-sm">
          <div className="inline-flex gap-2 self-end rounded-full bg-gradient-to-r from-emerald-100 to-green-100 p-2 text-emerald-700 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span className="text-xs font-semibold"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-semibold text-slate-600">
              Sales
            </strong>

            <p>
              <span className="text-2xl font-bold text-slate-900">
                ${saleAmount}
              </span>

              <span className="text-xs text-slate-500"> from $240.94 </span>
            </p>
          </div>
        </article>

        <article className="group flex flex-col gap-3 rounded-xl border border-slate-200/50 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-slate-300/50 backdrop-blur-sm">
          <div className="inline-flex gap-2 self-end rounded-full bg-gradient-to-r from-red-100 to-rose-100 p-2 text-red-700 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span className="text-xs font-semibold"> 67.81% </span>
          </div>

          <div>
            <strong className="block text-sm font-semibold text-slate-600">
              Purchase
            </strong>

            <p>
              <span className="text-2xl font-bold text-slate-900">
                {" "}
                ${purchaseAmount}{" "}
              </span>

              <span className="text-xs text-slate-500"> from $404.32 </span>
            </p>
          </div>
        </article>
        <article className="group flex flex-col gap-3 rounded-xl border border-slate-200/50 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-slate-300/50 backdrop-blur-sm">
          <div className="inline-flex gap-2 self-end rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 p-2 text-blue-700 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>

            <span className="text-xs font-semibold"> {products.length} </span>
          </div>

          <div>
            <strong className="block text-sm font-semibold text-slate-600">
              Total Products
            </strong>

            <p>
              <span className="text-2xl font-bold text-slate-900">
                {" "}
                {products.length}{" "}
              </span>

              {/* <span className="text-xs text-slate-500"> from $404.32 </span> */}
            </p>
          </div>
        </article>
        <article className="group flex flex-col gap-3 rounded-xl border border-slate-200/50 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-slate-300/50 backdrop-blur-sm">
          <div className="inline-flex gap-2 self-end rounded-full bg-gradient-to-r from-purple-100 to-violet-100 p-2 text-purple-700 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>

            <span className="text-xs font-semibold"> {stores.length} </span>
          </div>

          <div>
            <strong className="block text-sm font-semibold text-slate-600">
              Total Stores
            </strong>

            <p>
              <span className="text-2xl font-bold text-slate-900">
                {" "}
                {stores.length}{" "}
              </span>

              {/* <span className="text-xs text-slate-500"> from 0 </span> */}
            </p>
          </div>
        </article>
        <div className="group flex justify-around bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl py-6 col-span-full justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-slate-200/50 backdrop-blur-sm">
          <div className="transform group-hover:scale-105 transition-transform duration-300">
            <Chart
              options={chart.options}
              series={chart.series}
              type="bar"
              width="500"
            />
          </div>
          <div className="transform group-hover:scale-105 transition-transform duration-300">
            <Doughnut data={data} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
