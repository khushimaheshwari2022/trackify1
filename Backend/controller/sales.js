const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");
const SimpleLinearRegression = require("ml-regression").SimpleLinearRegression;

// Add Sales
const addSales = (req, res) => {
  const addSale = new Sales({
    userID: req.body.userID,
    ProductID: req.body.productID,
    StoreID: req.body.storeID,
    StockSold: req.body.stockSold,
    SaleDate: req.body.saleDate,
    TotalSaleAmount: req.body.totalSaleAmount,
  });

  addSale
    .save()
    .then((result) => {
      soldStock(req.body.productID, req.body.stockSold);
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Sales Data
const getSalesData = async (req, res) => {
  const findAllSalesData = await Sales.find({"userID": req.params.userID})
    .sort({ _id: -1 })
    .populate("ProductID")
    .populate("StoreID"); // -1 for descending order
  res.json(findAllSalesData);
};

// Get total sales amount
const getTotalSalesAmount = async(req,res) => {
  let totalSaleAmount = 0;
  const salesData = await Sales.find({"userID": req.params.userID});
  salesData.forEach((sale)=>{
    totalSaleAmount += sale.TotalSaleAmount;
  })
  res.json({totalSaleAmount});

}

const getMonthlySales = async (req, res) => {
  try {
    const sales = await Sales.find();

    // Initialize array with 12 zeros
    const salesAmount = [];
    salesAmount.length = 12;
    salesAmount.fill(0)

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;

      salesAmount[monthIndex] += sale.TotalSaleAmount;
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Sales Prediction using Linear Regression
const getSalesPrediction = async (req, res) => {
  try {
    const { userID } = req.params;
    const { days = 7 } = req.query; // Default to 7 days prediction

    // Get all sales data for the user, sorted by date
    const salesData = await Sales.find({ userID })
      .sort({ SaleDate: 1 }) // Sort ascending by date
      .populate("ProductID")
      .populate("StoreID");

    if (!salesData || salesData.length < 2) {
      return res.status(200).json({
        predictions: [],
        message: "Insufficient data for prediction. Need at least 2 sales records.",
        historicalData: []
      });
    }

    // Aggregate sales by date
    const salesByDate = {};
    salesData.forEach((sale) => {
      const date = sale.SaleDate;
      if (!salesByDate[date]) {
        salesByDate[date] = {
          date,
          totalAmount: 0,
          totalQuantity: 0,
          count: 0
        };
      }
      salesByDate[date].totalAmount += sale.TotalSaleAmount;
      salesByDate[date].totalQuantity += sale.StockSold;
      salesByDate[date].count += 1;
    });

    // Convert to arrays for regression
    const dates = Object.keys(salesByDate).sort();
    const historicalData = dates.map((date) => ({
      date,
      totalAmount: salesByDate[date].totalAmount,
      totalQuantity: salesByDate[date].totalQuantity,
      count: salesByDate[date].count
    }));

    // Prepare data for regression: use days since first sale as X, totalAmount as Y
    const firstDate = new Date(dates[0]);
    const X = dates.map((date) => {
      const currentDate = new Date(date);
      return Math.floor((currentDate - firstDate) / (1000 * 60 * 60 * 24)); // Days since first sale
    });
    const Y = dates.map((date) => salesByDate[date].totalAmount);

    // Train linear regression model
    const regression = new SimpleLinearRegression(X, Y);

    // Generate predictions for next N days
    const predictions = [];
    const lastDate = new Date(dates[dates.length - 1]);
    const lastX = X[X.length - 1];

    for (let i = 1; i <= parseInt(days); i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i);
      
      const futureX = lastX + i;
      const predictedAmount = Math.max(0, regression.predict(futureX)); // Ensure non-negative
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        predictedAmount: Math.round(predictedAmount * 100) / 100, // Round to 2 decimals
        confidence: calculateConfidence(salesData.length, i)
      });
    }

    // Calculate statistics
    const avgHistorical = Y.reduce((a, b) => a + b, 0) / Y.length;
    const avgPredicted = predictions.reduce((sum, p) => sum + p.predictedAmount, 0) / predictions.length;

    res.status(200).json({
      predictions,
      historicalData,
      statistics: {
        averageHistoricalAmount: Math.round(avgHistorical * 100) / 100,
        averagePredictedAmount: Math.round(avgPredicted * 100) / 100,
        r2: regression.score(X, Y), // R-squared score
        slope: regression.slope,
        intercept: regression.intercept
      }
    });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Server error during prediction", details: err.message });
  }
};

// Helper function to calculate confidence based on data points and prediction horizon
function calculateConfidence(dataPoints, daysAhead) {
  // More data points = higher confidence
  // Further into future = lower confidence
  let baseConfidence = Math.min(95, 50 + (dataPoints * 2)); // Cap at 95%
  const decayRate = daysAhead * 3; // 3% decay per day
  return Math.max(30, baseConfidence - decayRate); // Minimum 30% confidence
}

// Product-specific sales prediction
const getProductSalesPrediction = async (req, res) => {
  try {
    const { userID, productID } = req.params;
    const { days = 7 } = req.query;

    const salesData = await Sales.find({ userID, ProductID: productID })
      .sort({ SaleDate: 1 })
      .populate("ProductID");

    if (!salesData || salesData.length < 2) {
      return res.status(200).json({
        predictions: [],
        message: "Insufficient data for this product. Need at least 2 sales records.",
        product: salesData[0]?.ProductID || null
      });
    }

    // Aggregate by date for this product
    const salesByDate = {};
    salesData.forEach((sale) => {
      const date = sale.SaleDate;
      if (!salesByDate[date]) {
        salesByDate[date] = {
          date,
          quantity: 0,
          amount: 0
        };
      }
      salesByDate[date].quantity += sale.StockSold;
      salesByDate[date].amount += sale.TotalSaleAmount;
    });

    const dates = Object.keys(salesByDate).sort();
    const firstDate = new Date(dates[0]);
    const X = dates.map((date) => {
      const currentDate = new Date(date);
      return Math.floor((currentDate - firstDate) / (1000 * 60 * 60 * 24));
    });
    const Y = dates.map((date) => salesByDate[date].quantity); // Predict quantity sold

    const regression = new SimpleLinearRegression(X, Y);
    const predictions = [];
    const lastDate = new Date(dates[dates.length - 1]);
    const lastX = X[X.length - 1];

    for (let i = 1; i <= parseInt(days); i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i);
      
      const futureX = lastX + i;
      const predictedQuantity = Math.max(0, regression.predict(futureX));
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predictedQuantity: Math.round(predictedQuantity * 100) / 100,
        confidence: calculateConfidence(salesData.length, i)
      });
    }

    res.status(200).json({
      predictions,
      product: salesData[0].ProductID,
      historicalData: dates.map((date) => ({
        date,
        quantity: salesByDate[date].quantity,
        amount: salesByDate[date].amount
      }))
    });
  } catch (err) {
    console.error("Product prediction error:", err);
    res.status(500).json({ error: "Server error during prediction", details: err.message });
  }
};

module.exports = { 
  addSales, 
  getMonthlySales, 
  getSalesData, 
  getTotalSalesAmount,
  getSalesPrediction,
  getProductSalesPrediction
};
