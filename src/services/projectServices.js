const Project = require('../database/models/projectModel')


exports.getMetrics = async (id) => {
    try {
        return await Project.findById(id, 'metrics').lean()
    } catch (error) {
        throw error
    }
}

exports.getProjectComponents = async (id) => {
    try {
        const result =  await Project.findById(id, 'components').populate('components', '_id name').lean()
        return result.components
    } catch (error) {
        throw error
    }
}