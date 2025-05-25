const componentServices = require('../../services/componentServices')
const projectServices = require('../../services/projectServices')


const getProjectComponents = async (req, res) => {
    try {
        // validacion
        const id = req.params.id
        if (!id) return res.status(400).json({ error: 'Se requiere id del proyecto' })

        const projectComponents = await projectServices.getProjectComponents(id)
        res.json(projectComponents)

    } catch (error) {
        console.error("Error al obtener componentes del proyecto", error)
        res.status(500).json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."})
    }
}

// encabezado de elementos en dashboard
const getComponent = async ({ params }, res) => {
    try {
        // validacion
        const id = params.id
        if (!id) return res.status(400).json({ error: 'Se requiere id del componente' })

        const componentElements = await componentServices.getComponentById(id)
        res.json(componentElements)

    } catch (error) {
        console.error("Error al obtener un componente", error)
        res.status(500).json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."})
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