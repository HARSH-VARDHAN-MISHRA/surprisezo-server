const fs = require('fs');
const path = require('path');
const Product = require('../Model/ProductModel');
const mongoose = require("mongoose")

// deleteImageFile function to delete images
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

const createProduct = async (req, res) => {
    console.log(req.body);

    // Extracting fields from request body
    const {
        categoryName,
        subcategoryName,
        productName,
        productSubDescription,
        productDescription,
        productTag,
        refrenceCompany,
        Variant,
        refrenceCompanyUrl,
        innersubcategoryName,
        customisecake,
        customisemessage,
        customisename,
        customisenameValue
    } = req.body;

    // Only validate required fields
    const errorMessage = [];
    if (!categoryName) errorMessage.push("Category Name is required");
    if (!productName) errorMessage.push("Product Name is required");
    if (!Variant) errorMessage.push("Variant is required");

    // If there are validation errors
    if (errorMessage.length > 0) {
        if (req.files) {
            req.files.forEach((file) => deleteImageFile(file.path));
        }
        return res.status(400).json({ errors: errorMessage });
    }

    // Check if product name already exists
    const existingProduct = await Product.findOne({
        productName: { $regex: `^${productName.trim()}$`, $options: 'i' } // Case-insensitive check
    });

    if (existingProduct) {
        if (req.files) {
            req.files.forEach((file) => deleteImageFile(file.path)); // Cleanup uploaded files if product name is not unique
        }
        return res.status(400).json({ message: 'Product with this name already exists' });
    }

    // If no images are uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Product Images are required"
        });
    }

    // Check and parse Variant if it's a string (JSON string)
    let parsedVariant = [];
    try {
        parsedVariant = Array.isArray(Variant) ? Variant : JSON.parse(Variant); // Parse if it's a string
    } catch (error) {
        return res.status(400).json({ message: "Invalid Variant data" });
    }

      // Generate a unique SKU
      const generateSKU = async () => {
        try {
            const lastProduct = await Product.findOne()
                .sort({ createdAt: -1 })
                .select("sku");

            if (lastProduct && lastProduct.sku) {
                const match = lastProduct.sku.match(/\d+$/);
                if (match) {
                    const lastSkuNumber = parseInt(match[0], 10);
                    const newSkuNumber = lastSkuNumber + 1;
                    return `SKU-${newSkuNumber.toString().padStart(6, "0")}`;
                }
            }
            return "SKU-000001"; // Default SKU if no products exist
        } catch (error) {
            console.error("Error generating SKU:", error.message);
            return "SKU-000001"; // Default SKU on error
        }
    };

    // Proceed with creating the product
    const productData = {
        categoryName,
        subcategoryName: subcategoryName ? new mongoose.Types.ObjectId(subcategoryName) : null, // Optional field
        productName,
        customisecake: customisecake || null,
        customisename: customisename || null,
        customisenameValue: customisenameValue || null,
        customisemessage: customisemessage || null,
        productSubDescription: productSubDescription || null,
        productDescription: productDescription || null,
        refrenceCompany: refrenceCompany ? new mongoose.Types.ObjectId(refrenceCompany) : null, // Optional field
        innersubcategoryName: innersubcategoryName ? new mongoose.Types.ObjectId(innersubcategoryName) : null, // Optional field
        refrenceCompanyUrl: refrenceCompanyUrl || null, // Optional field
        productTag: productTag ? new mongoose.Types.ObjectId(productTag) : null,
        Variant: parsedVariant.map(variant => ({
            ...variant,
            color: variant.color ? new mongoose.Types.ObjectId(variant.color) : null,  // Handle empty color
            weight: variant.weight ? new mongoose.Types.ObjectId(variant.weight) : null,  // Handle empty weight
            flover: variant.flover ? new mongoose.Types.ObjectId(variant.flover) : null   // Handle empty flover
        })),
        productImage: req.files.map(file => file.path), // Save paths to the uploaded images
        sku: await generateSKU(), // Generate unique SKU
    };

    try {
        const product = new Product(productData);
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};


