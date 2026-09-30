window.onload = function () {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('authToken')

  if (!token || !user) {
    // Se não tiver token ou user, volta pro login
    window.location.href = '/login.html'
    return
  }

  // Preenche os dados na tela
  document.getElementById('userName').textContent = user.name
  document.getElementById('userEmail').textContent = user.email
  document.getElementById('userPicture').src = user.picture

  // Faz uma chamada pra rota protegida só pra testar
  fetch('/api/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        console.log('Autenticação validada pelo servidor:', data.user)
      } else {
        console.error('Token inválido')
        logout()
      }
    })
    .catch((error) => console.error('Erro ao validar token:', error))
}

function logout() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  window.location.href = '/login.html'
}
