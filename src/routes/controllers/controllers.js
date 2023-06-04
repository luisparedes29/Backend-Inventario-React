const { ingredientes } = require('../../models/ingredientes');
const { pociones } = require('../../models/pociones');
const fs = require('fs');
const path = require('path');

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
const setPocion = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            categoria,
            precio,
            ingredientesUtilizados,
            cantidadDisponible,
        } = req.body;
        console.log(req.body)


        if (!ingredientesUtilizados) {
            return res.status(400).json({ mensaje: "Los ingredientes no están definidos" });
        }

        const ingredientesPromises = ingredientesUtilizados.map((ingrediente) =>
            ingredientes.findOne({ where: { nombre: ingrediente } })
        );
        const ingredientesObtenidos = await Promise.all(ingredientesPromises);

        for (const ingrediente of ingredientesObtenidos) {
            if (
                !ingrediente ||
                ingrediente.cantidadDisponible < cantidadDisponible
            ) {
                return res
                    .status(400)
                    .json(
                        `mensaje: No hay suficiente cantidad del ingrediente ${ingrediente.nombre}`
                    );
            }
        }
        const nuevaPocion = await pociones.create({
            nombre: nombre,
            descripcion: descripcion,
            categoria: categoria,
            precio: precio,
            cantidadDisponible: cantidadDisponible,
            ingredientes: ingredientesUtilizados.join(', '),
            imagenPocion:
                'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        });
        for (const ingrediente of ingredientesObtenidos) {
            const nuevaCantidad =
                ingrediente.cantidadDisponible - cantidadDisponible;
            await ingrediente.update({ cantidadDisponible: nuevaCantidad });
        }
        res.status(200).json(nuevaPocion);
    } catch (error) {
        console.log(error); // Agregar esta línea para imprimir el error en la consola
        res.status(500).json({ mensaje: "Ocurrió un error en el servidor" });
    }
};
//editar una pocion
const editPocion = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            categoria,
            precio,
            cantidadDisponible,
            ingredientesUtilizados,
        } = req.body;

        const pocion = await pociones.findByPk(req.params.id);

        if (!pocion) {
            return res.status(404).json('mensaje: No se encontró la poción');
        }

        const ingredientesPrevios = pocion.ingredientes.split(', ');

        const ingredientesPromises = ingredientesUtilizados.map((ingrediente) =>
            ingredientes.findOne({ where: { nombre: ingrediente } })
        );
        const ingredientesObtenidos = await Promise.all(ingredientesPromises);

        for (const ingrediente of ingredientesObtenidos) {
            if (!ingrediente) {
                return res.status(400).json(`mensaje: No se encontró el ingrediente ${ingrediente}`);
            }
        }

        const ingredientesEliminados = ingredientesPrevios.filter(
            (ingrediente) => !ingredientesUtilizados.includes(ingrediente)
        );

        const ingredientesAgregados = ingredientesUtilizados.filter(
            (ingrediente) => !ingredientesPrevios.includes(ingrediente)
        );

        for (const ingrediente of ingredientesEliminados) {
            const ingredienteEliminado = await ingredientes.findOne({ where: { nombre: ingrediente } });
            const cantidadIngrediente = ingredienteEliminado.cantidadDisponible;
            const nuevaCantidad = cantidadIngrediente + pocion.cantidadDisponible;
            await ingredienteEliminado.update({ cantidadDisponible: nuevaCantidad });
        }

        for (const ingrediente of ingredientesAgregados) {
            const ingredienteAgregado = await ingredientes.findOne({ where: { nombre: ingrediente } });
            const cantidadIngrediente = ingredienteAgregado.cantidadDisponible;
            const nuevaCantidad = cantidadIngrediente - pocion.cantidadDisponible;
            if (nuevaCantidad < 0) {
                return res
                    .status(400)
                    .json(`mensaje: No hay suficiente cantidad del ingrediente ${ingrediente}`);
            }
            await ingredienteAgregado.update({ cantidadDisponible: nuevaCantidad });
        }

        const diferenciaCantidad = cantidadDisponible - pocion.cantidadDisponible;

        for (const ingrediente of ingredientesObtenidos) {
            const nuevaCantidad = ingrediente.cantidadDisponible - diferenciaCantidad;
            if (nuevaCantidad < 0) {
                return res
                    .status(400)
                    .json(`mensaje: No hay suficiente cantidad del ingrediente ${ingrediente.nombre}`);
            }
            await ingrediente.update({ cantidadDisponible: nuevaCantidad });
        }

        await pociones.update(
            {
                nombre: nombre,
                descripcion: descripcion,
                categoria: categoria,
                precio: precio,
                cantidadDisponible: cantidadDisponible,
                ingredientes: ingredientesUtilizados.join(', '),
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        res.status(200).json('mensaje: Poción editada correctamente');
    } catch (error) {
        res.status(500).json(`mensaje: ${error}`);
    }
};

// eliminar una pocion
const deletePocion = async (req, res) => {
    try {
        const pocion = await pociones.findByPk(req.params.id);

        if (!pocion) {
            return res.status(404).json('mensaje: No se encontró la poción');
        }

        const ingredientesUtilizados = pocion.ingredientes.split(', ');

        for (const ingrediente of ingredientesUtilizados) {
            const ingredienteEncontrado = await ingredientes.findOne({ where: { nombre: ingrediente } });
            if (ingredienteEncontrado) {
                const cantidadIngrediente = ingredienteEncontrado.cantidadDisponible;
                const nuevaCantidad = cantidadIngrediente + pocion.cantidadDisponible;
                await ingredienteEncontrado.update({ cantidadDisponible: nuevaCantidad });
            }
        }

        await pociones.destroy({
            where: {
                id: req.params.id,
            },
        });

        res.status(200).json('mensaje: Poción eliminada correctamente');
    } catch (error) {
        res.status(500).json(`mensaje: ${error}`);
    }
};

// funcion para crear un inventario de ingredientes al iniciar
const guardarIngredientesEnBD = async (ingredientesIniciales) => {
    try {
        let datosIniciales
        ingredientes.findAll().then((data) => datosIniciales=data);
        if(datosIniciales) return console.log("Ya hay datos")
        for (const ingrediente of ingredientesIniciales) {
            await ingredientes.create(ingrediente);
        }

        console.log('Ingredientes guardados en la base de datos.');
    } catch (error) {
        console.error(
            'Error al guardar los ingredientes en la base de datos:',
            error
        );
    }
};

//ruta para accionar los ingredientes al iniciar
const editIngredientes = async () => {
    try {
        const filePath = path.join(__dirname, 'ingredientes.json');
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const ingredientesIniciales = JSON.parse(fileData);
        guardarIngredientesEnBD(ingredientesIniciales)
        //     res
        //         .status(200)
        //         .json('mensaje: Ingredientes guardados en la base de datos')
        // );
        console.log("Ingredientes Iniciales creados")
    } catch (error) {
        console.log("Hubo un error ",error)
       // res.status(500).json(`mensaje:${error}`);
    }
};

module.exports = {
    getPociones,
    getIngredientes,
    setPocion,
    editPocion,
    deletePocion,
    editIngredientes,
};
