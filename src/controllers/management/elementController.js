const { getElements, getUniqueElement } = require('../delivery/elementController')

const getUniqueComponentElement = async ({ params }, res) => {
	try {
		// validacion
		const id = params.id
		if (!id) {
			return res.status(400).json({ 'error': 'Se requiere id del elemento' })
		}
		
		const element = await getUniqueElement(id)
		res.json(element)
	} catch (error) {
		console.error('Error al obtener elemento único:', error)
		res.status(500).json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."})
	}
}

const getComponentElements = async ({ params, query }, res) => {
	try {
		// validacion
		const id = params.id
		if (!id) {
			return res.status(400).json({ 'error': 'Se requiere id del componente' })
		}
		
		const elements = await getElements(id, query)
		res.json(elements)
	} catch (error) {
		res.status(500).json({ error: "Ha ocurrido un error inesperado. Inténtalo de nuevo más tarde."})
	}
}


module.exports = {
	getComponentElements,
	getUniqueComponentElement
}