exports.knowUserAndPermission = () => {
  return (req, res, next) => {
    req.user = req.headers['X-User']
    req.permission = req.headers['X-Permission']
    next()
  }
}