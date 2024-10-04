const projectController = require('./projectController')
const scheduleController = require('./scheduleController')

const getOverview = async ({ project }, res) => {
    try {
        const { metrics } = await projectController.getMetrics(project)
        const jobs = await scheduleController.getJobsByProject(project)
        
        if (!metrics || !jobs) {
            res.status(404)
            return
        }
        // agrupar los trabajos por fecha
        const jobsByDate = jobs.reduce((acu, job) => {
            const key = job.nextRunAt
            if (!acu[key]) {
                acu[key] = []
            }
            acu[key].push(job)
            return acu
        }, {})


        res.json({
            tool: "contents",
            data: {
                metrics,
                jobs: jobsByDate // agrupados por fecha
            }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error al obtener la vista general" })
    }
}


module.exports = {
    getOverview
}