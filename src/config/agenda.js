// NOTA: Agenda funciona con el driver de MongoDB, no monogoose
const Agenda = require('agenda')
const { postElementWithMedia, putElementWithMedia, deleteElementWithMedia } = require('../controllers/management/projectElementMediaController')

const agenda = new Agenda({
    db: {
        address: process.env.CONTENTS_DB,
        collection: 'schedule'
    },
    processEvery: 'one minute', // frecuencia de revisión de nuevos trabajos
    concurrency: 5, // trabajos en paralelo como máximo
    defaultLockLifetime: 60000 // si en 1 minuto el trabajo no ha finalizado, se cierra
})


// TRABAJOS ////////////////////////////////////////////////////////////////////////////////////////////////

agenda.define(
    'post-element',
    async (job) => {
        const { project, component, data } = job.attrs.data

        try {
            await postElementWithMedia(data, project, component)
            // TO-DO: notificar éxito de la operacion
            console.log(`Nuevo elemento publicado en el componente ${component}`)
        } catch (error) {
            // TO-DO: notificar fallo de la operacion
            console.error(`Error al insertar un nuevo elemento en el componente ${component}: `, error)
            throw error
        }
    }
)

agenda.define(
    'put-element',
    async (job) => {
        const { project, element, data, component } = job.attrs.data

        try {
            await putElementWithMedia(data, element, project)
            // TO-DO: notificar éxito de la operacion
            console.log(`Elemento ${element} actualizado`)
        } catch (error) {
            // TO-DO: notificar fallo de la operacion
            console.error(`Error al actualizar el elemento ${element}: `, error)
            throw error
        }
    }
)

agenda.define(
    'delete-element',
    async (job) => {
        const { component, project, element } = job.attrs.data

        try {
            await deleteElementWithMedia(element, project, component)
            // TO-DO: notificar éxito de la operacion
            console.log(`Elemento ${element} eliminado`)
        } catch (error) {
            // TO-DO: notificar fallo de la operacion
            console.error(`Error al eliminar el elemento ${element}: `, error)
            throw error
        }
    }
)

const startAgenda = async () => {
    try {
        await agenda.start()

        // Crear indice id_component
        // como usa el driver de mongoDB por detrás, la conexión se realiza a partir de agenda._mdb
        const collection = agenda._mdb.collection('schedule')
        await collection.createIndex(
            { 'data.project': 1 } // 1: orden ascendente
        )

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    agenda,
    startAgenda
}
