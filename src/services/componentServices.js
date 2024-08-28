const Component = require('../database/models/componentModel')


exports.getComponent = async (id) => {
    try {
        return await Component.findById(id, '_id unique_element content_fields elements').lean()
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