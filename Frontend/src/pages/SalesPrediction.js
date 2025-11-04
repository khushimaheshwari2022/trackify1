import React, { useState, useEffect, useContext } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import API_URL from "../config/api";

function SalesPrediction() {
  const [predictions, setPredictions] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictionDays, setPredictionDays] = useState(7);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productPredictions, setProductPredictions] = useState(null);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchPredictions();
    fetchProducts();
  }, [predictionDays]);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductPredictions(selectedProduct);
    } else {
      setProductPredictions(null);
    }
  }, [selectedProduct, predictionDays]);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/sales/predict/${authContext.user}?days=${predictionDays}`
      );
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setPredictions(data.predictions || []);
        setHistoricalData(data.historicalData || []);
        setStatistics(data.statistics || null);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load predictions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/product/get/${authContext.user}`);
      const data = await response.json();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  const fetchProductPredictions = async (productId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/sales/predict/${authContext.user}/product/${productId}?days=${predictionDays}`
      );
      const data = await response.json();
      
      if (!data.error) {
        setProductPredictions(data);
      }
    } catch (err) {
      console.error("Failed to load product predictions", err);
    }
  };

  // Prepare chart data
  const getChartData = () => {
    const historical = historicalData.map((item) => ({
      x: item.date,
      y: item.totalAmount,
    }));

    const predicted = predictions.map((item) => ({
      x: item.date,
      y: item.predictedAmount,
    }));

    return {
      historical,
      predicted,
    };
  };

  const chartData = getChartData();
  
  const chartOptions = {
    chart: {
      id: "sales-prediction",
      background: "#1e293b",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
      },
    },
    theme: {
      mode: "dark",
      palette: "palette1",
    },
    colors: ["#60a5fa", "#34d399"],
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#cbd5e1",
          fontSize: "12px",
        },
      },
      axisBorder: {
        color: "#475569",
      },
      axisTicks: {
        color: "#475569",
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#cbd5e1",
          fontSize: "12px",
        },
        formatter: (value) => `₹${value.toLocaleString('en-IN')}`,
      },
    },
    grid: {
      borderColor: "#475569",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#cbd5e1",
      },
    },
    markers: {
      size: 4,
    },
    tooltip: {
      theme: "dark",
    },
  };

  const chartSeries = [
    {
      name: "Historical Sales",
      data: chartData.historical.map((item) => [new Date(item.x).getTime(), item.y]),
    },
    {
      name: "Predicted Sales",
      data: chartData.predicted.map((item) => [new Date(item.date).getTime(), item.predictedAmount]),
      strokeDashArray: 5,
    },
  ];

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-100 min-h-screen">
      <div className="flex flex-col gap-4 w-11/12 p-3">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">Sales Predictions</h1>
              <p className="text-sm text-slate-600 mt-1">AI-powered forecasting using linear regression</p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Period
                </label>
                <select
                  value={predictionDays}
                  onChange={(e) => setPredictionDays(parseInt(e.target.value))}
                  className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
              <div className="min-w-[180px]">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Product
                </label>
                <select
                  value={selectedProduct || ""}
                  onChange={(e) => setSelectedProduct(e.target.value || null)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Products</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={fetchPredictions}
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-8 text-center shadow-lg">
            <p className="text-slate-600">Loading predictions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Statistics Cards */}
            {statistics && !selectedProduct && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200/50 shadow-sm">
                  <span className="font-semibold text-blue-600 text-sm">Avg Historical</span>
                  <span className="font-semibold text-slate-700 text-lg">
                    ₹{statistics.averageHistoricalAmount?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border border-green-200/50 shadow-sm">
                  <span className="font-semibold text-green-600 text-sm">Avg Predicted</span>
                  <span className="font-semibold text-slate-700 text-lg">
                    ₹{statistics.averagePredictedAmount?.toLocaleString('en-IN') || '0'}
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-4 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg border border-purple-200/50 shadow-sm">
                  <span className="font-semibold text-purple-600 text-sm">Accuracy</span>
                  <span className="font-semibold text-slate-700 text-lg">
                    {(statistics.r2 * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-4 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg border border-amber-200/50 shadow-sm">
                  <span className="font-semibold text-amber-600 text-sm">Trend</span>
                  <span className="font-semibold text-slate-700 text-lg">
                    {statistics.slope > 0 ? "↗ Growing" : statistics.slope < 0 ? "↘ Declining" : "→ Stable"}
                  </span>
                </div>
              </div>
            )}

            {/* Chart Section */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 shadow-lg">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 px-2">
                {selectedProduct 
                  ? `${products.find(p => p._id === selectedProduct)?.name || 'Product'} Sales Forecast`
                  : "Overall Sales Forecast"}
              </h2>
              {chartData.historical.length > 0 || predictions.length > 0 ? (
                <div className="bg-slate-800 rounded-lg p-4">
                  <Chart
                    options={chartOptions}
                    series={selectedProduct && productPredictions 
                      ? [
                          {
                            name: "Historical Quantity",
                            data: (productPredictions.historicalData || []).map((item) => [
                              new Date(item.date).getTime(),
                              item.quantity,
                            ]),
                          },
                          {
                            name: "Predicted Quantity",
                            data: (productPredictions.predictions || []).map((item) => [
                              new Date(item.date).getTime(),
                              item.predictedQuantity,
                            ]),
                            strokeDashArray: 5,
                          },
                        ]
                      : chartSeries
                    }
                    type="line"
                    height={350}
                  />
                </div>
              ) : (
                <div className="bg-slate-800 rounded-lg p-8 text-center">
                  <p className="text-slate-400">
                    Insufficient data for prediction. Add more sales records to see predictions.
                  </p>
                </div>
              )}
            </div>

            {/* Predictions Table */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 shadow-lg">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 px-2">Detailed Predictions</h2>
              {selectedProduct && productPredictions ? (
                <div className="bg-slate-800 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                      <thead className="bg-slate-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Confidence
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-slate-800 divide-y divide-slate-700">
                        {productPredictions.predictions?.map((prediction, index) => (
                          <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
                              {new Date(prediction.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-100">
                              {prediction.predictedQuantity?.toFixed(1) || 'N/A'} units
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-slate-600 rounded-full h-1.5">
                                  <div
                                    className="bg-green-400 h-1.5 rounded-full"
                                    style={{ width: `${prediction.confidence}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs">{prediction.confidence?.toFixed(0)}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                      <thead className="bg-slate-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                            Confidence
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-slate-800 divide-y divide-slate-700">
                        {predictions.length > 0 ? (
                          predictions.map((prediction, index) => (
                            <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
                                {new Date(prediction.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-100">
                                ₹{prediction.predictedAmount?.toLocaleString('en-IN') || '0'}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-slate-600 rounded-full h-1.5">
                                    <div
                                      className="bg-green-400 h-1.5 rounded-full"
                                      style={{ width: `${prediction.confidence}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs">{prediction.confidence?.toFixed(0)}%</span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-4 py-8 text-center text-slate-400 text-sm">
                              No predictions available. Add more sales data to generate predictions.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SalesPrediction;
