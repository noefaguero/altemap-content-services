const multer = require('multer')
const { UPLOADS_URI } = require('../constants')

// tamaño limite, mensaje de error y expresion regular de formatos permitidos según el atributo name
const TYPES = {
    imagen: {
        limit: 1024 * 1024, // 1MB
        regex: '/jpeg|jpg|png|webp/i',
        msg: 'jpeg, jpg, png y webp'
    },
    pdf: {
        limit: 1024 * 1024 * 5, // 5MB
        regex: '/pdf/i',
        msg: 'pdf'
    }
}

// asignar nombre al archivo
const setFileName = (file, cb) => { // cb es la funcion de callback
    const ext = `.${file.mimetype.split('/')[1]}`
    // eliminar caracteres no alfanumericos
    const uniformName = file.originalname.replace(ext, '').toLowerCase().replace(/[^\w\s-]/g, '_')
    const filename = `${uniformName}_${Date.now() / 60000}${ext}`
    cb(null, filename)
}

// validar el tipo de archivo
const setFileFilter = (req, file, cb, regex, msg) => {
    if (regex.test(file.mimetype.split('/')[1])) {
        return cb(null, true)
    } else {
        cb(new Error(`Solo se permiten archivos ${msg}`))
    }
}

// asignar ruta de destino del archivo
const setPath = ({ project, params }, file) => path.join(
    UPLOADS_URI, 'delivery', project, params.component, file.filename
) // al directorio delivery    


// OBJETO DE CONFIGUARACION ////////////////////////////////////////////////////////////////////////////
exports.multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, setPath(req, file)),
        filename: (req, file, cb) => setFileName(file, cb)
    }),
    limits: file => {
        return { fileSize: TYPES[file.fieldname].limit }
    },
    limits: {
        fileSize: (req, file, cb) => {
            return TYPES[file.fieldname]?.limit || 1024 * 1024 // 1MB por defecto
        }
    },
    fileFilter: (req, file, cb) => {
        const fileFilter = setFileFilter(
            req,
            file,
            cb,
            TYPES[file.fieldname].regex,
            TYPES[file.fieldname].msg
        )
    }
}
