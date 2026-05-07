const express = require('express')
const db = require('../database')
const checkAuth = require('../middleware/auth')

const router = express.Router()

// get all tasks
router.get('/', checkAuth, (req, res) => {
  db.all(`
    SELECT tasks.*, users.name as assigned_to_name
    FROM tasks
    LEFT JOIN users ON tasks.assignee = users.id
  `, [], (err, rows) => {
    res.json(rows || [])
  })
})

// add a task
router.post('/', checkAuth, (req, res) => {
  const { title, notes, due, proj_id, assignee } = req.body

  if (!title) {
    return res.status(400).json({ msg: 'task needs a title' })
  }

  db.run(
    'INSERT INTO tasks (title, notes, due, proj_id, assignee, made_by) VALUES (?, ?, ?, ?, ?, ?)',
    [title, notes || '', due || null, proj_id || null, assignee || null, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ msg: 'error adding task' })
      res.json({ id: this.lastID, title })
    }
  )
})

// update status
router.patch('/:id/status', checkAuth, (req, res) => {
  const { status } = req.body
  const valid = ['todo', 'in_progress', 'done']

  if (!valid.includes(status)) {
    return res.status(400).json({ msg: 'not a valid status' })
  }

  db.run('UPDATE tasks SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
    res.json({ msg: 'status updated' })
  })
})

// delete task - admin only
router.delete('/:id', checkAuth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'no permission' })
  }

  db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], (err) => {
    res.json({ msg: 'task removed' })
  })
})

module.exports = router