require("dotenv").config(); // Load environment variables
const Store = require("./models/store");
const Product = require("./models/Product");
const Sales = require("./models/sales");
const Purchase = require("./models/purchase");
const User = require("./models/users");
const mongoose = require("mongoose");

// Sample data seeding function
async function seedData() {
  try {
    // Connect to database - use environment variable or fallback to local
    const uri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/InventoryManagementApp";
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");
    if (uri.includes("mongodb+srv://")) {
      console.log("Using MongoDB Atlas (cloud)");
    } else {
      console.log("Using local MongoDB");
    }

    // Find or create the specific user
    const userEmail = "khushimaheshwari1203@gmail.com";
    const userPassword = "khushi";
    
    let testUser = await User.findOne({ email: userEmail });
    
    if (!testUser) {
      // If user doesn't exist, create it
      testUser = new User({
        firstName: "Khushi",
        lastName: "Maheshwari",
        email: userEmail,
        password: userPassword,
        phoneNumber: 1234567890, // You can update this if needed
      });
      testUser = await testUser.save();
      console.log("Created user:", testUser._id, `(${testUser.email})`);
    } else {
      console.log("Using existing user:", testUser._id, `(${testUser.email})`);
    }

    const userId = testUser._id;

    // Clear existing data for this user (optional - comment out if you want to keep existing data)
    await Store.deleteMany({ userID: userId });
    await Product.deleteMany({ userID: userId });
    await Sales.deleteMany({ userID: userId });
    await Purchase.deleteMany({ userID: userId });
    console.log("Cleared existing data for user");

    // Seed Stores
    const storesData = [
      {
        userID: userId,
        name: "Mumbai Central",
        category: "Electronics",
        address: "123 MG Road, Fort",
        city: "Mumbai",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=300&fit=crop"
      },
      {
        userID: userId,
        name: "Delhi NCR",
        category: "Electronics",
        address: "456 Connaught Place",
        city: "New Delhi",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&h=300&fit=crop"
      },
      {
        userID: userId,
        name: "Bangalore Tech",
        category: "Phones",
        address: "789 Brigade Road",
        city: "Bangalore",
        image: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=500&h=300&fit=crop"
      },
      {
        userID: userId,
        name: "Chennai Plaza",
        category: "Groceries",
        address: "321 Marina Beach Road",
        city: "Chennai",
        image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=500&h=300&fit=crop"
      },
      {
        userID: userId,
        name: "Pune Mall",
        category: "Electronics",
        address: "654 FC Road",
        city: "Pune",
        image: "https://images.unsplash.com/photo-1494522358652-f17afa9cb6a3?w=500&h=300&fit=crop"
      },
      {
        userID: userId,
        name: "Hyderabad Hub",
        category: "SuperMart",
        address: "987 Banjara Hills",
        city: "Hyderabad",
        image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500&h=300&fit=crop"
      },
    ];

    const stores = await Store.insertMany(storesData);
    console.log(`Created ${stores.length} stores`);

    // Seed Products
    const productsData = [
      {
        userID: userId,
        name: "iPhone 15 Pro",
        manufacturer: "Apple",
        stock: 25,
        description: "Latest iPhone with A17 Pro chip, 256GB storage",
        price: 82917
      },
      {
        userID: userId,
        name: "Samsung Galaxy S24",
        manufacturer: "Samsung",
        stock: 18,
        description: "Premium Android smartphone with Snapdragon 8 Gen 3",
        price: 74617
      },
      {
        userID: userId,
        name: "MacBook Air M3",
        manufacturer: "Apple",
        stock: 12,
        description: "Ultra-thin laptop with M3 chip, 13-inch display",
        price: 107817
      },
      {
        userID: userId,
        name: "Sony WH-1000XM5",
        manufacturer: "Sony",
        stock: 35,
        description: "Noise-canceling wireless headphones with 30-hour battery",
        price: 33117
      },
      {
        userID: userId,
        name: "iPad Pro 12.9",
        manufacturer: "Apple",
        stock: 8,
        description: "Professional tablet with M2 chip, 12.9-inch display",
        price: 91217
      },
      {
        userID: userId,
        name: "Logitech MX Master 3",
        manufacturer: "Logitech",
        stock: 42,
        description: "Wireless ergonomic mouse with precision tracking",
        price: 8217
      },
      {
        userID: userId,
        name: "Dell XPS 13",
        manufacturer: "Dell",
        stock: 5,
        description: "High-performance business laptop with Intel i7",
        price: 124500
      },
      {
        userID: userId,
        name: "OnePlus 12",
        manufacturer: "OnePlus",
        stock: 20,
        description: "Flagship smartphone with Snapdragon 8 Gen 3",
        price: 64999
      },
    ];

    const products = await Product.insertMany(productsData.map(p => ({
      userID: p.userID,
      name: p.name,
      manufacturer: p.manufacturer,
      stock: p.stock,
      price: p.price,
      description: p.description,
    })));
    console.log(`Created ${products.length} products`);

    // Seed Purchases
    const purchaseDates = [
      "2025-01-15",
      "2025-01-14",
      "2025-01-13",
      "2025-01-12",
      "2025-01-11",
      "2025-01-10",
    ];

    const purchasesData = [];
    products.slice(0, 6).forEach((product, index) => {
      const quantities = [5, 3, 2, 8, 4, 12];
      const quantity = quantities[index];
      const unitPrices = [82917, 74617, 107817, 33117, 91217, 8217];
      const unitPrice = unitPrices[index] || 0;
      
      purchasesData.push({
        userID: userId,
        ProductID: product._id,
        QuantityPurchased: quantity,
        PurchaseDate: purchaseDates[index],
        TotalPurchaseAmount: quantity * unitPrice,
      });
    });

    const purchases = await Purchase.insertMany(purchasesData);
    console.log(`Created ${purchases.length} purchases`);

    // Seed Sales
    const saleDates = [
      "2025-01-16",
      "2025-01-15",
      "2025-01-14",
      "2025-01-13",
      "2025-01-12",
      "2025-01-11",
      "2025-01-10",
    ];

    const salesData = [];
    products.slice(0, 7).forEach((product, index) => {
      const stockSold = [3, 2, 1, 5, 2, 8, 1][index];
      const unitPrices = [82917, 74617, 107817, 33117, 91217, 8217, 124500];
      const unitPrice = unitPrices[index] || 0;
      
      salesData.push({
        userID: userId,
        ProductID: product._id,
        StoreID: stores[index % stores.length]._id,
        StockSold: stockSold,
        SaleDate: saleDates[index],
        TotalSaleAmount: stockSold * unitPrice,
      });
    });

    const sales = await Sales.insertMany(salesData);
    console.log(`Created ${sales.length} sales`);

    console.log("\n✅ Sample data seeded successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Stores: ${stores.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Purchases: ${purchases.length}`);
    console.log(`   - Sales: ${sales.length}`);
    console.log(`\n👤 User ID: ${userId}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${userPassword}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

// Run the seed function
seedData();

