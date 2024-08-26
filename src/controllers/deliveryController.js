const elementServices = require('../services/elementServices')


const getComponentElements = async ({ params, query }, res) => {
  const elements = await elementServices.getElementsByComponent(
    params.id,
    query.order,
    query.limit,
    query.fieldIndex,
    query.prevIndex
  )
  res.json(elements)
}


const getElement = async ({ params }, res) => {
  try {
    const element = await elementServices.getElementById(params.id)

    if (!element) {
      return res.status(404).json({ error: 'Elemento no encontrado' })
    }

    res.json(element)

  } catch (error) {

    if (error.message === 'ID no válido') {
      return res.status(400).json({ error: error.message }) // bad request
    }
    
    console.log(error)
    res.status(500).json({ error: 'Error en el servidor' })
  }
}


module.exports = {
  getComponentElements,
  getElement
}