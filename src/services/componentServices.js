const Component = require('../database/models/componentModel')

// primera carga (encabezado y primera pagina de elementos en dashboard)
exports.getComponent = async (id) => {
    return await Component.findById(id, '_id unique_element content_fields elements').lean()
}

exports.getComponentById = async (id) => {
    return await Component.findById(id).lean()
}