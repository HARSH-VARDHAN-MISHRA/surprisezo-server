const mongoose = require("mongoose");
const ShopProduct = require("../Model/ShopProductModel");
const ShopCategory = require("../Model/ShopCategoryModel");

exports.createShopProduct = async (req, res) => {
    try {
        console.log(req.body);
        const { shopName, shopCategoryName, shopProduct } = req.body;

        if (!shopName) {
            return res.status(400).json({ message: "Shop Name is required" });
        }

        // Validate shopCategoryName only if it's provided
        if (shopCategoryName && !mongoose.Types.ObjectId.isValid(shopCategoryName)) {
            return res.status(400).json({ message: "Invalid Shop Category ID" });
        }

        // Create the new ShopProduct
        const newShopProduct = new ShopProduct({
            shopName,
            shopCategoryName: shopCategoryName || undefined, // Avoid empty string
            shopProduct,
        });

        const savedShopProduct = await newShopProduct.save();

        // Update the `productExit` field in ShopCategory if shopCategoryName is provided
        if (shopCategoryName) {
            await ShopCategory.findByIdAndUpdate(
                shopCategoryName,
                { productExit: true },
                { new: true }
            );
        }

        res.status(201).json(savedShopProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating Shop Product", error });
    }
};

// Get all ShopProducts
exports.getAllShopProducts = async (req, res) => {
    try {
        const shopProducts = await ShopProduct.find()
            .populate("shopName", "shopName") // Adjust fields as needed
            .populate("shopCategoryName", "shopCategoryName")
            .populate("shopProduct", "productName"); // Customize fields to include

        res.status(200).json(shopProducts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Shop Products", error });
    }
};

exports.getAllShopProductsByShopName = async (req, res) => {
    try {
        const { shopName } = req.params
        const shopProducts = await ShopProduct.find()
            .populate("shopName", "shopName") // Adjust fields as needed
            .populate("shopCategoryName", "shopCategoryName")
            .populate("shopProduct");
        if (!shopProducts) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        const filterData = shopProducts.filter((x) => x.shopName.shopName === shopName)
        if (!filterData) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        res.status(200).json(filterData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Shop Products", error });
    }
};

exports.getAllShopProductsByShopCategoryName = async (req, res) => {
    try {
        const { shopCategoryName } = req.params
        const shopProducts = await ShopProduct.find()
            .populate("shopName", "shopName") // Adjust fields as needed
            .populate("shopCategoryName", "shopCategoryName")
            .populate("shopProduct"); // Customize fields to include
        if (!shopProducts) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        const filterData = shopProducts.filter((x) => x?.shopCategoryName?.shopCategoryName === shopCategoryName)
        if (!filterData) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        res.status(200).json(filterData);
    } catch (error) {
        // console.log(error)
        res.status(500).json({ message: "Error fetching Shop Products", error });
    }
};

// Get a single ShopProduct by ID
exports.getShopProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ShopProduct ID" });
        }

        const shopProduct = await ShopProduct.findById(id)
            .populate("shopName", "shopName")
            .populate("shopCategoryName", "shopCategoryName")
            .populate("shopProduct", "productName ");

        if (!shopProduct) {
            return res.status(404).json({ message: "ShopProduct not found" });
        }

        res.status(200).json(shopProduct);
    } catch (error) {
        res.status(500).json({ message: "Error fetching ShopProduct", error });
    }
};

// Update a ShopProduct by ID
exports.updateShopProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { shopName, shopCategoryName, shopProduct } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ShopProduct ID" });
        }

        const updatedShopProduct = await ShopProduct.findByIdAndUpdate(
            id,
            { shopName, shopCategoryName, shopProduct },
            { new: true, runValidators: true }
        );

        if (!updatedShopProduct) {
            return res.status(404).json({ message: "ShopProduct not found" });
        }

        res.status(200).json(updatedShopProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating ShopProduct", error });
    }
};

// Delete a ShopProduct by ID
exports.deleteShopProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ShopProduct ID" });
        }

        const deletedShopProduct = await ShopProduct.findByIdAndDelete(id);

        if (!deletedShopProduct) {
            return res.status(404).json({ message: "ShopProduct not found" });
        }

        res.status(200).json({ message: "ShopProduct deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting ShopProduct", error });
    }
};
