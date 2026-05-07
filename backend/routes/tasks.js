const express = require('express')
const db = require('../database')
const checkAuth = require('../middleware/auth')

const router = express.Router()

// fetch all tasks
router.get('/', checkAuth, (req, res) => {
  const tasks = db.prepare(`
    SELECT tasks.*, users.name as assigned_to_name
    FROM tasks
    LEFT JOIN users ON tasks.assignee = users.id
  `).all()

  res.json(tasks)
})

// add a task
router.post('/', checkAuth, (req, res) => {
  const { title, notes, due, proj_id, assignee } = req.body

  if (!title) {
    return res.status(400).json({ msg: 'task needs a title' })
  }

  const result = db.prepare(`
    INSERT INTO tasks (title, notes, due, proj_id, assignee, made_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, notes || '', due || null, proj_id || null, assignee || null, req.user.id)

  res.json({ id: result.lastInsertRowid, title })
})

// update status
router.patch('/:id/status', checkAuth, (req, res) => {
  const { status } = req.body
  const valid = ['todo', 'in_progress', 'done']

  if (!valid.includes(status)) {
    return res.status(400).json({ msg: 'not a valid status' })
  }

  db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, req.params.id)
  res.json({ msg: 'status updated' })
})

// delete - admin only
router.delete('/:id', checkAuth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'no permission' })
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id)
  res.json({ msg: 'task removed' })
})

module.exports = router