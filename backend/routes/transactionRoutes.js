const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==================== ADD TRANSACTION ====================
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            type,
            amount,
            category,
            date,
            description
        } = req.body;

        if (!type || !amount || !category || !date) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const transaction = await Transaction.create({
            userId: req.userId,
            type,
            amount,
            category,
            date,
            description
        });

        res.status(201).json({
            message: "Transaction added successfully",
            transaction
        });

    } catch (error) {
        console.error("Add transaction error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// ==================== GET TRANSACTIONS ====================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { type, category, date } = req.query;

        const filter = {
            userId: req.userId
        };

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        if (date) {
            filter.date = date;
        }

        const transactions = await Transaction
            .find(filter)
            .sort({ date: -1 });

        res.json({
            transactions
        });

    } catch (error) {
        console.error("Get transactions error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// ==================== UPDATE TRANSACTION ====================
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        const {
            type,
            amount,
            category,
            date,
            description
        } = req.body;

        transaction.type = type || transaction.type;
        transaction.amount = amount || transaction.amount;
        transaction.category = category || transaction.category;
        transaction.date = date || transaction.date;
        transaction.description =
            description ?? transaction.description;

        await transaction.save();

        res.json({
            message: "Transaction updated successfully",
            transaction
        });

    } catch (error) {
        console.error("Update transaction error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

// ==================== DELETE TRANSACTION ====================
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.json({
            message: "Transaction deleted successfully"
        });

    } catch (error) {
        console.error("Delete transaction error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;