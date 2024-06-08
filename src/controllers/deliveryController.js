const accreditationServices = require('../services/managementServices')

exports.getComponentById = async ({ params }, res) => {
  const acc = await .getComponentById(params.id)
  const dataToken = {
    user_id: user,
    role: req.get('X-Role'),
    project_id: project,
    head: acc.head,
    tools: acc.tools,
}

exports.getComponentById = async ({ params }, res) => {
  const acc = await .getComponentById(params.id)
  const dataToken = {
    user_id: user,
    role: req.get('X-Role'),
    project_id: project,
    head: acc.head,
    tools: acc.tools,
}