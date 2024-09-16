const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Address = sequelize.define(
  "addresses",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    recipientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalAddress:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    houseNumber:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [10, 15],
      },
    },
    Favorite:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: "addresses",
  }
);

async () => {
  await Address.sync();
  console.log("Addresses table created");
};

module.exports = Address;
