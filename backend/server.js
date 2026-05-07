const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// needed for json body parsing
app.use(express.json())
app.use(cors())

// routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/tasks', require('./routes/tasks'))

// just a test route
app.get('/', (req, res) => {
  res.send('backend is up')
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('running on ' + port)
})