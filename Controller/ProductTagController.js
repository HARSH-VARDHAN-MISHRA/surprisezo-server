const ProductTag = require("../Model/ProducttagModel");
const mongoose = require('mongoose');


exports.createProductTag = async (req, res) => {
    try {
        console.log(req.body);

        const { tagHeading, sortDescription, multipulProduct, priceRange } = req.body;

        // Parse priceRange only if it's a JSON string
        const parsedPriceRange = Array.isArray(priceRange) ? priceRange : JSON.parse(priceRange || "[]");

        // Validate tagHeading and sortDescription uniqueness
        const existingTagHeading = await ProductTag.findOne({
            tagHeading: { $regex: `^${tagHeading.trim()}$`, $options: 'i' },
        });
        if (existingTagHeading) {
            return res.status(400).json({ success: false, message: 'Tag heading already exists' });
        }

        const existingSortDescription = await ProductTag.findOne({
            sortDescription: { $regex: `^${sortDescription.trim()}$`, $options: 'i' },
        });
        if (existingSortDescription) {
            return res.status(400).json({ success: false, message: 'Sort description already exists' });
        }

        // Create the product tag
        const newProductTag = new ProductTag({
            tagHeading,
            sortDescription,
            multipulProduct,
            priceRange: parsedPriceRange,
        });

        const savedProductTag = await newProductTag.save();
        res.status(201).json({
            success: true,
            message: "Product tag created successfully",
            data: savedProductTag,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create product tag",
            error: error.message,
        });
    }
};



exports.updateProductTag = async (req, res) => {
    try {
        console.log(req.body);
        const { id } = req.params;
        const updates = req.body;

        // Fetch the existing product tag by ID
        const productTag = await ProductTag.findById(id);
        if (!productTag) {
            if (newImage) deleteImageFile(newImage);
            return res.status(404).json({
                success: false,
                message: "Product tag not found",
            });
        }

        // Check if the tagHeading already exists (excluding the current product tag)
        if (updates.tagHeading) {
            const existingTagHeading = await ProductTag.findOne({
                tagHeading: { $regex: `^${updates.tagHeading.trim()}$`, $options: 'i' },
                _id: { $ne: id } // Exclude the current tag being updated
            });
            if (existingTagHeading) {
                return res.status(400).json({
                    success: false,
                    message: 'Product tag with this tagHeading already exists'
                });
            }
        }

        // Check if the sortDescription already exists (excluding the current product tag)
        if (updates.sortDescription) {
            const existingSortDescription = await ProductTag.findOne({
                sortDescription: { $regex: `^${updates.sortDescription.trim()}$`, $options: 'i' },
                _id: { $ne: id } // Exclude the current tag being updated
            });
            if (existingSortDescription) {
                return res.status(400).json({
                    success: false,
                    message: 'Product tag with this sortDescription already exists'
                });
            }
        }


        // Parse and validate multipulProduct field
        const parsedMultipulProduct = updates.multipulProduct
            ? JSON.parse(updates.multipulProduct).map(productId => {
                if (!mongoose.Types.ObjectId.isValid(productId)) {
                    throw new Error(`Invalid product ID: ${productId}`);
                }
                return mongoose.Types.ObjectId(productId);
            })
            : [];

        // Process priceRange updates
        const parsedPriceRange = updates.priceRange ? JSON.parse(updates.priceRange) : [];

        // Perform the update with the new data
        const updatedProductTag = await ProductTag.findByIdAndUpdate(
            id,
            {
                ...updates,
                multipulProduct: parsedMultipulProduct,
                priceRange: parsedPriceRange,
            },
            { new: true, runValidators: true }
        ).populate("multipulProduct");

        res.status(200).json({
            success: true,
            message: "Product tag updated successfully",
            data: updatedProductTag,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update product tag",
            error: error.message,
        });
    }
};

// Get all Product Tags
exports.getAllProductTags = async (req, res) => {
    try {
        const productTags = await ProductTag.find().populate("multipulProduct");

        res.status(200).json({
            success: true,
            data: productTags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product tags",
            error: error.message
        });
    }
};

// Get a single Product Tag by ID
exports.getProductTagById = async (req, res) => {
    try {
        const { id } = req.params;

        const productTag = await ProductTag.findById(id).populate("multipulProduct");

        if (!productTag) {
            return res.status(404).json({
                success: false,
                message: "Product tag not found"
            });
        }

        res.status(200).json({
            success: true,
            data: productTag
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product tag",
            error: error.message
        });
    }
};

exports.getProductTagByHeading = async (req, res) => {
    try {
        const { tagHeading } = req.params;

        // Find the product tag by tagHeading
        const productTag = await ProductTag.findOne({ tagHeading }).populate("multipulProduct");

        if (!productTag) {
            return res.status(404).json({
                success: false,
                message: "Product tag not found"
            });
        }

        res.status(200).json({
            success: true,
            data: productTag
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product tag",
            error: error.message
        });
    }
};
exports.getProductsByTagAndPriceRange = async (req, res) => {
    try {
      const { tagHeading } = req.params;
      const { priceMinimum, priceMaximum } = req.query; // Extract price range from query params
  
      // Convert priceMinimum and priceMaximum to numbers for comparison
      const minPrice = parseFloat(priceMinimum);
      const maxPrice = parseFloat(priceMaximum);
  
      // Find the product tag by tagHeading
      const productTag = await ProductTag.findOne({ tagHeading })
        .populate({
          path: "multipulProduct",
          // Filter products by price range
          match: {
            "Variant.price": { $gte: minPrice, $lte: maxPrice }
          }
        });
  
      if (!productTag) {
        return res.status(404).json({
          success: false,
          message: "Product tag not found"
        });
      }
  
      // Filter the products in the tag according to the price range
      const filteredProducts = productTag.multipulProduct.filter(product => {
        // We need to ensure the product has variants and that the price of at least one variant falls within the specified range
        return product.Variant.some(variant => 
          variant.price >= minPrice && variant.price <= maxPrice
        );
      });
  
      // If no products match the price range, return a message
      if (filteredProducts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No products found in the specified price range"
        });
      }
  
      res.status(200).json({
        success: true,
        data: filteredProducts // Return the filtered products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch products by tag and price range",
        error: error.message
      });
    }
  };
  
  

// Delete a Product Tag by ID
exports.deleteProductTag = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const productTag = await ProductTag.findByIdAndDelete(id);

        if (!productTag) {
            return res.status(404).json({
                success: false,
                message: "Product tag not found",
            });
        }
        await productTag.deleteOne()

        res.status(200).json({
            success: true,
            message: "Product tag deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete product tag",
            error: error.message,
        });
    }
};
