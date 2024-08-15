const router = require('express').Router()
const { getPageComponents, getComponentElements, getElement } = require('../controllers/deliveryController')

router.get('/page/:id', getPageComponents)
router.get('/component/:id', getComponentElements)
router.get('/element/:id', getElement)


module.exports = router