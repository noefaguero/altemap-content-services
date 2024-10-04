const router = require('express').Router()
const { 
    getComponentElements, 
    getComponentElement, 
    getElement 
} = require('../controllers/delivery/elementController')


router.get('/component-elements/:id', getComponentElements) // elementos de un componente (paginados)
router.get('/component-element/:id', getComponentElement) // el elemento único de un componente

router.get('/element/:id', getElement)


module.exports = router