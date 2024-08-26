const elementServices = require('../services/elementServices')
const projectServices = require('../services/projectServices')
const componentServices = require('../services/componentServices')
const pageServices = require('../services/pageServices')


const getOverview = async ({ params }, res) => {
  const metrics = await projectServices.getMetrics(params.id)
  res.json({ tool: "contents", ...metrics })
}

const getProjectComponents = async ({ params }, res) => {
  const projectComponents = await projectServices.getProjectComponents(params.id)
  res.json(projectComponents)
}

// primera carga (encabezado y primera pagina de elementos en dashboard)
const getComponent = async ({ params }, res) => {
  const componentElements = await componentServices.getComponent(params.id)

  res.json(componentElements)
}

const deleteElement = async ({ params }, res) => {
  
  try {
    const result = await elementServices.deleteElement(params.component_id, params.element_id)
    res.json(result)

  } catch (error) {
    if (error.message === "Elemento no encontrado") {
      res.status(404).json({ error: "Elemento no encontrado" })

    } else {
      console.log(error)
      res.status(500).json({ error: "Error al eliminar el elemento" })
    }
  }
}

const getPageComponents = async ({ params }, res) => {
  const components = await pageServices.getPageComponents(params.id)

  res.json(components)
}


module.exports = {
  getOverview,
  getProjectComponents,
  getComponent,
  deleteElement,
  getPageComponents
}