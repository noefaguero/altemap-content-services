const express = require('express')
const mongoose = require('mongoose')
 
// CONEXION MONGODB
mongoose.connect(process.env.STRING_CONTENTS_DB)
    .then(() => console.log('Conexión con MongoDB'))
    .catch(error => console.error(error))

// INICIAR SERVIDOR
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// SERVIR RUTAS
app.use('/', require('./routes/routes'))

// ESCUCHAR CONEXIONES
const PORT = process.env.CONTENT_URL.split(':')[2]
app.listen(
    PORT, 
    () => console.log(`CONTENT-SERVICES en el puerto ${PORT}`)
)