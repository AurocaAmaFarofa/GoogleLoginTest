const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../db/connection')

const router = express.Router()

router.post('/google-login', async (req, res) => {
  const { googleId, name, email, picture } = req.body

  try {
    const connection = await db.getConnection()

    // Verifica se usuário já existe
    const [existingUser] = await connection.query(
      'SELECT * FROM users WHERE google_id = ?',
      [googleId],
    )

    let user
    if (existingUser.length > 0) {
      // Usuário já existe, pega ele
      user = existingUser[0]
    } else {
      // Cria novo usuário
      const [result] = await connection.query(
        'INSERT INTO users (google_id, name, email, picture) VALUES (?, ?, ?, ?)',
        [googleId, name, email, picture],
      )
      user = { id: result.insertId, google_id: googleId, name, email, picture }
    }

    // Cria JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    )

    connection.release()

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
