const multer = require('multer')


const setFileName = (file, cb) => { // cb es la funcion de callback
    const extension = file.originalname.split('.')[-1]
    const filename = `${file.fieldname}_${Date.now()}.${extension}`
    cb(null, filename)
}

exports.uploadImage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/delivery/'), // carpeta de entrega de contenidos
        filename: (req, file, cb) => setFileName(file, cb)
    }),
    limits: { fileSize: 1024 * 1024 * 1 }, // limite de 1MB
    fileFilter: (req, file, cb) => {
        const extension = file.originalname.split('.')[-1]
        const allowedTypes = /jpeg|jpg|png|webp/i

        if (allowedTypes.test(extension) && allowedTypes.test(file.mimetype)) {
            return cb(null, true) // error nulo, se acepta
        } else {
            cb(new Error('Solo se permiten archivos jpeg, jpg y png'))
        }
    }
})

exports.uploadPDF = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/delivery/'),
        filename: (req, file, cb) => setFileName(file, cb)
    }),
    limits: { fileSize: 1024 * 1024 * 5 }, // limite de 5MB
    fileFilter: (req, file, cb) => {
        const extension = file.originalname.split('.')[-1]
        const allowedTypes = /pdf/i

        if (allowedTypes.test(extension) && allowedTypes.test(file.mimetype)) {
            return cb(null, true)
        } else {
            cb(new Error('Solo se permiten archivos pdf'))
        }
    }
})