# Backend-Inventario-React
 Desarrollar una aplicación web utilizando React con Vite como bundler, que se conecte a un backend para realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre el inventario de una tienda de pociones mágicas. La aplicación deberá funcionar como un SPA (Single Page Application) sin utilizar React Router.

## Tecnologías Utilizadas

- Node.js
- Express
- Sequelize (ORM para Node.js)
- Cloudinary (Servicio de almacenamiento de imágenes en la nube)

## Detalles Técnicos

Este proyecto es un servidor creado con Node.js y Express. Utiliza una base de datos MySQL a través de Sequelize como ORM para la interacción con la base de datos. Además, utiliza Cloudinary como servicio de almacenamiento en la nube para las imágenes de las pociones.

### Configuración

Antes de iniciar el proyecto, asegúrate de tener configurados los siguientes valores en el archivo `.env`:

 `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_HOST`: Configuración de la base de datos MySQL. Asegúrate de tener una base de datos creada con el nombre especificado(o no).
- `CLOUD_NAME`, `KEY_CLOUD` y `KEY_SECRET`: Configuración de Cloudinary. Estos valores se obtienen al crear una cuenta en Cloudinary y generar las credenciales de API.

### Instalación

1. Clona el repositorio: `git clone https://github.com/luisparedes29/Backend-Inventario-React.git`
2. Ve al directorio del proyecto: `cd turepositorio`
3. Instala las dependencias: `npm install`

### Uso

1. Inicia el servidor: `npm start`
2. Accede a la aplicación a través de la URL: `http://localhost:3000`

## Contribución

Si quieres contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama: `git checkout -b feature/nueva-funcionalidad`
3. Realiza los cambios necesarios y haz commit: `git commit -am 'Agrega nueva funcionalidad'`
4. Haz push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un pull request en el repositorio original.
