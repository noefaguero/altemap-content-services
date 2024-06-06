const router = require('express').Router()
const { knowUserAndPermission } = require('../middlewares')

router.use('/content-services/delivery', require('./deliveryRoutes'))

router.use(knowUserAndPermission())
router.use('/content-services/management', require('./managementRoutes'))

module.exports = router
