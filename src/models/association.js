const Product = require('./product');
const ProductImage = require('./productImage');
const ProductVariation = require('./productvariation');
const ProductVariationOption = require('./productvariationoption');
const Stock = require('./stock');
const User = require('./user');

Product.hasMany(ProductImage, { 
    foreignKey: 'productId',
    as: 'images',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', 
})

Product.hasMany(ProductVariation,{
    foreignKey: 'productId',
    as: 'productVariations',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

User.hasMany(Product, {
    foreignKey: 'sellerId',
    as: 'ownerproducts',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

ProductVariation.hasMany(ProductVariationOption, {
    foreignKey: 'productVariationId',
    as: 'productVariationOptions',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', 
})

ProductVariationOption.hasMany(Stock, {
    foreignKey: 'productVariationOptionId',
    as: 'stocks',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Stock.belongsTo(ProductVariationOption, {
    foreignKey: 'productVariationOptionId',
    as: 'stockproductVariationOption',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',  
})
module.exports = {
    Product,
    ProductImage,
    ProductVariation,
    ProductVariationOption,
    Stock,
    User, 
}