const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const ProductImage = require("./productImage");
const ProductVariation = require("./productvariation");

const Product = sequelize.define(
  "products",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },

  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
);

Product.hasMany(ProductImage, {
  foreignKey: 'productId',
  as: 'images',
});

Product.hasMany(ProductVariation, {
  foreignKey: 'productId',
  as: 'variations',
});
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });


module.exports = Product;
