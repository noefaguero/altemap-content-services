const { getElements, getUniqueElement } = require('../delivery/elementController')

const getUniqueComponentElement = async ({ params }, res) => {
	try {
		const element = await getUniqueElement(params.id)
		res.json(element)
	} catch (error) {
		res.status(500)
	}
}

const getComponentElements = async ({ params, query }, res) => {
	try {
		const elements = await getElements(params.id, query)
		res.json(elements)
	} catch (error) {
		res.status(500)
	}
}


module.exports = {
	getComponentElements,
	getUniqueComponentElement
}