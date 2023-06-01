const { ingredientes } = require('../../models/ingredientes');
const { pociones } = require('../../models/pociones');

//Obtener todas las pociones
const getPociones = (req, res) => {
    try {
        pociones.findAll().then((data) => res.status(200).json(data));
    } catch (error) {
        res.status(500).json(`message:${error}`);
    }
};
//Obtener todos los ingredientes
const getIngredientes = (req, res) => {
    try {
        ingredientes.findAll().then((data) => res.status(200).json(data));
    } catch (error) {
        res.status(500).json(`mensaje:${error}`);
    }
};
//Guardar una pocion
const setPocion = (req, res) => {
    try {
        const { nombre, descripcion, categoria, precio, cantidadDisponible } =
            req.body;
        pociones
            .create({
                nombre: nombre,
                descripcion: descripcion,
                categoria: categoria,
                precio: precio,
                cantidadDisponible: cantidadDisponible,
                imagenPocion:
                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            })
            .then(() =>
                res.status(200).json('mensaje:Pocion guardada con exito')
            );
    } catch (error) {
        res.status(500).json(`mensaje:${error}`);
    }
};
//editar una pocion
const editPocion = (req, res) => {};

const deletePocion = (req, res) => {
    try {
        pociones
            .destroy({ where: { id: req.params.id } })
            .then(() =>
                res.status(200).json('mensaje: pocion eliminada correctamente')
            );
    } catch (error) {
        res.status(500).json(`mensaje:${error}`);
    }
};

const editIngredientes = (req, res) => {};

module.exports = {
    getPociones,
    getIngredientes,
    setPocion,
    editPocion,
    deletePocion,
    editIngredientes,
};
