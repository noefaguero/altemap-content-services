const mongoose = require('mongoose')

const handleValidationErrors = (err, req, res, next) => {
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = {}
        err.errors.map(field => errors[field] = err.errors[field].message)
        return res.status(400).json({ errors })
    }
    next()
}

module.exports = handleValidationErrors

