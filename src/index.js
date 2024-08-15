const express = require('express')
const mongoose = require('mongoose')
const handleUploadError = require('./middlewares/handleUploadError')

// CONEXION MONGODB
mongoose.connect(process.env.STRING_CONTENTS_DB).catch(error => console.error(error))

// INICIAR SERVIDOR
const app = express()

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// SERVIR RUTAS
app.use('/content-services', require('./routes'))

// MIDDLEWARE DE MANEJO DE ERRORES DE CARGA DE ARCHIVOS
app.use(handleUploadError())

// ESCUCHAR CONEXIONES
const PORT = process.env.CONTENT_URL.split(':')[2]
app.listen(PORT, () => console.log(`\t-> CONTENT-SERVICES en el puerto ${PORT}`))