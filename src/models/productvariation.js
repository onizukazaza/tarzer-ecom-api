const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");

const ProductVariation = sequelize.define(
  "productVariations",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    variationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variationValue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products', 
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    variationPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    image_variation: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
);

// Product.hasMany(ProductVariation, {
//   foreignKey: 'productId',
//   as: 'variations',
//  });

// ProductVariation.belongsTo(Product, {
//   foreignKey: 'productId',
//   as: 'product',
// })

module.exports = ProductVariation;
