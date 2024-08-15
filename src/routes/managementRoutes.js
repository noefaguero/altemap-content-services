const router = require('express').Router()
const { getOverview, getComponent, getProjectComponents, deleteElement} = require('../controllers/managementController')

router.get('/overview/:id', getOverview)
router.get('/project-components/:id', getProjectComponents)
router.get('/components/:id', getComponent)
router.delete('/elements/:id', deleteElement)

module.exports = router