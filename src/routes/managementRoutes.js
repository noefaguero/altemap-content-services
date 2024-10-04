const router = require('express').Router()
// midlewares
const { upload, handleUploadErrors } = require('../middlewares/upload')
const handleValidationErrors = require('../middlewares/validationErrors')
// controllers
const { getOverview } = require('../controllers/management/overviewController')
const { getComponent, getProjectComponents } = require('../controllers/management/componentController')
const { getElementsByComponent } = require('../controllers/management/elementController')
const {
    deleteElementInQueue,
    putElementInQueue,
    postElementInQueue
} = require('../controllers/management/scheduleController')


// GET
router.get('/overview', getOverview)
router.get('/project-components/:id', getProjectComponents)
router.get('/component/:id', getComponent)
router.get('/component-elements/:id', getElementsByComponent)

// POST
router.post('/element/:component_id', upload.any(), postElementInQueue)

// PUT
router.put('/element/:component_id/:element_id', upload.any(), putElementInQueue)

// DELETE
router.delete('/element/:component_id/:element_id', deleteElementInQueue)

// MIDDLEWARE DE MANEJO DE ERRORES DE CARGA DE ARCHIVOS
router.use(handleUploadErrors)

// MIDDLEWARE DE MANEJO DE ERRORES DE VALIDACIÓN
router.use(handleValidationErrors)


module.exports = router