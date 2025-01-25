import express from "express";
import { handlers } from "../utils/handlers.js";

const router = express.Router();

// Create new rental item
// POST /items
// Body: { itemName: string, description: string, pricePerDay: number }
router.post("/items", async (req, res) => {
  try {
    const result = await handlers.createItem(req.body);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search available items
// GET /items
// Query: { itemName?: string, minPrice?: number, maxPrice?: number }
router.get("/items", async (req, res) => {
  try {
    const result = await handlers.searchItems(req.query);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rent or schedule item rental
// PUT /items/rent
// Body: { id: string,rentalStart?: string, rentalEnd: string }
router.put("/items/rent", async (req, res) => {
  try {
    const result = await handlers.rentItem(req.body);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Return rented item
// PUT /items/return
// Body: { id: string }
router.put("/items/return", async (req, res) => {
  try {
    const result = await handlers.returnItem(req.body);
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
