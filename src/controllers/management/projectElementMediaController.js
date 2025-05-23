const projectElementMediaServices = require('../../services/projectElementMediaServices')
const elementServices = require('../../services/elementServices')
const fileSystemServices = require('../../services/fileSystemServices')


// ELEMENT WITH MEDIA //////////////////////////////////////////////////////////////////////////////////
const postElementWithMedia = async (elementData, projectId) => {
	// medios cargados y metadatos ya insertados
	const media = Object.values(elementData.content.media)
	delete elementData.content.media

	try {
		return await projectElementMediaServices.postElement(elementData)

	} catch (error) {
		console.error(error)
		// revertir carga optimista de medios
		if (media.length > 0) {
			// revertir carga optimista de archivos
			const mediaIds = media.map(file => file.id)
			await projectElementMediaServices.revertMedia(mediaIds, elementData.component, projectId)
		}
		throw error
	}
}


const putElementWithMedia = async (elementData, elementId, componentId, projectId) => {
	// campo-medios cargados e insertados de forma optimista y su campo
	let newMediaIds = []
	let mediaKeys, mediaValues
	if (elementData.content.media > 0) {
		[mediaKeys, mediaValues] = Object.entries(elementData.content.media)
		newMediaIds = mediaValues.map(file => file.id)
	}
	delete elementData.content.media

	try {
		// obtener medios a eliminar
		let oldMediaIds = []
		if (mediaKeys?.length > 0) {
			// obtener datos previos del elemento
			const prevElement = await elementServices.getElementById(elementId)
			// filtrar archivos previos a modificar (solo se envian los campos a modificar)
			const oldMedia = []
			Object.entries(prevElement.content).forEach(([key, file]) => {
				if (typeof file === 'object' && mediaKeys.includes(key)) {
					oldMedia.push(file)
				}
			})
			oldMediaIds = oldMedia.map(file => file.id)
		}
		// eliminar datos de archivos en la colección de medios
		return await projectElementMediaServices.putElementWithMedia(
			oldMediaIds, 
			newMediaIds, 
			elementId, 
			elementData, 
			projectId, 
			componentId
		)

	} catch (error) {
		console.error(error)
		if (mediaKeys?.length > 0) {
			// revertir carga optimista de archivos
			await projectElementMediaServices.revertMedia(newMediaIds, projectId, componentId)
		}
		throw error
	}
}


const deleteElementWithMedia = async (elementId, projectId) => {
	try {
		// obtener elemento
		const element = await elementServices.getElementById(elementId)
		const componentId = element.component_id.toString()
		// filtrar campos de archivos
		const files = Object.values(element.content)
			.filter(field => Array.isArray(field) && field.length > 0 && typeof field[0] === 'object')
			.flat()
		const mediaIds = files.map(file => file.id)
		// eliminar elemento y referencias de archivos
		return await projectElementMediaServices.deleteElementWithMedia(mediaIds, elementId, projectId, componentId)

	} catch (error) {
		console.error(error)
		throw error
	}
}



// MEDIA ////////////////////////////////////////////////////////////////////////////////////////////////
/*  
 *	- Al eliminar un elemento no se eliminan sus archivos directamente, solo su relación.
 *	- La actualización de medios realmente es eliminación (si no está en uso por otro componente) e 
 *    inserción del nuevo archivo.
 */

const revertMedia = async (mediaIds, projectId, componentId) => {
	try {
		await projectElementMediaServices.revertMedia(mediaIds, projectId, componentId)
	} catch (error) {
		console.error(error)
		throw error
	}
}

// guardar metadatos de archivos cargados desde el cliente
// puede estar relacionado con un componente o no
const postMedia = async (req, res) => {
    try {
        // validacion
        if (!req.project) {
            res.status(400).json({ error: 'Se requiere id del proyecto' })
        }
        
        if (!req.files || req.files.length === 0) {
            res.status(400).json({ error: 'No se han enviado archivos' })
        }
        
        let data = []
        let pathsByField = {}

        req.files.forEach(file => {
            // obtener path
            const path = `${req.project}/${file.filename}`
            // añadir objeto con metadatos al array
            data.push({
                path,
                url: `https://api.altemap.com/media/${path}`,
                size: (file.size / 1024).toFixed(2), // bytes a kb
                content_type: file.mimetype
            })
            // relación campo-rutas
            pathsByField[file.fieldname] = pathsByField[file.fieldname] 
                ? [...pathsByField[file.fieldname], path] 
                : [path]
        })

        // guardar metadatos en la base de datos
        const results = await projectElementMediaServices.postMedia(data, req.project, req.query?.component)
        
        // a partir de la relación campo-rutas...
        // devolver id y url de archivos cargados, agrupados por campo
        const filesByField = {}
        Object.entries(pathsByField).forEach(([fieldName, paths]) => {
            filesByField[fieldName] = paths.map(path => {
                const media = results.find(media => media.path === path)
                return { 
                    id: media._id.toString(), 
                    url: media.url 
                }
            })
        })
            
        res.json(filesByField)

    } catch (error) {
        console.error("Error al insertar metadatos de medios", error)
        error.name === 'ValidationError'
            ? res.status(400).json({ error: error.message })
            : res.status(500)
    }
}


const deleteMediaFiles = async (req, res) => {
	// validacion
	if (!req.project) {
		res.status(400).json({ error: 'Se requiere id del proyecto' })
	}
	
	if (!req.body || !req.body.media) {
		res.status(400).json({ error: 'Se requiere lista de archivos a eliminar' })
	}
	
	const media = req.body.media
	if (!Array.isArray(media) || media.length === 0) {
		res.status(400).json({ error: 'La lista de archivos no puede estar vacía' })
	}
		
	// eliminar datos de archivos
	let transaction
	try {
		transaction = await projectElementMediaServices.deleteMedia(media.map(file => file._id, req.project))
	} catch (error) {
		console.error("Error al eliminar datos de archivos", error)
		res.status(500)
	}

	// eliminar archivos
	try {
		await fileSystemServices.deleteFiles(media.map(file => file.path))
		await transaction.commit() // confirmar transaccion
		res.status(200)
	} catch (error) {
		await transaction.abort() // rollback en caso de error
		console.error("Error al eliminar archivos multimedia", error)
		res.status(500)
	}
}


module.exports = {
	postElementWithMedia,
	putElementWithMedia,
	deleteElementWithMedia,
	revertMedia,
	postMedia,
	deleteMediaFiles
}

