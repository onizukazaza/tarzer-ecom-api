const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false, 
    },
  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  }
);



  (async () => {
    await sequelize.sync();
    console.log("Product model created");
  })()

module.exports = Product;
