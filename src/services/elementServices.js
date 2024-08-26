const Element = require('../database/models/elementModel')
const Component = require('../database/models/componentModel')
const { transaction } = require('../utils')
const { Types } = require('mongoose')


exports.getElementById = async (id) => {

  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID no válido')
  } else {
    try {
      return await Element.findById(id).lean()
    } catch (error) {
      throw error // propagar error al controlador
    }
  }
}

exports.getElementsByComponent = async (id, order = 1, limit = null, fieldIndex = 'index', prevIndex = 0) => {
  return await Element.find({ component_id: id, [fieldIndex]: { $gte: prevIndex } })
    .sort({ [fieldIndex]: order })
    .limit(limit)
    .lean()
}

exports.createElement = async (data) => {
  return await Element.create(data)
}


exports.updateElement = async (id) => {
  return await Element.findByIdAndUpdate(id).lean()
}

// ELIMINAR ELEMENTO
exports.transaction = async (operations) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    for (const operation of operations) {
      await operation()
    }
    await session.commitTransaction()
    return true

  } catch (error) {
    await session.abortTransaction() //rollback
    return error

  } finally {
    session.endSession()
  }
}


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
  const removeFK = async () => {
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
  return await transaction([/* findComponent,  */removeFK, removeElement]) // devuelve boleano
}
