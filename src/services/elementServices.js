const Element = require('../database/models/elementModel')
const Component = require('../database/models/componentModel')
const { transaction } = require('../utils')


exports.getElementById = async (id) => {
    return await Element.findById(id).lean()
}


exports.createElement = async (data) => {
    return await Element.create(data)
}


exports.updateElement = async (id) => {
    return await Element.findByIdAndUpdate(id).lean()
}


exports.deleteElement = async (id) => {
  
  // 1. Guardar identificador del componente al que pertenece el elemento
  let component
  const findComponent = async () => {
    const { component_id } = await Element.findById(id, 'component_id')
    component = component_id
  }

  // 2. Eliminar clave ajena en el documento del componente
  const removeFK = async () => {
    await Component.findByIdAndUpdate(
      component,
      { $pull: { elements: id } }
    )
  }

  // 3. Eliminar el elemento
  const removeElement = async () => {
    await Element.findByIdAndDelete(id).lean()
  }

  // Ejecutar transacción
  return await transaction([findComponent, removeFK, removeElement]) // devuelve boleano
}
