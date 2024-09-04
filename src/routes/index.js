const router = require('express').Router()
const knowUserAndPermission = require('../middlewares/knowUserAndPermission')


router.use('/delivery', require('./deliveryRoutes'))

router.use(knowUserAndPermission()) // protegido por token en gateway
router.use('/management', require('./managementRoutes'))


module.exports = router
