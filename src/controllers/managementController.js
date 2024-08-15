const elementServices = require('../services/elementServices')
const projectServices = require('../services/projectServices')
const componentServices = require('../services/componentServices')


const getOverview = async ({ params }, res) => {
  const metrics = await projectServices.getMetrics(params.id)
  res.json({ tool: "contents", ...metrics })
}

const getProjectComponents = async ({ params }, res) => {
  const projectComponents = await projectServices.getProjectComponents(params.id)
  res.json(projectComponents)
}

const getComponent = async ({ params }, res) => {
  const component = await componentServices.getComponentById(params.id)
  res.json(component)
}

const deleteElement = async ({params}, res) => {
  const response = await elementServices.deleteElement(params.id)
  res.json(response)
}

module.exports = {
  getOverview,
  getProjectComponents,
  getComponent,
  deleteElement
}