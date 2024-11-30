const ShopCategory = require("../Model/ShopCategoryModel");
const shop = require("../Model/ShopModel");


// Create a new shop category
const createShopCategory = async (req, res) => {
    const { shopName, shopCategoryName } = req.body;
    console.log(req.body)
    try {
        // Validate inputs
        if (!shopName || !shopCategoryName) {
            return res.status(400).json({ message: "Shop ID and category name are required." });
        }

        // Check if the shop exists
        const findshop = await shop.findById(shopName);
        if (!findshop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        // Create a new category
        const newCategory = new ShopCategory({
            shopName,
            shopCategoryName,
        });
        await newCategory.save();

        // Update the exitShopCategory field in the shop
        if (!findshop.exitShopCategory) {
            findshop.exitShopCategory = true;
            await findshop.save();
        }

        res.status(201).json({
            message: "Shop category created successfully.",
            data: newCategory,
        });
    } catch (error) {
        console.error("Error creating shop category:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get all categories for a specific shop
const getCategories = async (req, res) => {
    try {
        const categories = await ShopCategory.find().populate("shopName");
        if (!categories) {
            return res.status(404).json({ message: "No categories found for this shop." });
        }

        res.status(200).json({ data: categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get all categories for a specific shop
const getCategoriesByShop = async (req, res) => {
    const { id } = req.params;

    try {
        const categories = await ShopCategory.findById(id).populate("shopName");
        if (!categories) {
            return res.status(404).json({ message: "No categories found for this shop." });
        }

        res.status(200).json({ data: categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Update a shop category
const updateShopCategory = async (req, res) => {
    const { id } = req.params;
    const { shopCategoryName } = req.body;

    try {
        const category = await ShopCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Shop category not found." });
        }

        category.shopCategoryName = shopCategoryName || category.shopCategoryName;
        await category.save();

        res.status(200).json({
            message: "Shop category updated successfully.",
            data: category,
        });
    } catch (error) {
        console.error("Error updating shop category:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Delete a shop category
const deleteShopCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await ShopCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Shop category not found." });
        }

        await category.deleteOne();
        res.status(200).json({ message: "Shop category deleted successfully." });
    } catch (error) {
        console.error("Error deleting shop category:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    createShopCategory,
    getCategoriesByShop,
    updateShopCategory,
    deleteShopCategory,
    getCategories
};
