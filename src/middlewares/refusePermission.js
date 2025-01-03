const refusePermission = (invalidPermission) => {
    return (req, res, next) => {
        if (req.permission.contents === invalidPermission) {
            res.status(403).json({ error: "Acción restringida, requiere permisos." })
        }
        next()
    }
}

module.exports = refusePermission