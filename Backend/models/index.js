const mongoose= require("mongoose");

const uri = "mongodb://127.0.0.1:27017/InventoryManagementApp";

function main() {
    mongoose.connect(uri)
        .then(() => {
            console.log("Connected to MongoDB (local)");
        })
        .catch((err) => {
            console.log("Error: ", err);
        });
}

module.exports = { main };
