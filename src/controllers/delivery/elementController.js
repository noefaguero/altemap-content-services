const elementServices = require('../../services/elementServices')


// elementos múltiples a partir del id del componente
const getComponentElements = async ({ params, query }, res) => {
  try {
    const data = await elementServices.getElementsByComponent(
        params.id,
        query?.order || 1,
        query?.limit || null,
        query?.fieldIndex || "index",
        query?.prevIndex || 0
      )
      
    res.json(data)
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener los elementos del componente" })
  }
}


// elemento único a partir del id del componente
const getComponentElement = async ({ params }, res) => {
  try {
    const data = await elementServices.getElementByComponent(params.id) // elemento único
    res.json(data)
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener los elementos del componente" })
  }
}


const getElement = async ({ params }, res) => {
  try {
    const element = await elementServices.getElementById(params.id)

    if (Object.keys(element).length === 0) {
      res.status(404).json({ error: 'Elemento no encontrado' })
      return
    }

    res.json(element)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener el elemento" })
  }
}


module.exports = {
  getComponentElements,
  getComponentElement,
  getElement
}