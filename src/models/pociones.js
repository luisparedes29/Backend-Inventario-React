const { DataTypes } = require("sequelize");
const { sequelize } = require("../dbconfig");

const pociones = sequelize.define('pociones', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    categoria: DataTypes.STRING,
    imagenPocion: DataTypes.STRING,
    precio: DataTypes.INTEGER,
    cantidadDisponible: DataTypes.INTEGER
    // secure_url: DataTypes.STRING
});


module.exports = { pociones };