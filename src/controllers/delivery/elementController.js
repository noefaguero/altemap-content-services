const elementServices = require('../../services/elementServices')

// caso de uso: obtener elementos paginados a partir del id del componente
const getElements = async (id, query) => {
	const sortKey = query?.sort
		? query.sort.split('_')
		: ['index', 'asc']
	// campo de ordenación
	const sortField = sortKey[0]
	// sentido de ordenación (ascendente: 1, desendente: -1)
	const sortOrder = sortKey[1] === 'desc' ? -1 : 1

	// limite
	const limit = query?.limit ? parseInt(query.limit) : 30

	// obtener elementos del componente
	return elementServices.getElementsByComponent(id, sortField, sortOrder, query.filters, limit, query?.cursor)
}


// caso de uso: obtener elemento único a partir del id del componente
const getUniqueElement = async (id) => elementServices.getUniqueElementByComponent(id)


const getComponentElements = async ({ params, query }, res) => {
	try {
		// validacion
		const id = params.id
		if (!id) {
			res.status(400).json({ error: 'Se requiere id del componente' })
		}
		
		const elements = await getElements(id, query)
		res.json(elements)

	} catch (error) {
		console.error("Error al obtener elementos del componente: ", error)
		res.status(500)
	}
}

const getUniqueComponentElement = async ({ params }, res) => {
	try {
		// validacion
		const id = params.id
		if (!id) {
			res.status(400).json({ error: 'Se requiere id del elemento' })
		}
		
		const element = await getUniqueElement(id)
		res.json(element)

	} catch (error) {
		console.error("Error al obtener elemento del componente: ", error)
		res.status(500)
	}
}

const getElement = async ({ params }, res) => {
	try {
		// validacion
		const id = params.id
		if (!id) {
			res.status(400).json({ error: 'Se requiere id del elemento' })
		}
		
		const element = await elementServices.getElementById(id)
		res.json(element)

	} catch (error) {
		console.error(error)
		throw error
	}
}


module.exports = {
	getElements,
	getUniqueElement,
	getComponentElements,
	getUniqueComponentElement,
	getElement
}