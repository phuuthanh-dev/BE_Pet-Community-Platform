require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./utils/db.js')
const appRouter = require('./routes')
const { errorHandler } = require('./middlewares/error.middlewares.js')
const { app, server } = require('./socket/socket.js')
const path = require('path')
const PORT = process.env.PORT || 3000

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use('/api/v1', appRouter)

app.use(errorHandler)

app.use(express.static(path.join(__dirname, '/frontend/dist')))
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
})

server.listen(PORT, () => {
  connectDB()
  console.log(`Server listen at port ${PORT}`)
})
