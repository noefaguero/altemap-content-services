const Project = require('../database/models/projectModel')

exports.getMetrics = async (id) => {
    return await Project.findById(id, 'metrics').lean()
}

exports.getProjectComponents = async (id) => {
    return await Project.findById(id, 'components').populate('components', '_id name').lean()
}