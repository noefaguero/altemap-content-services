const { createFromHexString } = require('mongoose/lib/types/objectid')
const Project = require('../database/models/projectModel')
const { handleNotFound } = require('../utils/helpers')


exports.getMetrics = async (id) => {
    try {
        return handleNotFound(
            await Project.findById(id, 'metrics').lean(),
            "Proyecto no encontrado"
        )
    } catch (error) {
        throw error
    }
}


exports.getProjectComponents = async (id) => {
    try {
        const result = handleNotFound(
            await Project.findOne({_id: id}, 'components').populate('components', '_id name'),
            "Proyecto no encontrado"
        )
        return result.components
    } catch (error) {
        throw error
    }
}


// actualizar registro de medios del proyecto
exports.updateMediaLog = async function (media, increment) {
	const totalSize = media.reduce((acu, file) => acu += parseFloat(file.size), 0)
	const projectId = media[0].url.split('/')[4]

    handleNotFound(
        await Project.findByIdAndUpdate(
            projectId, 
            {
                $inc: {
                    "metrics.media.total_files": increment ? media.length : -media.length,
                    "metrics.media.total_kb": increment ? totalSize : -totalSize
                }
            }
        ),
        "Proyecto no encontrado"
    )
}


const ensureMediaIsUnused = async (mediaIds, projectId) => {
    try {
        const project = handleNotFound(
            await Project.findOne({
                where: {
                    id: projectId, 
                    component_media: { containedBy: mediaIds }
                }
            }), // si estan todos => false
            "Proyecto no encontrado"
        )
        return !project

    } catch (error) {
        throw error
    }
}

// se ejecuta como transacción en el servicio de medios
exports.addMediaRefs = async (mediaIds, projectId, componentId = null) => {
	try {
        // obtener objectId a partir de la cadena hexadecimal
        if (typeof mediaIds[0] === 'string') {
            mediaIds = mediaIds.map(id => createFromHexString(id))
        }

        if (componentId) { 
            return await Project.findByIdAndUpdate(
                projectId,
                {
                    $push: {
                        media: mediaIds,
                        [`component_media.${componentId}`]: mediaIds
                    }
                }
            )
        } else {
            return await Project.findByIdAndUpdate(
                projectId,
                {
                    media: { $push: mediaIds }
                }
            )
        }

	} catch (error) {
		throw error
	}
}


// se ejecuta dentro de una transacción en el servicio de medios
exports.removeMediaRefs = async (mediaIds, projectId, componentId = null, force = false) => {
	try {
        // eliminar referencias a medios, asegurando que no esté en uso
        if (!componentId && !force) {
            const isUnused = ensureMediaIsUnused(mediaIds, projectId)
            if (!isUnused) {
                throw new Error('No se puede eliminar un archivo que está en uso')
            }

            handleNotFound(
                await Project.findByIdAndUpdate(
                    projectId,
                    {
                        $pull: {
                            media: { $each: mediaIds }
                        }
                    }
                ),
                "Proyecto no encontrado"
            )

        }

        // eliminar solo las relaciones con un componente
        if (componentId && !force) {
            handleNotFound(
                await Project.findByIdAndUpdate(
                    projectId,
                    {
                        $pull: { 
                            [`component_media.${componentId}`]: mediaIds
                        }
                    }
                ),
                "Proyecto no encontrado"
            )
        }

        // eliminar referencia al medio y relacion con el componente
        // se usa para revertir carga optimista
        if (componentId && force) {
            handleNotFound(
                await Project.findByIdAndUpdate(
                    projectId,
                    {
                        $pull: {
                            media: { $each: mediaIds },
                            [`component_media.${componentId}`]: mediaIds
                        }
                    }
                ),
                "Proyecto no encontrado"
            )
        }

	} catch (error) {
		throw error
	}
}