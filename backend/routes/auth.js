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

  db.run(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashed, userRole],
    function(err) {
      if (err) {
        // probably duplicate email
        return res.status(400).json({ msg: 'email already used' })
      }
      res.json({ success: true, id: this.lastID })
    }
  )
})

// login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
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
})

module.exports = router