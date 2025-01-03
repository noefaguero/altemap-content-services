const express = require('express')
const mongoose = require('mongoose')
const { agenda, startAgenda } = require('./config/agenda')
const { ALLOWED_FIELDS } = require('./utils/constants')
const { CONTENT_HOST } = process.env

// CONEXION MONGODB
mongoose.set('transactionAsyncLocalStorage', true)
    .connect(process.env.CONTENTS_DB)
    .catch(error => console.error(error))

// INICIAR SERVIDOR
const app = express()

// SERVIR RUTAS
app.use('/content-services', require('./routes'))

// MIDDLEWARE DE MANEJO DE ERRORES GENERALES
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ error: { message: error.message } })
})

// ESCUCHAR CONEXIONES
const PORT = CONTENT_HOST.split(':')[2]
agenda.on('ready', async () => { // asegurar configuración de agenda
    await startAgenda()
    await ALLOWED_FIELDS.load()
    app.listen(
        PORT, 
        () => console.log(`\n\t\x1b[1m%s\x1b[0m \n\t-> Local: ${CONTENT_HOST}\n`, 'CONTENT-SERVICES READY')
    )
})