const Component = require('../database/models/componentModel')


exports.getComponent = async (id, fields = null) => {
    try {
        return await Component.findById(id, fields).lean()
    } catch (error) {
        throw error
    }
}

exports.getComponentById = async (id) => {
    try {
        return await Component.findById(id).lean()
    } catch (error) {
        throw error
    }
}