const { DataTypes } = require("sequelize");
const { sequelize } = require("../dbconfig");

const ingredientes = sequelize.define('ingredientes', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    cantidadDisponible: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: true,
            min: 0,
        }
    }
});

module.exports = { ingredientes };