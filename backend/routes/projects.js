const express = require('express')
const db = require('../database')
const checkAuth = require('../middleware/auth')

const router = express.Router()

// get all projects
router.get('/', checkAuth, (req, res) => {
  db.all('SELECT * FROM projects', [], (err, rows) => {
    res.json(rows || [])
  })
})

// create project - admin only
router.post('/', checkAuth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'only admins can do this' })
  }

  const { title, desc } = req.body
  if (!title) return res.status(400).json({ msg: 'title is required' })

  db.run(
    'INSERT INTO projects (title, desc, created_by) VALUES (?, ?, ?)',
    [title, desc || '', req.user.id],
    function(err) {
      if (err) return res.status(500).json({ msg: 'error creating project' })
      res.json({ id: this.lastID, title })
    }
  )
})

// delete project - admin only
router.delete('/:id', checkAuth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'admins only' })
  }

  db.run('DELETE FROM projects WHERE id = ?', [req.params.id], (err) => {
    res.json({ msg: 'project deleted' })
  })
})

module.exports = router