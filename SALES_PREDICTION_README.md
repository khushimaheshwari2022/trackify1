# Sales Prediction Feature - AI/ML Integration

## Overview
This feature adds AI-powered sales forecasting to your inventory management system using **Linear Regression**. It analyzes historical sales data and predicts future sales for the next 7, 14, or 30 days.

## Technology Stack
- **Backend**: Node.js with `ml-regression` library (already installed in your package.json)
- **Algorithm**: Simple Linear Regression
- **Frontend**: React with ApexCharts for visualization

## What Was Added

### Backend (`Backend/controller/sales.js`)
1. **`getSalesPrediction(userID, days)`** - Predicts overall sales for a user
   - Aggregates sales by date
   - Trains linear regression model on historical data
   - Predicts future sales amounts
   - Returns statistics (R² score, trend, averages)

2. **`getProductSalesPrediction(userID, productID, days)`** - Predicts sales for a specific product
   - Analyzes product-specific sales history
   - Predicts quantity sold for the product

### Backend Routes (`Backend/router/sales.js`)
- `GET /api/sales/predict/:userID?days=7` - Get overall sales predictions
- `GET /api/sales/predict/:userID/product/:productID?days=7` - Get product-specific predictions

### Frontend (`Frontend/src/pages/SalesPrediction.js`)
- New page with interactive charts
- Filter by product
- Adjustable prediction period (7/14/30 days)
- Statistics dashboard showing:
  - Average historical sales
  - Average predicted sales
  - Model accuracy (R² score)
  - Sales trend (Growing/Declining/Stable)
- Detailed predictions table with confidence scores

### Navigation
- Added route in `App.js`: `/sales-prediction`
- Added navigation link in `SideMenu.js` with icon

## How It Works

1. **Data Collection**: Fetches all historical sales data for the user (or specific product)
2. **Aggregation**: Groups sales by date and calculates daily totals
3. **Model Training**: Uses linear regression to find the relationship between time and sales
4. **Prediction**: Extrapolates the trend to predict future dates
5. **Confidence Calculation**: Confidence decreases as predictions go further into the future

## Usage

1. Navigate to "Predictions" in the sidebar
2. Select prediction period (7, 14, or 30 days)
3. Optionally filter by a specific product
4. View predictions in the chart and detailed table

## API Endpoints

### Get Overall Sales Prediction
```
GET /api/sales/predict/:userID?days=7
```
Response:
```json
{
  "predictions": [
    {
      "date": "2025-01-17",
      "predictedAmount": 1234.56,
      "confidence": 85.5
    }
  ],
  "historicalData": [...],
  "statistics": {
    "averageHistoricalAmount": 1000,
    "averagePredictedAmount": 1100,
    "r2": 0.85,
    "slope": 12.5,
    "intercept": 500
  }
}
```

### Get Product-Specific Prediction
```
GET /api/sales/predict/:userID/product/:productID?days=7
```
Response:
```json
{
  "predictions": [
    {
      "date": "2025-01-17",
      "predictedQuantity": 5.2,
      "confidence": 82.0
    }
  ],
  "product": {...},
  "historicalData": [...]
}
```

## Why Linear Regression?

- **Fast**: Trains instantly, perfect for one-day implementation
- **Simple**: Easy to understand and explain
- **Effective**: Works well for trend-based predictions
- **Lightweight**: No external ML services needed
- **Works with small datasets**: Works even with just a few data points

## Future Enhancements (Optional)

If you want to improve this later:
1. **Seasonality Detection**: Add monthly/weekly patterns
2. **Moving Average**: Use exponential smoothing
3. **External Factors**: Include promotions, holidays
4. **Multiple Models**: Compare different algorithms
5. **Confidence Intervals**: Show prediction ranges

## Testing

To test the feature:
1. Make sure you have at least 2-3 sales records
2. Navigate to `/sales-prediction`
3. You should see predictions based on your historical data

If you don't have enough data, the system will show a helpful message.

## Notes

- Predictions are based on historical trends - they won't account for sudden market changes
- More historical data = better predictions
- Confidence scores are estimates based on data volume and prediction horizon
- The model assumes a linear trend, which works well for short-term predictions
