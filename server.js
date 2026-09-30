require('dotenv').config()
const express = require('express')
const path = require('path')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// Rotas
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
