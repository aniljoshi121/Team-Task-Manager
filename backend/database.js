const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) console.error('db error', err)
  else console.log('connected to sqlite')
})

// create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'member'
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    desc TEXT,
    created_by INTEGER
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'todo',
    due TEXT,
    proj_id INTEGER,
    assignee INTEGER,
    made_by INTEGER
  )`)
})

module.exports = db