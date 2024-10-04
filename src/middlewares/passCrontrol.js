const passControl = () => {
    return (req, res, next) => {
        req.user = req.get('X-User')
        req.permission = req.get('X-Permission')
        req.rol = req.get('X-Rol')
        req.project = req.get('X-Project')
        next()
    }
}

module.exports = passControl