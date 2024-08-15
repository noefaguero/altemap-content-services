const multer = require('multer')

// MANEJAR ERROR EN CARGA DE ARCHIVO
const handleUploadError = () => {
    return (error, req, res, next) => {

        if (!error) next()
            
        if (error instanceof multer) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                res.json({ error: 'El tamaño del archivo es demasiado grande' })
            } else {
                res.json({ error: error.message })
            }
        } else {
            res.status(500)
        }

        next()
    }
}

module.exports = handleUploadError