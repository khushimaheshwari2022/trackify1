const mongoose = require("mongoose");

// MongoDB Atlas connection string from environment variable
// Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
const uri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/InventoryManagementApp";

function main() {
    // Don't show password in logs - mask it for security
    const maskedUri = uri.replace(/:([^:@]+)@/, ':***@');
    console.log("Attempting to connect to MongoDB...");
    console.log("Connection string:", maskedUri);
    
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    })
    .then(() => {
        console.log("✅ Connected to MongoDB successfully!");
        if (uri.includes("mongodb+srv://")) {
            console.log("📍 Using MongoDB Atlas (cloud)");
        } else {
            console.log("📍 Using local MongoDB");
        }
        console.log("📊 Database:", mongoose.connection.db.databaseName);
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Error!");
        console.error("Error message:", err.message);
        if (err.message.includes("authentication failed")) {
            console.error("💡 Check your username and password in the connection string");
        } else if (err.message.includes("getaddrinfo ENOTFOUND")) {
            console.error("💡 Check your cluster address in the connection string");
        } else if (err.message.includes("IP")) {
            console.error("💡 Your IP address might not be whitelisted in MongoDB Atlas");
            console.error("💡 Go to Atlas → Network Access → Add your IP address");
        }
        console.error("💡 Check your connection string in .env file");
        console.error("💡 Connection string format should be:");
        console.error("   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority");
    });
}

module.exports = { main };
