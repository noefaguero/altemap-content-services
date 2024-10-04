const { agenda } = require('../config/agenda')

exports.getJobsByProject = async (projectId) => {
    try {
        const collection = agenda._mdb.collection('schedule')
        const now = new Date()
        return await collection.find({
            'data.project': projectId,
            nextRunAt: { $gte: now }
        })
        .toArray()
    } catch (error) {
        throw error
    }
}