const Product = require("../models/product");
const ProductImage = require("../models/productImage");
const ProductVariation = require("../models/productvariation");
const ProductVariationOption = require("../models/productvariationoption");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

exports.addProduct = async (req, res) => {
  const { name, price, description, variations } = req.body; // รับ variations จาก body

  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied: Insufficient role" });
  }

  const sellerId = req.user.id;

  try {

    const product = await Product.create({
      name,
      price,
      description,
      sellerId,
    });


    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        image_url: file.path,
        productId: product.id,
      }));
      const createdImage = await ProductImage.bulkCreate(images, {
        fields: ["image_url", "productId"],
      });
      const mainImage = createdImage[0];
      await product.update({ mainImageId: mainImage.id });
    }

    // ตรวจสอบและสร้าง Product Variations
    if (variations && variations.length > 0) {
      const productVariations = await Promise.all(
        variations.map(async (variation) => {
          const productVariation = await ProductVariation.create({
            variationType: variation.type,
            variationValue: variation.value,
            productId: product.id,
          });

          if (variation.options && variation.options.length > 0) {
            const variationOptions = variation.options.map((option) => ({
              productVariationId: productVariation.id,
              value: option,
            }));
            await ProductVariationOption.bulkCreate(variationOptions);
          }

          return productVariation;
        })
      );
    }

    res.status(201).json(product);
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error while adding product" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }
  if (!req.user.role === "admin" && req.user.role !== "seller") {
    return res
      .status(403)
      .json({ message: "Access denied: Insufficient role" });
  }

  const transaction = await sequelize.transaction();
  try {
    await ProductVariationOption.destroy({
      where: {
        productVariationId: {
          [Op.in]: sequelize.literal(
            `(SELECT id FROM productvariations WHERE product_Id = ${id})`
          ),
        },
      },
      transaction,
    });

    await ProductVariation.destroy({
      where: {
        productId: id,
      },
      transaction,
    });
    const deletedRows = await Product.destroy({ where: { id }, transaction });
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    await transaction.commit();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    await transaction.rollback();
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Server error while fetching product" });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, price, description , variations } = req.body;
  const { productId } = req.params;

  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  if (req.user.role !== "admin" && req.user.role !== "seller") {
    return res
      .status(403)
      .json({ message: "Access denied: Insufficient role" });
  }


  try {
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: "Product not found in your inventory" });
    }

    if (product.sellerId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Product not found in your inventory" });
      }
  

    await product.update({ name, price, description });

    // if(req.file && req.file.length > 0){
    //     const image = req.file.map(file =>

    if (variations && variations.length > 0) {
      await ProductVariation.destroy({ where: { productId } });

      const productVariations = await Promise.all(
        variations.map(async (variation) => {
          const productVariation = await ProductVariation.create({
            variationType: variation.type,
            variationValue: variation.value,
            productId
          });

          if (variation.options && variation.options.length > 0) {
            const variationOptions = variation.options.map((option) => ({
              productVariationId: productVariation.id,
              value: option
            }));
            await ProductVariationOption.bulkCreate(variationOptions);
          }
        })
      );
    }
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
};
