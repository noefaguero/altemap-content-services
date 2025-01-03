const multer = require("multer")
const path = require("path")
const { UPLOADS_URI } = require("../utils/constants")

// tamaño limite, mensaje de error y expresion regular de formatos permitidos según el atributo name
const TYPES = {
    image: {
        limit: 1024 * 1024, // 1MB
        regex: /jpeg|jpg|png|svg\+xml|webp|avif/i,
        msg: "jpg, png, svg, webp y avif",
    },
    application: {
        limit: 1024 * 1024 * 5, // 5MB
        regex: /pdf/i,
        msg: "pdf",
    },
}

// OBJETO DE CONFIGUARACION ////////////////////////////////////////////////////////////////////////////
exports.multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dest = path.join(UPLOADS_URI, "delivery", req.project)
            cb(null, dest)
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            const name = path.basename(file.originalname, ext)
            // eliminar caracteres no alfanumericos
            const uniformName = name.toLowerCase().replace(/[^\w\s]/g, "_")
            const filename = `${uniformName}_${Math.floor(Date.now() / 1000)}${ext}`
            cb(null, filename)
        },
    }),
    fileFilter: (req, file, cb) => {
        const [type, subtype] = file.mimetype.split("/")
        // validar formato de archivo
        if (!TYPES[type]) {
            return cb(new Error(`El formato del archivo no es válido`))
        }
        const { regex, limit, msg } = TYPES[type]
        if (!regex.test(subtype)) {
            return cb(new Error(`Solo se permiten archivos ${msg}`))
        }
        // validar tamaño del archivo
        if (file.size > limit) {
            return cb(new Error(`El archivo ${file.originalname} excede el tamaño máximo de ${limit / 1024 / 1024} MB`));
        }

        cb(null, true)
    },
    preservePath: false
}