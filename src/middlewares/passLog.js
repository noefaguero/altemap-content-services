const passLog = () => {
    return (req, res, next) => {
        req.user = req.headers['x-user']
        req.permission = req.headers['x-permission']
        req.rol = req.headers['x-rol']
        req.project = req.headers['x-project']
        next()
    }
}

module.exports = passLog