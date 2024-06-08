const Project = require('../database/models/projectModel')

// Solo al levantar el servidor
const getOrigins = () => {
    const tools = ['contents', 'forms', 'soon']
    const originsByTool = {}

    tools.forEach(async tool => {
        originsByTool[tool] = await getOriginsByTool(tool)
    })
    
    return originsByTool
}

const getOriginsByTool = async (tool) => {
    const query = {}
    query[`has_tools.${tool}`] = true
    const domain = await Project.find(query, 'domain').exec()
    return `${process.env.PROTOCOL}://${domain}`
}

module.exports = {
    getOrigins,
    getOriginsByTool
}