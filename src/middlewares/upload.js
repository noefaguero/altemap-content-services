const multer = require('multer')
const { multerConfig } = require('../config/multer')

// obtener middleware de multer para carga de archivos
const upload = multer(multerConfig)


module.exports = upload