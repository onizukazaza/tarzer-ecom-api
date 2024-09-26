const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const ProductVariationOption = require('./productvariationoption');


const Stock = sequelize.define(
    "stocks", 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ProductVariationOptionId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ProductVariationOption,
                key: 'id'
            },
            onDelete: 'CASCADE',
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    },{
        timestamps: true,
        underscored: true,
        freezeTableName: true,
    })
    
    Stock.belongsTo(ProductVariationOption, {
        foreignKey: 'productVariationOptionId',
        as: 'productVariationOption',
        onDelete: 'CASCADE',
      });
      
      module.exports = Stock;