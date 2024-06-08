const Accreditation = require('../database/models/accreditationModel')

const getComponentById = async (id) => {
    const docs = await Component.find({ _id: id }, '_id head project_name project_id').lean()
    return docs.map(doc => {
        doc._id = doc._id.toHexString()
        doc.project_id = doc.project_id.toHexString()
        return doc
    })
}

const getAccreditation = async (projectId, userId) => {
    // obtener una acreditacion para crear token de permisos
    return await Accreditation.findOne({ project_id: projectId, user_id: userId }, 'head tools').lean()
}

const createAccreditation = async (accreditation) => {
    return await Accreditation.create({ accreditation })
}

module.exports = {
    getComponentById,
    getAccreditation,
    createAccreditation
}