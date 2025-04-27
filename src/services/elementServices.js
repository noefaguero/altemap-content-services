const Element = require('../database/models/elementModel')
const { handleNotFound } = require('../utils/helpers')


exports.validateElement = async (data) => {
	try {
		console.log(data)
		const newElement = new Element(data)
		console.log(newElement)
		return await newElement.validate()

	} catch (error) {
		throw error
	}
}


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


exports.getUniqueElementByComponent = async (id) => {
	try {
		return handleNotFound(
			await Element.findOne({ component_id: id }).lean(),
			'Componente no encontrado'
		)
	} catch (error) {
		throw error
	}
}


exports.getElementsByComponent = async (id, sortField = 'index', sortOrder = 1, filters = {}, limit = 30, cursor = '') => {
	try {
		const query = { component_id: id }

		// filtros
        if (Object.keys(filters).length) {
            for (const [key, value] of Object.entries(filters)) {
                query[`content.${key}`] = { $in: value }
            }
        }

		// ordenación por indice o campo de contenido y cursor
		const sort = {}
		const operator = sortOrder === 1 ? '$gt' : '$lt'

		if (sortField === 'index') {
			// orden por indice
			sort.index = sortOrder
			// cursor simple (index por defecto)
			if (cursor) {
				query.index = { [operator]: cursor }
			}
		} else {
			// orden por campo de contenido
			sort[`content.${sortField}`] = sortOrder
			// indice como segundo orden para desempate
			sort.index = 1
			// cursor compuesto
			if (cursor.split('#').length === 2) {
				const cursors = cursor.split('#')
				query[`content.${sortField}`] = { [operator]: cursors[0] }
				query.index = { $gt: cursors[1] }
			}
		}

		// NOTA: si se ordena por campo String, collation asegura orden alfabético (insensible a diacríticos españoles y mayusculas)
		const results = await Element.find(query)
			.collation({ locale: 'es', strength: 1 }) 
			.sort(sort)
			.limit(limit)
			.lean()
		
		// información de paginación
		const pageSize = results.length
		const hasNextPage = pageSize === limit
		let lastElement, nextCursor
		if (hasNextPage) {
			lastElement = results[pageSize - 1]
			nextCursor = sortField === 'index'
				? lastElement.index // cursor simple
				: `${lastElement.index}#${lastElement.content[sortField]}` // cursor compuesto
		}
		
		return {
			page_size: pageSize,
			has_next_page: hasNextPage,
			next_cursor: nextCursor,
			results
		}

	} catch (error) {
		throw error
	}
}


exports.postElement = async (data) => {
	try {
		const newElement = new Element(data)
		return await newElement.save()
	} catch (error) {
		throw error
	}
}


exports.putElement = async (elementId, elementData) => {
	try {
		return handleNotFound(
			await Element.findByIdAndUpdate(elementId, elementData, { new: true }),
			"Elemento no encontrado"
		)
	} catch (error) {
		throw error
	}
}


exports.deleteElement = async (elementId) => {
	try {
		return handleNotFound(
			await Element.findByIdAndDelete(elementId),
			"Elemento no encontrado"
		)
	} catch (error) {
		throw error
	}
}