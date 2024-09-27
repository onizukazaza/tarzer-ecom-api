const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
// const ProductImage = require("./productImage");
// const ProductVariation = require("./productvariation");

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
        model: 'users',
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
);

// Product.hasMany(ProductImage, {
//   foreignKey: 'productId',
//   as: 'images',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

// Product.hasMany(ProductVariation, {
//   foreignKey: 'productId',
//   as: 'variations',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });
// Product.belongsTo(User, { 
//   foreignKey: 'sellerId', 
//   as: 'seller',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
  
//   });

  (async () => {
    await sequelize.sync();
    console.log("Product model created");
  })()

module.exports = Product;
