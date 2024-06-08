const userServices = require('../services/userServices')
const { getAccreditationsByUser } = require('../services/managementServices')
const { createToken } = require('../utils')

//LOGIN
login = async (req, res) => {
  const { email, password, keep } = req.body

  // comprobar credenciales
  const user = await userServices.login(email, password)
  if (!user) {
    res.json({ error: 'Revisa usuario y contraseña' })
    return
  }

    // obtener proyectos asociados al usuario
  const accreditations = await getAccreditationsByUser(user._id)
  if (!accreditations) {
    res.json({ error: 'No tienes proyectos activos' })
    return
  }
  console.log(accreditations)
  console.log(user)

  // crear token de sesion
  const token = createToken({ user_id: user._id, role: user.role })
  
  res.json({ 
    user: user, 
    accreditations: accreditations, 
    keep: keep, 
    token: token
  })
}

module.exports = login