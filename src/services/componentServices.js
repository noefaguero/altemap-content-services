const Component = require('../database/models/componentModel')

exports.getComponentById = async (id) => {
    return await Component.findById(id, '_id unique_element content_fields elements').populate('elements').lean()
}