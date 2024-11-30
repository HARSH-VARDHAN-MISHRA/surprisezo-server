const express = require("express");
const { createCheckout, getAllCheckouts, getSingleCheckout, updateCheckout, deleteCheckout } = require("../Controller/checkoutController");

const CheckoutRouter = express.Router();

// Create a new checkout
CheckoutRouter.post("/send-order", createCheckout);

// Get all checkouts
CheckoutRouter.get("/orders", getAllCheckouts);

// Get a single checkout by ID
CheckoutRouter.get("/get-single-order/:id", getSingleCheckout);

// Update a checkout (paymentStatus and orderStatus only)
CheckoutRouter.put("/update-order/:id", updateCheckout);

// Delete a checkout by ID
CheckoutRouter.delete("/delete-order/:id", deleteCheckout);

module.exports = CheckoutRouter;
