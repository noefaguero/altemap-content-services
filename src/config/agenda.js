// NOTA: Agenda funciona con el driver de MongoDB, no monogoose
const Agenda = require('agenda')
const { postElement, putElement, deleteElement } = require('../controllers/management/elementController')

const agenda = new Agenda({
    db: {
        address: process.env.STRING_CONTENTS_DB,
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
        // actualizar uri de archivos multimedia
        data.files = data.files.map(file => file.path = file.path.replace('temp/', ''))

        try {
            await postElement(project, component, data)
            console.log(`Nuevo elemento publicado en ${component} del proyecto ${project}`)
        } catch (error) {
            console.error(`Error al insertar un nuevo elemento en ${component} del proyecto ${project}: `, error)
            throw error
        }
    }
)

agenda.define(
    'put-element',
    async (job) => {
        const { project, element_id, data } = job.attrs.data
        // actualizar uri de archivos multimedia
        data.files = data.files.map(file => file.path = file.path.replace('temp/', ''))

        try {
            await putElement(project, element_id, data)
            console.log(`Elemento ${element_id} actualizado`)
        } catch (error) {
            console.error(`Error al actualizar el elemento ${element_id}: `, error)
            throw error
        }
    }
)

agenda.define(
    'delete-element',
    async (job) => {
        const { project, element } = job.attrs.data

        try {
            await deleteElement(project, element)
            console.log(`Elemento ${element} eliminado del proyecto ${project}`)
        } catch (error) {
            console.error(`Error al eliminar el elemento ${element} del proyecto ${project}: `, error)
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
