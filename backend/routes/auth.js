const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database')

const router = express.Router()

// signup
router.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'fill all fields' })
  }

  const hashed = bcrypt.hashSync(password, 10)
  const userRole = role === 'admin' ? 'admin' : 'member'

  try {
    const stmt = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    )
    const result = stmt.run(name, email, hashed, userRole)
    res.json({ success: true, id: result.lastInsertRowid })
  } catch (e) {
    // probably duplicate email
    res.status(400).json({ msg: 'email already used' })
  }
})

// login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)

  if (!user) {
    return res.status(400).json({ msg: 'user not found' })
  }

  const match = bcrypt.compareSync(password, user.password)
  if (!match) {
    return res.status(400).json({ msg: 'wrong password' })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    token,
    user: { id: user.id, name: user.name, role: user.role }
  })
})

module.exports = router