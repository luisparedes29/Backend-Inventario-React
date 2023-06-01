const { DataTypes } = require("sequelize");
const { sequelize } = require("../dbconfig");

const ingredientes = sequelize.define('ingredientes', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    cantidadDisponible: DataTypes.INTEGER
});


module.exports = { ingredientes };