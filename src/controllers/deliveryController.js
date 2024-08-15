const pageServices = require('../services/pageServices')
const componentServices = require('../services/componentServices')
const elementServices = require('../services/elementServices')


const getPageComponents = async ({ params }, res) => {
  const components = await pageServices.getPageComponents(params.id)
  res.json(components)
}

const getComponentElements = async ({ params }, res) => {
  const componentElements = await componentServices.getComponentElements(params.id)
  componentElements.elements.sort((a, b) => a.index - b.index)

  res.json(componentElements)

}

const getElement = async ({ params }, res) => {
  const element = await elementServices.getElementById(params.id)
  res.json(element)
}


module.exports = {
  getPageComponents,
  getComponentElements,
  getElement
}