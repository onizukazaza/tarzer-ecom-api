const Product = require("../models/product");
const ProductImage = require("../models/productImage");
const ProductVariation = require("../models/productvariation");
const ProductVariationOption = require("../models/productvariationoption");
const Stock = require("../models/stock");
const User = require("../models/user");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

exports.addProduct = async (req, res) => {
  const { name, price, description, variations , gender } = req.body;

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
    if (!req.files || !req.files.productimages || req.files.productimages.length === 0) {
      return res
        .status(400)
        .json({ message: "Product must have at least one image" });
    }

    const parsedVariations = variations ? JSON.parse(variations): [];

    const validGenders = ["male", "female"];
    if(!validGenders.includes(gender)) {
      return res.status(400).json({ message: "Invalid gender" });
    }


    const product = await Product.create({
      name,
      price,
      description,
      sellerId,
      gender,
    });
   
    const images = req.files.productimages.map((file) => ({
      image_url: file.path,
      productId: product.id,
    }));
    const createdImages = await ProductImage.bulkCreate(images, {
      fields: ["image_url", "productId"],
    });

    const mainImage = createdImages[0];
    await product.update({ mainImageId: mainImage.id });
    await mainImage.update({ isPrimary: true });

    if (parsedVariations && Array.isArray(parsedVariations)) {
      await Promise.all(
        parsedVariations.map(async (variation , index) => {

          if (!variation.price) {
            return res.status(400).json({ message: "Variation price must be provided." });
          }

          const imageVariation = req.files.variationimages && req.files.variationimages.length > index
          ? req.files.variationimages[index].path : null;

          const productVariation = await ProductVariation.create({
            variationType: variation.type,
            variationValue: variation.value,
            productId: product.id,
            variationPrice: variation.price,
            image_variation: imageVariation,
          });
          
          const stockQuantity = variation.quantity || 0;
          let variationOptions = [];
          
          if (variation.options && Array.isArray(variation.options) && variation.options.length > 0) {
            variationOptions = await ProductVariationOption.bulkCreate(
              variation.options.map((option) => ({
                productVariationId: productVariation.id,
                value: option,
              }))
            );
          }

          if (variationOptions.length === 0) {
            return res.status(400).json({ message: "At least one product variation option must be provided." });
          }

          const productVariationOptionId = variationOptions[0].id;

          await Stock.create({
            productId: product.id,
            quantity: stockQuantity,
            ProductVariationOptionId: productVariationOptionId,
          })

          return productVariation;
        })
      );
    }

    res.status(201).json({product});
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
  if (req.user.role === "admin" && req.user.role !== "seller") {
    return res
      .status(403)
      .json({ message: "Access denied: Insufficient role" });
  }

  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.sellerId !== req.user.id && req.user.role!== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied: You do not own this product" });
    }

    const productImages = await ProductImage.findAll({
      where: { productId: id },
    });
    if (productImages.length > 0) {
      productImages.forEach((image) => {
        const fs = require("fs");
        if(fs.existsSync(image.image_url)){
        fs.unlinkSync(image.image_url);
        }
      });
      await ProductImage.destroy({ where: { productId: id }, transaction});
    }

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
  const { search } = req.query;
  try {
   const products = await Product.findAll({
    where: search ? { name: { [Op.like]: `%${search}%` } } : {}, 
    include: [
      {
        model: ProductImage,
        as: 'images',
        attributes: ['image_url'],
      },
      {
        model: ProductVariation,
        as: 'productVariations',
        include: [
          {
            model: ProductVariationOption,
            as: 'productVariationOptions',
            include: [
              {
                model: Stock,
                as: 'stocks',
                attributes: ['quantity'],
              }
            ],
            attributes: ['value'],
          },
        ],
        attributes: ['variationType', 'variationValue', 'variationPrice'],
      },
    ],
    attributes: ['id', 'name', 'price', 'description' , 'sellerId'],
   })

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};


exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id , {
      include: [
        {
          model: User,
          as:'seller',
          attributes: ['id', 'username' , ],
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['image_url'],
        },
        {
          model: ProductVariation,
          as: 'productVariations',
          include: [
            {
              model: ProductVariationOption,
              as: 'productVariationOptions',
              include: [
                {
                  model: Stock,
                  as:'stocks',
                  attributes: ['quantity'],
                }
              ],
              attributes: ['value'],
            },
          ],
          attributes: ['variationType', 'variationValue', 'variationPrice'],
        },
      ],
      attributes: ['id', 'name', 'price', 'description', 'gender', 'sellerId'],
    });
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
  const { name, price, description, variations } = req.body;
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
      return res
        .status(404)
        .json({ message: "Product not found in your inventory" });
    }

    if (product.sellerId !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Product not found in your inventory" });
    }

    await product.update({ name, price, description });

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path)
      await product.update({imageUrl: imageUrls})
    }

    if (variations && variations.length > 0) {
      await Promise.all(
        variations.map(async (variation) => {
          if (variation.id) {
            const existingVariation = await ProductVariation.findOne({
              where: { id: variation.id , productId }
          })
          if (existingVariation) {
            await existingVariation.update({
              variationType: variation.type,
              variationValue: variation.value,
              variationPrice: variation.price,
            })
            if (variation.options && variation.options.length > 0) {
              await Promise.all(
                variation.options.map(async (option , index) => {
                  const existingOption = await ProductVariationOption.findOne({
                    where: { id: option.id }
                  })
                  if (existingOption) {
                    await existingOption.update({ value: option.value });

                    const existingStock = await Stock.findOne({
                      where: { ProductVariationOptionId: existingOption.id }
                    })
                    if (existingStock) {
                      await existingStock.update({
                         quantity: variation.options[index].stock || existingStock.quantity, 
                        });
                    }else {
                      await Stock.create({
                        quantity: variation.options[index].stock || 0,
                        ProductVariationOptionId: existingOption.id,
                      });
                    }
                  }
                })
              )
            }
          }
    } else {
      const productVariation = await ProductVariation.create({
        variationType: variation.type,
        variationValue: variation.value,
        productId,
        variationPrice: variation.price,
      })
      if (variation.options && variation.options.length > 0) {
        const variationOptions = variation.options.map((option) => ({
          productVariationId: productVariation.id,
          value: option.value,
        }))
        const createOptions = await ProductVariationOption.bulkCreate(variationOptions);

        await Promise.all(
          createOptions.map(async (option) => {
            await Stock.create({
              ProductVariationOptionId: option.id,
              quantity: variation.option[index].stock || 0,
            });
          })
        );
      }
    }
  })
)
}
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
};
