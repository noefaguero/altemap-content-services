const passLogger = () => {
    return (req, res, next) => {
        req.user = req.headers['x-user']
        req.permission = req.headers['x-permission']
        req.role = req.headers['x-role']
        req.project = req.headers['x-project']
        next()
    }
}

module.exports = passLogger