const { validateElement, getElementById } = require('../../services/elementServices')
const scheduleServices = require('../../services/scheduleServices')
const elementServices = require('../../services/elementServices')
const projectElementMediaController = require('./projectElementMediaController')
const { agenda } = require('../../config/agenda')

// GET
const getJobsByProject = async (project) => {
    try {
        const jobs = await scheduleServices.getJobsByProject(project)
        return jobs
    } catch (error) {
        throw error
    }
}

// POST
const postElementInQueue = async (req, res) => {
    const { body, params, query, project } = req

    const data = { 
        component_id: params.id,
        index: -1, // se inserta al final
        content: body,
    }

    try {
        // si no se ha pasado fecha se ejecuta ahora
        if (query?.date) {
            // validar objeto
            const validationErrors = await validateElement(data)
            if (validationErrors) {
                // eliminar archivos precargados si existen
                if (data?.media.length > 0) {
                    await projectElementMediaController.revertMedia(
                        data.media.map(file => file._id), 
                        project, 
                        data.component_id
                    )
                }
                return res.status(400).json({ 'error': validationErrors.errors }) // bad request
            }

            // programar en fecha
            const element = await agenda.schedule(
                query.date,
                'post-element',
                { 
                    data, 
                    project, 
                    component: params.id
                } // job.attrs.data
            )
            return res.json({
                message: 'Inserción del elemento programada correctamente',
                element: element
            })
        }
        // operacion directa
        const element = await projectElementMediaController.postElementWithMedia(data, project, data.component_id)
        res.status(201).json(element)

    } catch (error) {
        console.error('Error al programar elemento:', error)
        error.name === 'ValidationError'
			? res.status(400).json({ 'error': error.message })
			: res.status(500).json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."})
    }
}


// PUT
const putElementInQueue = async (req, res) => {
    const { body, params, query, project } = req
    const data = {
        content: body
    }
    // obtener elemento actual
    const oldElement = await elementServices.getElementById(params.id)
    const componentId = oldElement.component_id

    try {
        if (query?.date) {
            // copia por valor DEL CONTENIDO sobreescribiendo antiguos valores
            const updatedContent = { ...oldElement.content, ...data.content }
            // eliminar propiedad temporal "media" (objeto con array de nuevos archivos de cada campo)
            if (updatedContent?.media) {
                delete updatedContent.media
            }
            // actualizar propiedades del elemento
            const updatedElement = { ...oldElement, content: updatedContent }
            // validar elemento
            const validationErrors = await validateElement(updatedElement)
            if (validationErrors) {
                // eliminar archivos precargados si existen
                if (data?.media.length > 0) {
                    await projectElementMediaController.revertMedia(data.content.media, project, componentId)
                }
                return res.status(400).json({ 'error': validationErrors.errors }) // bad request
            }

            // programar
            const element = await agenda.schedule(
                query.date,
                'put-element',
                { 
                    data, 
                    element: params.id, 
                    project, 
                    component: componentId
                } // job.attrs.data
            )
            return res.json({ 
                message: 'Actualización del elemento programada correctamente',
                element
            })
        }

        // operacion directa
        const element = await projectElementMediaController.putElementWithMedia(data, params.id, componentId, project)
        res.json(element)

    } catch (error) {
        console.error('Error al actualizar elemento:', error)
        error.name === 'ValidationError'
			? res.status(400).json({ 'error': error.message })
			: res.status(500).json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."})
    }
}


// DELETE
const deleteElementInQueue = async (req, res) => {
    const { params, query, project } = req

    try {
        if (query?.date) {
            // programar
            const element = await agenda.schedule(
                query.date,
                'delete-element',
                { 
                    project, 
                    element: params.id 
                } // job.attrs.data
            )
            return res.json({ 
                message: 'Eliminación de elemento programada correctamente',
                element
            })
        }

        // operacion directa
        const element = await projectElementMediaController.deleteElementWithMedia(params.id, project)
        res.json(element)

    } catch (error) {
        console.error('Error al eliminar elemento:', error)
        res.status(500).json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."})
    }
}


module.exports = {
    getJobsByProject,
    postElementInQueue,
    putElementInQueue,
    deleteElementInQueue
}