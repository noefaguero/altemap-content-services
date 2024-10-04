const router = require('express').Router()
const passControl = require('../middlewares/passCrontrol')


router.use('/delivery', require('./deliveryRoutes'))
router.use(passControl()) // protegido por token en gateway
router.use('/management', require('./managementRoutes'))


module.exports = router
