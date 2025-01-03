const router = require('express').Router()
const passLog = require('../middlewares/passLog')

router.use('/delivery', require('./deliveryRoutes'))
// protegido por token en gateway
router.use(passLog()) 
router.use('/management', require('./managementRoutes'))

module.exports = router
