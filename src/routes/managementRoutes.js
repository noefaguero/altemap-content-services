const router = require('express').Router()
const { 
    getOverview, 
    getComponent, 
    getProjectComponents, 
    getPageComponents,
    deleteElement
} = require('../controllers/managementController')


router.get('/overview/:id', getOverview)
router.get('/project-components/:id', getProjectComponents)
router.get('/component/:id', getComponent)
router.get('/page/:id', getPageComponents)

router.delete('/element/:component_id/element_id', deleteElement)


module.exports = router