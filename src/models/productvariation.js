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
        model: 'products', 
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
);


module.exports = ProductVariation;
