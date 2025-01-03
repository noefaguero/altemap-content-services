const express = require('express')
const router = express.Router()
const { validateGetElements } = require('../middlewares/validateQuery')
const { getUniqueComponentElement, getComponentElements, getElement } = require('../controllers/delivery/elementController')

// parsear a JSON
router.use(express.json())

// obtener elementos de un componente con un único elemento
router.get('/components/:id/element', getUniqueComponentElement)
// obtener elementos de un componente con múltiples elementos
router.get('/components/:id/elements', validateGetElements, getComponentElements)
// obterner un elemento por su id
router.get('/element/:id', getElement)


module.exports = router