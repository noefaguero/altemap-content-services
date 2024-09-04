const elementServices = require('../services/elementServices')
const projectServices = require('../services/projectServices')
const componentServices = require('../services/componentServices')
const pageServices = require('../services/pageServices')


const getOverview = async ({ params }, res) => {
  try {
    const metrics = await projectServices.getMetrics(params.id)
    res.json({ tool: "contents", ...metrics })
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener la vista general" })
  }
}

const getProjectComponents = async ({ params }, res) => {
  try {
    const projectComponents = await projectServices.getProjectComponents(params.id)
    res.json(projectComponents)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener los componentes del proyecto" })
  }
}

// encabezado de elementos en dashboard
const getComponent = async ({ params }, res) => {
  
  try {
    const componentElements = await componentServices.getComponent(params.id)
    res.json(componentElements)
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener los componentes" })
  }
}

const deleteElement = async ({ params }, res) => {
  
  try {
    const result = await elementServices.deleteElement(params.component_id, params.element_id)
    res.json(result)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al eliminar el elemento" })
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