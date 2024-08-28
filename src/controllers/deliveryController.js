const elementServices = require('../services/elementServices')


const getComponentElements = async ({ params, query }, res) => {
  
  const data = Boolean(query.unique)
    ? await elementServices.getElementByComponent(params.id)
    : await elementServices.getElementsByComponent(
      params.id,
      query?.unique || true,
      query?.order || 1,
      query?.limit || null,
      query?.fieldIndex || "index",
      query?.prevIndex || 0
    )

  res.json(data)
}


const getElement = async ({ params }, res) => {
  try {
    const element = await elementServices.getElementById(params.id)

    if (!element) {
      return res.status(404).json({ error: 'Elemento no encontrado' })
    }

    res.json(element)

  } catch (error) {  
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor' })
  }
}


module.exports = {
  getComponentElements,
  getElement
}