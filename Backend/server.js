require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { main } = require("./models/index");

// Routers
const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");

// Models
const User = require("./models/users");
const Product = require("./models/product");

const app = express();

// Use PORT from environment (Render provides PORT automatically)
// For local development, use 4000 to match frontend
const PORT = process.env.PORT || 4000;

// Connect to MongoDB (Atlas or local)
main();

// Add connection status logging
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

// Middleware
app.use(express.json());

// CORS configuration - Allow requests from frontend
const allowedOrigins = [
  'http://localhost:3000', // Local development
  process.env.FRONTEND_URL  // Production frontend URL (set in Render)
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // For development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list or is a Vercel domain
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app');
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Routes
app.use("/api/store", storeRoute);
app.use("/api/product", productRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/sales", salesRoute);

// -------- Authentication APIs --------
let userAuthCheck;

// Login
app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (user) {
      res.send(user);
      userAuthCheck = user;
    } else {
      res.status(401).send("Invalid Credentials");
      userAuthCheck = null;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Get logged-in user
app.get("/api/login", (req, res) => {
  res.send(userAuthCheck);
});

// Registration
app.post("/api/register", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB is not connected. Connection state:", mongoose.connection.readyState);
      return res.status(503).json({ 
        message: "Database connection not available. Please check your MongoDB connection." 
      });
    }

    const registerUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
    });

    const result = await registerUser.save();
    console.log("User registered successfully:", result.email);
    res.status(200).send(result);
  } catch (err) {
    console.error("Signup Error: ", err);
    
    // Provide more specific error messages
    if (err.code === 11000) {
      // Duplicate key error (email already exists)
      return res.status(400).json({ 
        message: "Email already exists. Please use a different email." 
      });
    }
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error: " + Object.values(err.errors).map(e => e.message).join(', ') 
      });
    }

    res.status(500).json({ 
      message: err.message || "Failed to register user. Please try again." 
    });
  }
});

// Test route
app.get("/testget", async (req, res) => {
  try {
    const result = await Product.findOne({ _id: "6429979b2e5434138eda1564" });
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});
