const elementServices = require('../../services/elementServices')
const componentServices = require('../../services/componentServices')
const { getComponentElement, getComponentElements } = require('../delivery/elementController')
const mediaController = require('./mediaController')

// elementos a partir del id del componente
const getElementsByComponent = async (req, res) => {
	try {
		const { unique_element } = await componentServices.getComponent(req.params.id, 'unique_element')
		// respuesta desde deliveryController
		unique_element
			? await getComponentElement(req, res)
			: await getComponentElements(req, res)

	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Error al obtener los elementos del componente" })
	}
}


const postElement = async (project, component_id, data) => {
	try {
		const newElement = await elementServices.postElement(component_id, data)
		return newElement

	} catch (error) {
		console.error(error)
		throw error
	}
}

const putElement = async (project, element_id, data) => {
	try {

		const updatedElement = await elementServices.putElement(element_id, data)
		if (files.length > 0) { // filepond solo envia los archivos modificados
			// mover archivos a la carpeta delivery
			await mediaController.moveFilesToDelivery(project, data.files)
			// eliminar archivo previo
			await mediaController.deleteFilesFromDelivery(project, mediaPath)
		}
		return updatedElement

	} catch (error) {
		console.error(error)
		throw error
	}
}


const deleteElement = async (project, element_id) => {
	try {
		const elementData = await elementServices.getElementById(element_id)
		console.log(elementData)
		const mediaPath = elementData.media.map(media => media.path)

		// Eliminar elemento
		await elementServices.deleteElement(elementData.component_id, element_id)
		// Eliminar archivos de delivery
		await mediaController.deleteFilesFromDelivery(project, mediaPath)

	} catch (error) {
		console.error(error)
		throw error
	}
}


module.exports = {
	getElementsByComponent,
	postElement,
	putElement,
	deleteElement
}