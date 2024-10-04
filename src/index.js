const express = require('express')
const mongoose = require('mongoose')
const { agenda, startAgenda } = require('./config/agenda')

// CONEXION MONGODB
mongoose.connect(process.env.STRING_CONTENTS_DB).catch(error => console.error(error))

// INICIAR SERVIDOR
const app = express()

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// SERVIR RUTAS
app.use('/content-services', require('./routes'))

// MIDDLEWARE DE MANEJO DE ERRORES GENERALES
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ error: { message: error.message } })
})

// ESCUCHAR CONEXIONES
const URL = process.env.CONTENT_URL
const PORT = URL.split(':')[2]
agenda.on('ready', () => { // asegurar configuración de agenda
    startAgenda()
    app.listen(
        PORT, 
        () => console.log(`\n\t\x1b[1m%s\x1b[0m \n\t-> Local: ${URL}\n`, 'CONTENT-SERVICES READY')
    )
})