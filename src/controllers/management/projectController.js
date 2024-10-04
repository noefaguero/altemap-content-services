const projectServices = require('../../services/projectServices')

exports.getMetrics = async (project) => {
    try {
        const metrics = await projectServices.getMetrics(project)
        return metrics
    } catch (error) {
        console.log(error)
        throw error
    }
}
