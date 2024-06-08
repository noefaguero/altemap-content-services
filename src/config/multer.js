const multer = require('multer')


const setFileName = (file, cb) => { // cb es la funcion de callback
    const extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
    const filename = `${file.fieldname}_${Date.now()}.${extension}`
    cb(null, filename)
}

const setFileFilter = (req, file, cb, regex, str) => {
    const extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
    const allowedTypes = regex

    if (allowedTypes.test(extension) && allowedTypes.test(file.mimetype)) {
        return cb(null, true)
    } else {
        cb(new Error(`Solo se permiten archivos ${str}`))
    }
}


// configuracion de carga de imagenes
exports.uploadImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, `uploads/delivery/${req.params.id_project}`), // carpeta de entrega de contenidos del projecto
        filename: (req, file, cb) => setFileName(file, cb)
    }),
    limits: { fileSize: 1024 * 1024 * 1 }, // limite de 1MB
    fileFilter: (req, file, cb) => setFileFilter(req, file, cb, '/jpeg|jpg|png|webp/i', 'jpeg, jpg y png')
})

// configuracion de carga de pdf
exports.uploadPDF = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/delivery/'),
        filename: (req, file, cb) => setFileName(file, cb)
    }),
    limits: { fileSize: 1024 * 1024 * 5 }, // limite de 5MB
    fileFilter: (req, file, cb) => setFileFilter(req, file, cb, '/pdf/i', 'pdf')
})