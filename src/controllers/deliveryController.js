const elementServices = require('../services/elementServices')


const getComponentElements = async ({ params, query }, res) => {
  try {
    const data = query?.unique === "true" // campo obligatorio si es un único elemento
      ? await elementServices.getElementByComponent(params.id) // elemento único
      : await elementServices.getElementsByComponent(
        params.id,
        query?.order || 1,
        query?.limit || null,
        query?.fieldIndex || "index",
        query?.prevIndex || 0
      )
      
    res.json(data)
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener los elementos del componente" })
  }
}


const getElement = async ({ params }, res) => {
  try {
    const element = await elementServices.getElementById(params.id)

    if (Object.keys(element).length === 0) {
      return res.status(404).json({ error: 'Elemento no encontrado' })
    }

    res.json(element)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener el elemento" })
  }
}


module.exports = {
  getComponentElements,
  getElement
}