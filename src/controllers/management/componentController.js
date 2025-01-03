const componentServices = require('../../services/componentServices')
const projectServices = require('../../services/projectServices')


const getProjectComponents = async (req, res) => {
    try {
        const projectComponents = await projectServices.getProjectComponents(req.params.id)
        res.json(projectComponents)

    } catch (error) {
        console.error("Error al obtener componentes del proyecto", error)
        res.status(500)
    }
}

// encabezado de elementos en dashboard
const getComponent = async ({ params }, res) => {
    try {
        const componentElements = await componentServices.getComponentById(params.id)
        res.json(componentElements)

    } catch (error) {
        console.error("Error al obtener un componente", error)
        res.status(500)
    }
}

// obtener la lista de campos permitidos de cada componente
const getAllComponents = async () => {
    try {
        return await componentServices.getAllComponents()
    } catch (error) {
        console.error("Error al obtener lista blanca de campos de cada componente", error)
    }
}


module.exports = {
    getProjectComponents,
    getComponent,
    getAllComponents
}