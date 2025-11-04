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
      background: "transparent",
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    theme: {
      mode: "light",
      palette: "palette1",
    },
    colors: ["#3b82f6", "#10b981", "#f59e0b"],
    xaxis: {
      type: "datetime",
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
        formatter: (value) => `₹${value.toLocaleString('en-IN')}`,
      },
      title: {
        text: "Sales Amount (₹)",
        style: {
          color: "#64748b",
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
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#64748b",
      },
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
  };

  const chartSeries = [
    {
      name: "Historical Sales",
      data: chartData.historical.map((item) => [new Date(item.x).getTime(), item.y]),
      type: "line",
    },
    {
      name: "Predicted Sales",
      data: chartData.predicted.map((item) => [new Date(item.date).getTime(), item.predictedAmount]),
      type: "line",
      strokeDashArray: 5,
    },
  ];

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-100 min-h-screen p-4">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Sales Predictions</h1>
          <p className="text-slate-300">
            AI-powered sales forecasting using linear regression
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prediction Period (Days)
              </label>
              <select
                value={predictionDays}
                onChange={(e) => setPredictionDays(parseInt(e.target.value))}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Filter by Product (Optional)
              </label>
              <select
                value={selectedProduct || ""}
                onChange={(e) => setSelectedProduct(e.target.value || null)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Predictions
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center">
            <p className="text-slate-600">Loading predictions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Statistics Cards */}
            {statistics && !selectedProduct && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg">
                  <h3 className="text-sm font-medium text-blue-700 mb-2">
                    Average Historical
                  </h3>
                  <p className="text-2xl font-bold text-blue-900">
                    ₹{statistics.averageHistoricalAmount?.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg">
                  <h3 className="text-sm font-medium text-green-700 mb-2">
                    Average Predicted
                  </h3>
                  <p className="text-2xl font-bold text-green-900">
                    ₹{statistics.averagePredictedAmount?.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg">
                  <h3 className="text-sm font-medium text-purple-700 mb-2">
                    Model Accuracy (R²)
                  </h3>
                  <p className="text-2xl font-bold text-purple-900">
                    {(statistics.r2 * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-lg">
                  <h3 className="text-sm font-medium text-amber-700 mb-2">
                    Trend
                  </h3>
                  <p className="text-2xl font-bold text-amber-900">
                    {statistics.slope > 0 ? "↗️ Growing" : statistics.slope < 0 ? "↘️ Declining" : "→ Stable"}
                  </p>
                </div>
              </div>
            )}

            {/* Main Chart */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                {selectedProduct 
                  ? `Sales Prediction: ${products.find(p => p._id === selectedProduct)?.name || 'Product'}`
                  : "Overall Sales Prediction"}
              </h2>
              {chartData.historical.length > 0 || predictions.length > 0 ? (
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
                          type: "line",
                        },
                        {
                          name: "Predicted Quantity",
                          data: (productPredictions.predictions || []).map((item) => [
                            new Date(item.date).getTime(),
                            item.predictedQuantity,
                          ]),
                          type: "line",
                          strokeDashArray: 5,
                        },
                      ]
                    : chartSeries
                  }
                  type="line"
                  height={400}
                />
              ) : (
                <p className="text-slate-500 text-center py-8">
                  Insufficient data for prediction. Add more sales records to see predictions.
                </p>
              )}
            </div>

            {/* Predictions Table */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                Detailed Predictions
              </h2>
              {selectedProduct && productPredictions ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Predicted Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Confidence
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {productPredictions.predictions?.map((prediction, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {new Date(prediction.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            {prediction.predictedQuantity?.toFixed(2) || 'N/A'} units
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center">
                              <div className="w-24 bg-slate-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${prediction.confidence}%` }}
                                ></div>
                              </div>
                              <span>{prediction.confidence?.toFixed(0)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Predicted Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Confidence
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {predictions.map((prediction, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {new Date(prediction.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                            ₹{prediction.predictedAmount?.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <div className="flex items-center">
                              <div className="w-24 bg-slate-200 rounded-full h-2 mr-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${prediction.confidence}%` }}
                                ></div>
                              </div>
                              <span>{prediction.confidence?.toFixed(0)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {(!predictions || predictions.length === 0) && !selectedProduct && (
                <p className="text-slate-500 text-center py-4">
                  No predictions available. Add more sales data to generate predictions.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SalesPrediction;
