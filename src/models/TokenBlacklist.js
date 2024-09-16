const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 

class TokenBlacklist extends Model {}

TokenBlacklist.init(
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },

  },
  {
    sequelize,
    modelName: "TokenBlacklist",
    tableName: "tokenBlacklists",
  }
);

module.exports = TokenBlacklist;
