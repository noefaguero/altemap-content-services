const componentServices = require('../../services/componentServices')
const projectServices = require('../../services/projectServices')


const getProjectComponents = async ({ params }, res) => {
    try {
        const projectComponents = await projectServices.getProjectComponents(params.id)
        res.json(projectComponents)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al obtener los componentes del proyecto" })
    }
}

// encabezado de elementos en dashboard
const getComponent = async ({ params }, res) => {
    try {
        const componentElements = await componentServices.getComponent(
            params.id, '_id unique_element content_fields'
        )
        res.json(componentElements)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al obtener los componentes" })
    }
}


module.exports = {
    getProjectComponents,
    getComponent
}