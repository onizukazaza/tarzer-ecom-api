const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ProductVariation = require("./productvariation");

const ProductVariationOption = sequelize.define(
  "productVariationOptions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productVariationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductVariation,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: "product_variation_options",
  }
);


ProductVariationOption.belongsTo(ProductVariation, {
  foreignKey: "productVariationId",
  as: "productVariation",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ProductVariation.hasMany(ProductVariationOption, {
  foreignKey: "productVariationId",
  as: "options",
})


module.exports = ProductVariationOption;
