const express = require('express')
const db = require('../database')
const checkAuth = require('../middleware/auth')

const router = express.Router()

// get all projects
router.get('/', checkAuth, (req, res) => {
  const all = db.prepare('SELECT * FROM projects').all()
  res.json(all)
})

// create a project - only admin
router.post('/', checkAuth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'only admins can do this' })
  }

  const { title, desc } = req.body
  if (!title) return res.status(400).json({ msg: 'title is required' })

  const r = db.prepare(
    'INSERT INTO projects (title, desc, created_by) VALUES (?, ?, ?)'
  ).run(title, desc || '', req.user.id)

  res.json({ id: r.lastInsertRowid, title })
})

// delete project
router.delete('/:id', checkAuth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'admins only' })
  }

  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id)
  res.json({ msg: 'project deleted' })
})

module.exports = router