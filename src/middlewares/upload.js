const multer = require('multer')
const { multerConfig } = require('../config/multer')

// CARGAR ARCHIVOS EN EL SERVIDOR
// obtener middleware de multer
const upload = multer(multerConfig)

// manejar errores
const handleUploadErrors = (error, req, res, next) => {
    if (!error) next()

    if (error instanceof multer) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            res.json({ error: 'El tamaño del archivo es demasiado grande' })
        } else {
            res.json({ error: error.message })
            console.log('ERROR EN MULTER:', error.message)
        }
    } else {
        res.status(500)
    }
    next()
}


module.exports = {
    upload,
    handleUploadErrors
}