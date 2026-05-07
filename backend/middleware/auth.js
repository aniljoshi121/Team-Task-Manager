const jwt = require('jsonwebtoken')

// this runs before protected routes to check the token
function checkAuth(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ msg: 'no token found' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ msg: 'token not valid' })
  }
}

module.exports = checkAuth