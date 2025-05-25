const router = require('express').Router()
const passLogger = require('../middlewares/passLogger')
const reqLogger = require('../middlewares/reqLogger')

router.use(reqLogger()) // dev mode

router.use('/delivery', require('./deliveryRoutes'))

// protegido por token en gateway
router.use(passLogger()) 
router.use('/management', require('./managementRoutes'))

module.exports = router
