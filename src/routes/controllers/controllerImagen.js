const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const { pociones } = require('../../models/pociones');

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.KEY_CLOUD,
    api_secret: process.env.KEY_SECRET,
});

const storage = multer.diskStorage({
    destination: './',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

const cargarImagen = (req, res) => {
    upload.fields([{ name: 'image', maxCount: 1 }])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            // Retrieve uploaded files from request object
            const image = req.files.image ? req.files.image[0] : undefined;

            if (image) {
                const response = await cloudinary.uploader.upload(image.path, {
                    folder: 'images',
                });
                res.status(201).json({
                    image: {
                        public_id: response.public_id,
                        url: response.secure_url,
                    },
                });
                fs.unlinkSync(image.path);
                await pociones.update(
                    { imagenPocion: `${response.secure_url}` },
                    {
                        where: {
                            id: req.params.id,
                        },
                    }
                );
            } else {
                console.log("todo bien")
                // res.status(400).json({ error: 'No se envió ningún archivo' });
            }
        } catch {
            console.error(err)
            // res.status(500).json({ error: 'Internal Server Error' });
        }
    });
};

const getImagen= async (req,res)=>{
    try {
        const cloudinary = await pociones.findOne(
            {
                where:
                    { id: req.params.id }
            })
        res.status(200).json({
            image: {
                url: cloudinary.imagenPocion,
            },
        });
    } catch (error) {
        res.status(404).json({
            error: "Usuario no encontrado",
        })
    }

}

module.exports.imagenController = {
    cargarImagen,
    getImagen
};