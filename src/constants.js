const path = require('path')
const { NODE_ENV } = process.env

exports.UPLOADS_URI = (() => {
    if (NODE_ENV === 'staging') {
        return process.env.UPLOAD_PATH
    } else if (NODE_ENV === 'development') {
        return path.join(__dirname, '../../../uploads') // ruta relativa
    }
})()

exports.REGEXS = {
    url: {
        expression: 'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/',
        message: 'URL no válida'
    }
}