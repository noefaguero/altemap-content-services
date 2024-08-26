const router = require('express').Router()
const { getComponentElements, getElement } = require('../controllers/deliveryController')

router.get('/component-elements/:id', getComponentElements) // elementos de un componente (paginados)
router.get('/element/:id', getElement)


module.exports = router