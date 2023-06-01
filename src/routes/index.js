const express = require('express');
const router = express.Router();
const { getPociones, getIngredientes, setPocion, editPocion, deletePocion, editIngredientes} = require('./controllers/controllers')

/* Ruta obtener pociones */
router.get('/pociones',getPociones);

//ruta obtener ingredientes

router.get('/ingredientes', getIngredientes);

//Ruta guardar nueva pocion

router.post('/nuevaPocion', setPocion)

//Ruta editar pocion

router.put('/editarPocion/:id', editPocion)

//Ruta eliminar pocion

router.delete('/eliminarPocion/:id',deletePocion)



module.exports = router;
