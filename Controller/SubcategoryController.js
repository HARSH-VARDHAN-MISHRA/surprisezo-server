const fs = require('fs');
const path = require('path');
const MainCategory = require("../Model/MainCategoryModel");
const Subcategory = require("../Model/SubcategoryModel");

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

// Create a new subcategory
const createSubcategory = async (req, res) => {
    const { categoryName, subcategoryName, subcategoryStatus } = req.body;
    const subcategoryImage = req.file ? req.file.path : null;

    if (!categoryName) {
        if (subcategoryImage) deleteImageFile(subcategoryImage);
        return res.status(400).json({ success: false, message: "Category Name is required" });
    }
    if (!subcategoryName) {
        if (subcategoryImage) deleteImageFile(subcategoryImage);
        return res.status(400).json({ success: false, message: "Sub Category Name is required" });
    }

    try {
        // Check if the category ID is valid
        const validCategory = await MainCategory.findById(categoryName);
        if (!validCategory) {
            if (subcategoryImage) deleteImageFile(subcategoryImage);
            return res.status(404).json({ success: false, message: "Invalid Category Id" });
        }

        // Normalize the subcategory name for consistent comparison
        const normalizedSubcategoryName = subcategoryName.trim().toLowerCase();

        // Check if the subcategory name already exists under the same category
        const existingSubcategory = await Subcategory.findOne({
            categoryName,
            subcategoryName: { $regex: `^${normalizedSubcategoryName}$`, $options: "i" }
        });

        if (existingSubcategory) {
            if (subcategoryImage) deleteImageFile(subcategoryImage);
            return res.status(400).json({
                success: false,
                message: "Subcategory name already exists in this category"
            });
        }

        // Create the subcategory
        const subcategory = new Subcategory({
            categoryName,
            subcategoryName: normalizedSubcategoryName, // Store the normalized name
            subcategoryStatus: subcategoryStatus || "False",
            subcategoryImage
        });

        await subcategory.save();

        // Update the main category's subcategoryExit field to true
        validCategory.subcategoryExit = true;
        await validCategory.save();

        res.status(201).json({
            success: true,
            message: "Subcategory created successfully",
            data: subcategory
        });
    } catch (error) {
        if (req.file) deleteImageFile(req.file.path);
        console.error("Error creating subcategory:", error);
        res.status(500).json({
            success: false,
            message: "Error creating subcategory",
            error: error.message
        });
    }
};


// Get all subcategories
const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate("categoryName");
        res.status(200).json({ data: subcategories });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Error fetching subcategories", error });
    }
};

// Get all subcategories
const getAllSubcategoriesStatusTrue = async (req, res) => {
    try {
        const subcategories = await Subcategory.find({ subcategoryStatus: "True" }).populate("categoryName");
        res.status(200).json({ data: subcategories });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ message: "Error fetching subcategories", error });
    }
};

// Get a single subcategory by ID
const getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate("categoryName");
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ data: subcategory });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        res.status(500).json({ message: "Error fetching subcategory", error });
    }
};

const getSubcategoryByName = async (req, res) => {
    try {
        const subcategory = await Subcategory.findOne({ subcategoryName: req.params.name }).populate("categoryName");
        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        res.status(200).json({ data: subcategory });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        res.status(500).json({ message: "Error fetching subcategory", error });
    }
};

// Update a subcategory by ID and delete the old image if a new one is provided
const updateSubcategory = async (req, res) => {
    const { categoryName, subcategoryName, subcategoryStatus } = req.body;
    const subcategoryImage = req.file ? req.file.path : null;

    try {
        const subcategory = await Subcategory.findById(req.params.id);

        if (!subcategory) {
            if (subcategoryImage) deleteImageFile(subcategoryImage);
            return res.status(404).json({ message: "Subcategory not found" });
        }

        // Normalize subcategory name for comparison
        const normalizedSubcategoryName = subcategoryName?.trim().toLowerCase();

        // Check for duplicate subcategory name in the same category
        if (normalizedSubcategoryName) {
            const existingSubcategory = await Subcategory.findOne({
                _id: { $ne: req.params.id }, // Exclude the current subcategory
                categoryName,
                subcategoryName: { $regex: `^${normalizedSubcategoryName}$`, $options: "i" },
            });

            if (existingSubcategory) {
                if (subcategoryImage) deleteImageFile(subcategoryImage);
                return res.status(400).json({
                    success: false,
                    message: "Subcategory name already exists in this category",
                });
            }
        }

        // If a new image is provided, delete the old image
        if (subcategoryImage && subcategory.subcategoryImage) {
            deleteImageFile(subcategory.subcategoryImage);
        }

        // Update the subcategory with new data
        if (categoryName) subcategory.categoryName = categoryName;
        if (subcategoryName) subcategory.subcategoryName = normalizedSubcategoryName;
        if (subcategoryStatus) subcategory.subcategoryStatus = subcategoryStatus;
        if (subcategoryImage) subcategory.subcategoryImage = subcategoryImage;

        await subcategory.save();
        res.status(200).json({ message: "Subcategory updated successfully", data: subcategory });
    } catch (error) {
        if (req.file) deleteImageFile(req.file.path);
        console.error("Error updating subcategory:", error);
        res.status(500).json({ message: "Error updating subcategory", error: error.message });
    }
};


// Delete a subcategory by ID and delete the associated image
const deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);

        if (!subcategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }

        // Delete the image if it exists
        if (subcategory.subcategoryImage) {
            deleteImageFile(subcategory.subcategoryImage);
        }

        res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        res.status(500).json({ message: "Error deleting subcategory", error });
    }
};


const getAllSubcategoryByCategoryName = async (req, res) => {
    try {
        const { categoryName } = req.params;

        console.log("Received categoryName:", categoryName);

        // Find subcategories with populated categoryName and filter based on mainCategoryName
        const data = await Subcategory.find().populate("categoryName")  // Populate categoryName to get main category data
        const filerData = data.filter((x) => x.categoryName.mainCategoryName === categoryName)

        // If no data is found, return a 404 error
        if (filerData.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No subcategories found for the given category name."
            });
        }

        console.log("Found subcategories:", filerData);

        res.status(200).json({
            success: true,
            data: filerData
        });
    } catch (error) {
        console.error("Error while fetching subcategories:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// Export all controller functions
module.exports = {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory,
    getAllSubcategoriesStatusTrue, getSubcategoryByName, getAllSubcategoryByCategoryName
};
