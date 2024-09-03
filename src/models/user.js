const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true 
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('buyer', 'seller', 'admin'),
        defaultValue: 'buyer' 
    }
}, {
    timestamps: true,
    paranoid: true, 
    underscored: true,
    freezeTableName: true,
    tableName: 'users',
});


(async () => {
    await User.sync(); 
    console.log('User table created');
})();

module.exports = User;
