const jwt = require('jsonwebtoken')

//esse midlware é executado primeiro que a rota, então sempre que colocarmos isso na rota
//a rota vai saber se o token JWT está certo ou não.

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
}

module.exports = authMiddleware
