const Element = require('../database/models/elementModel')
const Component = require('../database/models/componentModel')
const { transaction } = require('../utils')


exports.getElementById = async (id) => {
  try {
    return await Element.findById(id).lean()
  } catch (error) {
    throw error // propagar error al controlador
  }
}

exports.getElementByComponent = async (id) => {
  try {
      return await Element.findOne({ component_id: id }).lean()
  } catch (error) {
    throw error
  }
}

exports.getElementsByComponent = async (id, order, limit, fieldIndex, prevIndex) => {
  try {
    if (limit) {
      return await Element.find({ component_id: id, [fieldIndex]: { $gte: prevIndex } })
      .sort({ [fieldIndex]: order })
      .limit(limit)
      .lean()
    } 
    
    return await Element.find({ component_id: id, [fieldIndex]: { $gte: prevIndex } })
      .sort({ [fieldIndex]: order })
      .lean()

  } catch (error) {
    throw error
  }
}


exports.createElement = async (data) => {
  try{
    return await Element.create(data)
  } catch (error) {
    throw error
  }
}


exports.updateElement = async (id) => {
  try{
    return await Element.findByIdAndUpdate(id).lean()
  } catch (error) {
    throw error
  }
}

// ELIMINAR ELEMENTO

exports.deleteElement = async (component_id, element_id) => {

  /* // Guardar identificador del componente al que pertenece el elemento
  let component
  const findComponent = async () => {

    try {
      const response = await Element.findById(id, 'component_id')
      if (!response) { // Si el documento no existe
        throw new Error("Elemento no encontrado")
      }
      component = response.component_id

    } catch (error) {
      throw error // propagar error
    }
  } */

  // Eliminar clave ajena en el documento del componente
  const removeElementReferences = async () => {
    try {
      await Component.findByIdAndUpdate(
        component_id,
        { $pull: { elements: id } },
        { $inc: { elements_length: -1 } }
      )
    } catch (error) {
      throw error
    }
  }

  // Eliminar el elemento
  const removeElement = async () => {
    try {
      await Element.findByIdAndDelete(element_id).lean()
    } catch (error) {
      throw error
    }
  }

  // Ejecutar transacción
  return await transaction([/* findComponent,  */removeElementReferences, removeElement]) // devuelve boleano
}
