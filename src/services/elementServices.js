const Element = require('../database/models/elementModel')
const Component = require('../database/models/componentModel')
const { transaction, handleNotFound } = require('../utils')


exports.validateElement = async (data) => {
	try {
		console.log(data)
		const newElement = new Element(data)
		console.log(newElement)
		const validationErrors = await newElement.validate()
		return validationErrors

	} catch (error) {
		throw error
	}
}


// QUERIES ///////////////////////////////////////////////////////////////////////////

exports.getElementById = async (id) => {
	try {
		return handleNotFound(
			await Element.findById(id).lean(),
			'Elemento no encontrado'
		)
	} catch (error) {
		throw error // propagar error al controlador
	}
}


exports.getElementByComponent = async (id) => {
	try {
		return handleNotFound(
			await Element.findOne({ component_id: id }).lean(),
			'Componente no encontrado'
		)
	} catch (error) {
		throw error
	}
}

exports.getElementsByComponent = async (id, order, limit, fieldIndex, prevIndex) => {
	try {
		if (limit) {
			return handleNotFound(
				await Element.find({ component_id: id, [fieldIndex]: { $gte: prevIndex } })
					.sort({ [fieldIndex]: order })
					.limit(limit)
					.lean(),
				'Componente no encontrado'
			)
		}

		return handleNotFound(
			await Element.find({ component_id: id, [fieldIndex]: { $gte: prevIndex } })
				.sort({ [fieldIndex]: order })
				.lean()
		)

	} catch (error) {
		throw error
	}
}


// MUTATIONS ////////////////////////////////////////////////////////////////////////

// POST
exports.postElement = async (component_id, data) => {
	let element
	// crear el elemento
	const createElement = async () => {
		try {
			const newElement = new Element(data)
			await newElement.save()
			element = newElement
		} catch (error) {
			throw error
		}
	}

	// añadir referencia en el documento del componente
	const addElementReference = async () => {
		if (!element._id) {
			const error = new Error('No se ha proporcionado un ID de elemento')
			error.status = 400
			throw error
		}

		try {
			return await Component.findByIdAndUpdate(
				component_id,
				{
					$push: { elements: element._id },
					$inc: { elements_length: +1 }
				}
			).lean()

		} catch (error) {
			throw error
		}
	}

	// ejecutar transacción
	return await transaction([createElement, addElementReference]) // devuelve el elemento creado
}


// PUT
exports.putElement = async (element_id, data) => {
	try {
		return await Element.findByIdAndUpdate(element_id, data, { new: true }).lean()
	} catch (error) {
		throw error
	}
}


// DELETE
exports.deleteElement = async (component_id, element_id) => {
	console.log('component_id: ', component_id)
	console.log('element_id: ', element_id)
	let filepath = []
	// Eliminar clave ajena en el documento del componente
	const removeElementReferences = async () => {
		try {
			await Component.findByIdAndUpdate(
				component_id,
				{
					$pull: { elements: id },
					$inc: { elements_length: -1 }
				}
			).lean()
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
	return await transaction([removeElementReferences, removeElement]) // devuelve boleano
}
