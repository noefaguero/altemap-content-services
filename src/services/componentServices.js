const Component = require('../database/models/componentModel')
const { handleNotFound } = require('../utils/helpers')

exports.getComponentById = async (id) => {
    try {
		return handleNotFound(
			await Component.findById(id).lean(),
			"Componente no encontrado"
		)
    } catch (error) {
        throw error
    }
}

exports.getAllComponents = async () => {
    try {
		return await Component.find().lean()

    } catch (error) {
        throw error
    }
}

// añadir referencia al insertar un nuevo elemento
// se ejecuta en el middleware pre-save de elementModel
exports.addElementReference = async (id, component_id) => {
	try {
		return handleNotFound(
			await Component.findByIdAndUpdate(
				component_id,
				{
					$push: { elements: id },
					$inc: { elements_length: +1 }
				}
			),
			"Componente no encontrado"
		)
	} catch (error) {
		throw error
	}
}


// eliminar clave ajena de un elemento si se elimina
// se ejecuta en el middleware pre-remove de elementModel
exports.removeElementReference = async (id, component_id) => {
	try {
		return handleNotFound(
			await Component.findByIdAndUpdate(
				component_id,
				{
					$pull: { elements: id },
					$inc: { elements_length: -1 }
				}
			),
			"Componente no encontrado"
		)
	} catch (error) {
		throw error
	}
}