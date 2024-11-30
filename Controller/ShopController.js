const path = require("path");
const fs = require("fs");
const shop = require("../Model/ShopModel");

// Helper function to delete an image file
const deleteImageFile = (relativeFilePath) => {
    const absolutePath = path.join(__dirname, "..", relativeFilePath);
    fs.unlink(absolutePath, (err) => {
        if (err) {
            console.error("Failed to delete image:", err);
        } else {
            console.log("Image deleted:", absolutePath);
        }
    });
};

// Create a new shop
const createShop = async (req, res) => {
    try {
        const { shopName } = req.body;
        const shopImage = req.file?.path; // Assuming the image is uploaded via multer

        if (!shopImage) {
            return res.status(400).json({ message: "Shop image is required" });
        }

        const newShop = new shop({ shopName, shopImage });
        await newShop.save();
        res.status(201).json({ message: "Shop created successfully", data: newShop });
    } catch (error) {
        if (req.file?.path) {
            deleteImageFile(req.file.path); // Delete the uploaded image if saving fails
        }
        res.status(500).json({ message: "Failed to create shop", error: error.message });
    }
};

// Get all shops
const getAllShops = async (req, res) => {
    try {
        const shops = await shop.find();
        res.status(200).json({ message: "Shops retrieved successfully", data: shops });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve shops", error: error.message });
    }
};

// Get a single shop by ID
const getShopById = async (req, res) => {
    try {
        const findshop = await shop.findById(req.params.id);
        if (!findshop) {
            return res.status(404).json({ message: "Shop not found" });
        }
        res.status(200).json({ message: "Shop retrieved successfully", data: findshop });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve shop", error: error.message });
    }
};

// Update a shop by ID
const updateShop = async (req, res) => {
    try {
        const { shopName } = req.body;
        const updatedshop = await shop.findById(req.params.id);

        if (!updatedshop) {
            if (req.file?.path) deleteImageFile(req.file.path); // Delete uploaded image if shop not found
            return res.status(404).json({ message: "Shop not found" });
        }

        if (req.file?.path) {
            // Delete old image
            deleteImageFile(updatedshop.shopImage);
            updatedshop.shopImage = req.file.path;
        }

        if (shopName) updatedshop.shopName = shopName;

        await updatedshop.save();
        res.status(200).json({ message: "Shop updated successfully", data: shop });
    } catch (error) {
        if (req.file?.path) deleteImageFile(req.file.path); // Delete uploaded image if updating fails
        res.status(500).json({ message: "Failed to update shop", error: error.message });
    }
};

// Delete a shop by ID
const deleteShop = async (req, res) => {
    try {
        const Deleteshop = await shop.findById(req.params.id);

        if (!Deleteshop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        // Delete associated image file
        deleteImageFile(Deleteshop.shopImage);

        await Deleteshop.deleteOne();
        res.status(200).json({ message: "Shop deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete shop", error: error.message });
    }
};

module.exports = {
    createShop,
    getAllShops,
    getShopById,
    updateShop,
    deleteShop,
};
