function handleCredentialResponse(response) {
  console.log('Credencial recebida do Google')

  // Decodifica o JWT que o Google manda
  const base64Url = response.credential.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  )

  const { sub: googleId, name, email, picture } = JSON.parse(jsonPayload)

  console.log('Dados do Google:', { googleId, name, email, picture })

  // Manda pro nosso back-end fazer login
  fetch('/api/auth/google-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      googleId,
      name,
      email,
      picture,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        console.log('Login bem-sucedido!')
        console.log('Token:', data.token)
        console.log('Usuário:', data.user)

        // Salva o token no localStorage
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redireciona pra página de dashboard
        window.location.href = '/dashboard.html'
      } else {
        console.error('Erro no login:', data.error)
      }
    })
    .catch((error) => console.error('Erro na requisição:', error))
}
