const { validateElement } = require('../../services/elementServices')
const scheduleServices = require('../../services/scheduleServices')
const elementController = require('./elementController')
const mediaController = require('./mediaController')
const { agenda } = require('../../config/agenda')


const execNow = (date) => {
    const diff = date - (Date.now() / 1000)
    return diff <= 60 // si es menos de un min => true, el cambio se hará instantaneo
}

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
/* req.files.push({
            field_name: file.fieldname,
            path: file.destination,
            size: file.size,
            content_type: file.mimetype
        }) */
    let data = {}
    console.log(req?.files)
    return
    if (req?.files) {
        data.media = req.files.map(file => {
            // actualizar campo con la URL
            body[file.fieldname] = `${process.env.CONTENT_URL}${file.destination}`
            // devolver metadatos
            return {
                field_name: file.fieldname,
                path: file.destination,
                size: file.size,
                content_type: file.mimetype
            }
        })
    }

    data = { 
        component_id: params.component_id,
        index: 1, // se inserta al principio
        content: body,
        ...data
    }

    try {
        if (!execNow(query.date)) {
            // validar objeto
            const validationErrors = validateElement(data)
            if (validationErrors && req?.media) {
                // eliminar archivos cargados
                await mediaController.deleteDeliveryFiles(project, body.media.map(file => file.path))
            }

            if (validationErrors) {
                res.status(400).json({ error: validationErrors.errors }) // bad request
                return
            }

            // programar en fecha
            await agenda.schedule(
                query.date,
                'post-element',
                { data, project, component: params.component_id } // job.attrs.data
            )
            res.status(200).json({ message: 'Inserción del elemento programado correctamente' })
            return
        }
        // operacion directa
        await elementController.postElement(project, params.component_id, data)
        res.status(200).json({ message: 'Elemento publicado correctamente' })

    } catch (error) {
        console.log(error)
        res.status(500)
    }
}


// PUT
const putElementInQueue = async (req, res) => {
    const { body, params, query, files, project } = req
    const data = {
        component_id: params.component_id,
        content: body,
        media: files
    }

    try {

        if (!execNow(query.date)) {
            // obtener elemento actual
            const element = Element.findById(params.element_id)
            // copia por valor sobreescribiendo las propiedades
            const updatedElement = { ...element, ...data }
            // validar elemento
            const validationErrors = await validateElement(updatedElement)
            if (validationErrors) {
                res.status(400).json({ error: validationErrors.errors }) // bad request
                return
            }
            // programar
            await agenda.schedule(
                query.date,
                'put-element',
                { data, project, element: params.element_id } // job.attrs.data
            )
            res.status(200).json({ message: 'Actualización de elemento programada correctamente' })
            return
        }

        // operacion directa
        await elementController.putElement(project, params.element_id, data)
        res.status(200).json({ message: 'Elemento actualizado correctamente' })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}


// DELETE
const deleteElementInQueue = async (req, res) => {
    const { params, query, project } = req
    console.log(execNow(query.date))
    try {
        if (!execNow(query.date)) {
            console.log(1)
            // programar
            await agenda.schedule(
                query.date,
                'delete-element',
                { project, element: params.element_id } // job.attrs.data
            )
            res.status(200).json({ message: 'Eliminación de elemento programado correctamente' })
            return
        }

        // operacion directa
        console.log(2)
        await elementController.deleteElement(project, params.element_id)
        res.status(200).json({ message: 'Elemento eliminado correctamente' })

    } catch (error) {
        console.log(error)
        res.status(500)
    }
}


module.exports = {
    getJobsByProject,
    postElementInQueue,
    putElementInQueue,
    deleteElementInQueue
}