// Read Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('categoryName')
            .populate('subcategoryName')
            .populate('productTag')
            .populate('refrenceCompany')
            .populate('innersubcategoryName')
            .populate({
                path: 'Variant.color',
                model: 'Color',
            })
            .populate({
                path: 'Variant.weight',
                model: 'Size',
            })
            .populate({
                path: 'Variant.flover',
                model: 'Flover',
            });

        res.status(200).json({ data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get Single Product
const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
            .populate('categoryName subcategoryName innersubcategoryName productTag refrenceCompany')
            .populate({
                path: 'Variant',
                populate: [
                    { path: 'color' },
                    { path: 'weight' },
                    { path: 'flover' },
                ],
            });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ data: product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get Single Product
const getProductByname = async (req, res) => {
    const { name } = req.params;

    try {
        const product = await Product.findOne({ productName: name })
            .populate('categoryName subcategoryName innersubcategoryName productTag refrenceCompany')
            .populate({
                path: 'Variant',
                populate: [
                    { path: 'color' },
                    { path: 'weight' },
                    { path: 'flover' },
                ],
            });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ data: product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



const updateProduct = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);

    const {
        categoryName,
        subcategoryName,
        productName,
        productSubDescription,
        productDescription,
        productTag,
        refrenceCompany,
        Variant,
        refrenceCompanyUrl,
        customisecake,
        customisename,
        customisemessage,
        customisenameValue,
        innersubcategoryName
    } = req.body;

    // Only validate required fields
    const errorMessage = [];
    if (!categoryName) errorMessage.push("Category Name is required");
    if (!productName) errorMessage.push("Product Name is required");
    if (!Variant) errorMessage.push("Variant is required");

    if (errorMessage.length > 0) {
        if (req.files) {
            req.files.forEach((file) => deleteImageFile(file.path));
        }
        return res.status(400).json({ errors: errorMessage });
    }

    // Helper function to validate ObjectId fields
    const validateObjectId = (value) => {
        return mongoose.Types.ObjectId.isValid(value) ? new mongoose.Types.ObjectId(value) : null;
    };

    try {
        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product name is unique
        if (productName && productName.trim().toLowerCase() !== product.productName.toLowerCase()) {
            const existingProduct = await Product.findOne({
                productName: { $regex: `^${productName.trim()}$`, $options: 'i' },
            });
            if (existingProduct) {
                if (req.files) {
                    req.files.forEach((file) => deleteImageFile(file.path));
                }
                return res.status(400).json({ message: 'Product with this name already exists' });
            }
        }

        // Parse Variant if it's a string
        let parsedVariant = [];
        try {
            parsedVariant = Array.isArray(Variant) ? Variant : JSON.parse(Variant);
        } catch (error) {
            return res.status(400).json({ message: "Invalid Variant data" });
        }

        // If new images are uploaded, delete old ones and update
        if (req.files && req.files.length > 0) {
            product.productImage.forEach((imagePath) => deleteImageFile(imagePath));
            product.productImage = req.files.map(file => file.path);
        }

        // Update product fields
        product.categoryName = validateObjectId(categoryName);
        product.subcategoryName = validateObjectId(subcategoryName);
        product.productName = productName;
        product.productSubDescription = productSubDescription || null;
        product.customisecake = customisecake || null,
        product.customisename = customisename || null,
        product.customisemessage = customisemessage || null,
        product.productDescription = productDescription || null;
        product.customisenameValue = customisenameValue || null;
        product.refrenceCompany = validateObjectId(refrenceCompany);
        product.refrenceCompanyUrl = refrenceCompanyUrl || null;
        product.innersubcategoryName = validateObjectId(innersubcategoryName);
        product.productTag = validateObjectId(productTag);

        product.Variant = parsedVariant.map(variant => ({
            ...variant,
            color: validateObjectId(variant.color),
            weight: validateObjectId(variant.weight),
            flover: validateObjectId(variant.flover),
        }));

        // Save the updated product
        const updatedProduct = await product.save();

        // Respond with the updated product
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};




// Delete Product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete images using the deleteImageFile function
        product.productImage.forEach((imagePath) => {
            deleteImageFile(imagePath); // Use deleteImageFile here
        });

        // Delete the product from the database
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

const getProductByCategoryName = async (req, res) => {
    try {
        const { categoryName } = req.params
        const data = await Product.find().populate('categoryName subcategoryName innersubcategoryName productTag refrenceCompany')
            .populate({
                path: 'Variant',
                populate: [
                    { path: 'color' },
                    { path: 'weight' },
                    { path: 'flover' },
                ],
            });

        const filterProduct = data.filter((x) => x.categoryName.mainCategoryName === categoryName)
        if (filterProduct.length === 0) {
            return res.status(404).json({
                success: false,
                messgae: "Product not found this category"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Product Found Successfully",
            data: filterProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getProductBySubCategoryName = async (req, res) => {
    try {
        const { subcateName } = req.params
        console.log(subcateName)
        const data = await Product.find().populate('categoryName subcategoryName innersubcategoryName productTag refrenceCompany')
            .populate({
                path: 'Variant',
                populate: [
                    { path: 'color' },
                    { path: 'weight' },
                    { path: 'flover' },
                ],
            });
        console.log(data)
        const filterProduct = data.filter((x) => x?.subcategoryName?.subcategoryName === subcateName)
        if (filterProduct.length === 0) {
            return res.status(404).json({
                success: false,
                messgae: "Product not found this category"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Product Found Successfully",
            data: filterProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getProductByInnerSubCategoryName = async (req, res) => {
    try {
        const { innersubcategoryName } = req.params
        const data = await Product.find().populate('categoryName subcategoryName innersubcategoryName productTag refrenceCompany')
            .populate({
                path: 'Variant',
                populate: [
                    { path: 'color' },
                    { path: 'weight' },
                    { path: 'flover' },
                ],
            });

        const filterProduct = data.filter((x) => x?.innersubcategoryName?.innerSubcategoryName === innersubcategoryName)
        if (filterProduct.length === 0) {
            return res.status(404).json({
                success: false,
                messgae: "Product not found this category"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Product Found Successfully",
            data: filterProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductByname,
    getProductByCategoryName,
    getProductBySubCategoryName,
    getProductByInnerSubCategoryName
};
