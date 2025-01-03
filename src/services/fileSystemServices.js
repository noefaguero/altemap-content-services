const path = require('path')
const fs = require('fs/promises')

// eliminar archivos
exports.deleteFiles = async (paths) => {
    try {
        paths.map(async (item) => await fs.rm(path.join(process.env.UPLOADS_URI, item)))
        
    } catch (error) {
        console.error('Error eliminando archivos')
        throw error
    }
}