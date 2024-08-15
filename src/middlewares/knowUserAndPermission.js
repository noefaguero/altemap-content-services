const knowUserAndPermission = () => {
    return (req, res, next) => {
        req.user = req.get('X-User')
        req.permission = req.get('X-Permission')
        next()
    }
}

module.exports = knowUserAndPermission