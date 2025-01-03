const express = require('express')
const router = express.Router()
// midlewares
const refusePermission = require('../middlewares/refusePermission')
const upload = require('../middlewares/upload')
const { validateGetElements } = require('../middlewares/validateQuery')
const handleValidationErrors = require('../middlewares/validateErrors')
// controllers
const { getOverview } = require('../controllers/management/overviewController')
const { getComponent, getProjectComponents } = require('../controllers/management/componentController')
const { getComponentElements, getUniqueComponentElement } = require('../controllers/management/elementController')
const { deleteElementInQueue, putElementInQueue, postElementInQueue } = require('../controllers/management/scheduleController')
const { postMedia, deleteMediaFiles } = require('../controllers/management/projectElementMediaController')

// NOTA: El cuerpo de la petición puede ser JSON o form-data

// UPLOADS ///////////////////////////////////////////////////////////////
router.post(
    '/uploads', 
    refusePermission('contents', 'read'), // permiso insuficiente
    upload.any(),
    postMedia
)

// parsear a JSON
router.use(express.json())

router.delete(
    '/uploads', 
    refusePermission('contents', 'read'),
    deleteMediaFiles
)

// QUERIES ///////////////////////////////////////////////////////////////
router.get('/overview', getOverview)
router.get('/projects/:id/components', getProjectComponents)
router.get('/components/:id', getComponent)
router.get('/components/:id/elements', validateGetElements, getComponentElements)
router.get('/components/:id/element', getUniqueComponentElement)


// MUTATIONS //////////////////////////////////////////////////////////////
refusePermission("read") // permiso insuficiente
router.post('/media', postMedia)
router.post('/components/:id/element', postElementInQueue)
router.put('/elements/:id', putElementInQueue)
router.delete('/elements/:id', deleteElementInQueue)

// ERROR CATCHER //////////////////////////////////////////////////////////
router.use(handleValidationErrors)


module.exports = router