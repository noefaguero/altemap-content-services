const path = require('path')
const fs = require('fs/promises')

// OPERACIONES EN EL SISTEMA DE ARCHIVOS ////////////////////////////////////////////////

// eliminar archivos del directorio delivery
exports.deleteDeliveryFiles = async (project, paths) => {
    try {
        paths.map(async (item) => await fs.unlink(
            path.join(UPLOADS_URI, 'delivery', project, item)
        ))
    } catch (error) {
        console.error('Error eliminando archivo del directorio delivery:', error)
        throw error
    }
}