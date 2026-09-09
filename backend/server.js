 const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());


// ==================== MONGODB CONNECTION ====================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });


// ==================== API ROUTES ====================

app.use("/api/auth", authRoutes);

app.use(
    "/api/transactions",
    transactionRoutes
);


// ==================== FRONTEND ====================

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// ==================== TEST ROUTE ====================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});


// ==================== SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});