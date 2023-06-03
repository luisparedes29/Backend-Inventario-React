const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { getPociones, getIngredientes, setPocion, editPocion, deletePocion, editIngredientes} = require('./controllers/controllers')
const {imagenController}= require('./controllers/controllerImagen')

/* Ruta obtener pociones */
router.get('/pociones',getPociones);

//ruta obtener ingredientes

router.get('/ingredientes', getIngredientes);

//ruta interna para crear ingredientes iniciales

router.post('/editarIngredientes', editIngredientes);

//Ruta guardar nueva pocion

router.post('/nuevaPocion', setPocion)

//Ruta editar pocion

router.put('/editarPocion/:id', editPocion)

//Ruta eliminar pocion

router.delete('/eliminarPocion/:id',deletePocion)

//ruta Cargar Imagen de la pocion en cloudinary y BD

router.post('/upload', imagenController.cargarImagen);

//Ruta obtener link de la imagen

router.post('/getImage/:id', imagenController.getImagen);


module.exports = router;
