const Store = require("../models/store");

// Add Store
const addStore = async (req, res) => {
  try {
    console.log("Store data received:", req.body);
    
    // Validate required fields
    if (!req.body.userId || !req.body.name || !req.body.category || !req.body.address || !req.body.city) {
      return res.status(400).json({ 
        message: "Missing required fields: userId, name, category, address, and city are required" 
      });
    }

    const storeData = {
      userID: req.body.userId,
      name: req.body.name,
      category: req.body.category,
      address: req.body.address,
      city: req.body.city,
    };
    
    // Only add image if it's provided and not empty
    if (req.body.image && req.body.image.trim() !== "") {
      storeData.image = req.body.image;
    }

    const newStore = new Store(storeData);

    const savedStore = await newStore.save();
    console.log("Store saved successfully:", savedStore);
    res.status(200).json(savedStore);
  } catch (err) {
    console.error("Error saving store:", err);
    res.status(400).json({ 
      message: err.message || "Error adding store",
      error: err 
    });
  }
};

// Get All Stores
const getAllStores = async (req, res) => {
  const findAllStores = await Store.find({"userID": req.params.userID}).sort({ _id: -1 }); // -1 for descending;
  res.json(findAllStores);
};

module.exports = { addStore, getAllStores };
