const Checkout = require("../Model/CheckOutModel");


const createCheckout = async (req, res) => {
    try {
        const { userInfo, cartItems, orderSummary } = req.body;

        if (
            !userInfo?.name ||
            !userInfo?.email ||
            !userInfo?.phoneNumber ||
            !userInfo?.address ||
            !cartItems?.length
        ) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newCheckout = new Checkout({
            name: userInfo.name,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber,
            address: userInfo.address,
            products: cartItems,
            totalItems: orderSummary.totalItems,
            totalPrice: orderSummary.totalPrice,
        });

        const savedCheckout = await newCheckout.save();
        res.status(201).json({
            message: "Checkout created successfully.",
            data: savedCheckout,
        });
    } catch (error) {
        console.error("Error creating checkout:", error);
        res.status(500).json({ message: "Failed to create checkout." });
    }
};


// Get all checkouts
const getAllCheckouts = async (req, res) => {
    try {
        const checkouts = await Checkout.find();
        res.status(200).json({
            message: "Checkouts retrieved successfully.",
            data: checkouts,
        });
    } catch (error) {
        console.error("Error fetching checkouts:", error);
        res.status(500).json({ message: "Failed to fetch checkouts." });
    }
};

// Get a single checkout by ID
const getSingleCheckout = async (req, res) => {
    try {
        const { id } = req.params;
        const checkout = await Checkout.findById(id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found." });
        }

        res.status(200).json({
            message: "Checkout retrieved successfully.",
            data: checkout,
        });
    } catch (error) {
        console.error("Error fetching checkout:", error);
        res.status(500).json({ message: "Failed to fetch checkout." });
    }
};

// Update a checkout (only paymentStatus and orderStatus)
const updateCheckout = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus, orderStatus } = req.body;

        if (!paymentStatus && !orderStatus) {
            return res.status(400).json({
                message: "At least one of paymentStatus or orderStatus must be provided.",
            });
        }

        const updatedCheckout = await Checkout.findByIdAndUpdate(
            id,
            {
                ...(paymentStatus && { paymentStatus }),
                ...(orderStatus && { orderStatus }),
            },
            { new: true }
        );

        if (!updatedCheckout) {
            return res.status(404).json({ message: "Checkout not found." });
        }

        res.status(200).json({
            message: "Checkout updated successfully.",
            data: updatedCheckout,
        });
    } catch (error) {
        console.error("Error updating checkout:", error);
        res.status(500).json({ message: "Failed to update checkout." });
    }
};

// Delete a checkout by ID
const deleteCheckout = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCheckout = await Checkout.findByIdAndDelete(id);

        if (!deletedCheckout) {
            return res.status(404).json({ message: "Checkout not found." });
        }

        res.status(200).json({
            message: "Checkout deleted successfully.",
            data: deletedCheckout,
        });
    } catch (error) {
        console.error("Error deleting checkout:", error);
        res.status(500).json({ message: "Failed to delete checkout." });
    }
};

module.exports = {
    createCheckout,
    getAllCheckouts,
    getSingleCheckout,
    updateCheckout,
    deleteCheckout,
};
