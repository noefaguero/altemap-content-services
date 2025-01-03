const projectServices = require('./projectServices')
const mediaServices = require('./mediaServices')
const elementServices = require('./elementServices')
const mongoose = require('mongoose')


exports.postMedia = async (data, projectId, componentId) => {
    try {
        const results = await mongoose.connection.transaction(
            async () => {
                // COLECCIÓN DE MEDIOS
                // insertar datos de los archivos
                const newMedia = await mediaServices.postMedia(data)

                // COLECCIÓN DE PROYECTOS
                // actualizar el registro de medios
                await projectServices.updateMediaLog(data, true)
                // añadir referencias
                const ids = newMedia.map(media => media.id)
                await projectServices.addMediaRefs(ids, projectId, componentId)

                return newMedia
            }
        )
        return results.map(item => item._doc)

    } catch (error) {
        throw error
    }
}

exports.deleteMedia = async (mediaIds, projectId) => {
    try {
        const transaction = await mongoose.connection.transaction(
            async (session) => {
                // eliminar datos de archivos
                await mediaServices.deleteMedia(mediaIds)
                // eliminar referencias de archivos
                await projectServices.removeMediaRefs(mediaIds, projectId)
                // actualizar el registro de medios
                const media = await mediaServices.getMedia(mediaIds)
                await projectServices.updateMediaLog(media, false)

                return {
                    abort: session.abort, 
                    commit: session.commit
                }
            }
        )
        return transaction

    } catch (error) {
        throw error
    }
}


exports.postElement = async (elementData) => {
    try {
        // se usa una transaccion para revertir las operaciones del middleware pre-save en caso de error
        const result = await mongoose.connection.transaction(
            async () => elementServices.postElement(elementData)
        )
        return result._doc

    } catch (error) {
        throw new Error('No se ha podido insertar el elemento')
    }
}


exports.putElementWithMedia = async (oldMediaIds, newMediaIds, elementId, elementData, projectId, componentId) => {
    try {
        const result = await mongoose.connection.transaction(
            async () => {
                // eliminar referencias de archivos antiguos
                if (oldMediaIds.length > 0) {
                    await projectServices.removeMediaRefs(oldMediaIds, projectId, componentId)
                }
                // añadir nuevas referencias de archivos
                if (newMediaIds.length > 0) {
                    await projectServices.addMediaRefs(newMediaIds, projectId, componentId)
                }
                // actualizar elemento
                return await elementServices.putElement(elementId, elementData)
            }
        )
        return result

    } catch (error) {
        throw new Error('No se ha podido actualizar el elemento')
    }
}


// elimina referencias y datos de archivos
exports.revertMedia = async (mediaIds, projectId, componentId) => {
    try {
        const result = await mongoose.connection.transaction(
            async() => {
                // COLECCIÓN DE MEDIOS
                // eliminar datos de medios
                await mediaServices.deleteMedia({ _id: { $in: mediaIds } })

                // COLECCIÓN DE PROYECTOS
                // eliminar referencias de medios
                await projectServices.removeMediaRefs(mediaIds, projectId, componentId, true)
                // actualizar el registro de medios
                const media = await mediaServices.getMedia(mediaIds)
                await projectServices.updateMediaLog(media, false)
            }
        )
        return result

    } catch (error) {
        throw error
    }
}


// elimina un elemento y sus referencias a datos de archivos
exports.deleteElementWithMedia = async (mediaIds, elementId, projectId, componentId) => {
    try {
        const result = await mongoose.connection.transaction(
            async () => {
                // COLECCIÓN DE ELEMENTOS
                // eliminar elemento
                const element = await elementServices.deleteElement(elementId)

                // COLECCIÓN DE PROYECTOS
                if (mediaIds.length > 0) {
                    // eliminar referencias de medios
                    await projectServices.removeMediaRefs(mediaIds, projectId, componentId, false)
                    // actualizar el registro de medios
                    const media = await mediaServices.getMedia(mediaIds)
                    await projectServices.updateMediaLog(media, false)
                }
                return element
            }
        )
        return { 
            _id: result._id,
            component_id: result.component_id
        }

    } catch (error) {
        throw error
    }
}