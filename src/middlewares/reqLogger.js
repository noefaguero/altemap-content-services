// Imprime la petición, solo en modo desarrollo
const reqLogger = () => {
    return (req, res, next) => {
        if (process.env.NODE_ENV !== 'development') {
            return next()
        }
        console.log(`REQUEST: ${req.method} ${req.protocol}://${req.get('Host')}${req.originalUrl}`)
        if (req.body) {
            console.log(`body: ${JSON.stringify(req.body)}`)
        }
        next()
    }
}

module.exports = reqLogger