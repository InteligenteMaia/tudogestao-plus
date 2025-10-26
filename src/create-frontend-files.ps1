# Script para criar TODOS os arquivos do frontend automaticamente
# Execute na pasta frontend: .\create-frontend-files.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 Criando Frontend Completo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está na pasta frontend
if (!(Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute na pasta 'frontend'" -ForegroundColor Red
    Write-Host "   cd C:\Users\micha\tudogestao-plus\frontend" -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Criando estrutura de pastas..." -ForegroundColor Yellow

# Criar pasta src
if (!(Test-Path "src")) {
    New-Item -ItemType Directory -Path "src" | Out-Null
    Write-Host "   ✅ Pasta src/ criada" -ForegroundColor Green
} else {
    Write-Host "   ✅ Pasta src/ já existe" -ForegroundColor Green
}

# Criar pasta public
if (!(Test-Path "public")) {
    New-Item -ItemType Directory -Path "public" | Out-Null
    Write-Host "   ✅ Pasta public/ criada" -ForegroundColor Green
} else {
    Write-Host "   ✅ Pasta public/ já existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Criando arquivos..." -ForegroundColor Yellow

# 1. Criar index.html
Write-Host "   1/5 Criando index.html..." -ForegroundColor Cyan
$indexHtml = @'
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TudoGestão+ | Sistema ERP Completo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
'@
Set-Content -Path "index.html" -Value $indexHtml -Encoding UTF8
Write-Host "      ✅ index.html criado" -ForegroundColor Green

# 2. Criar src/main.jsx
Write-Host "   2/5 Criando src/main.jsx..." -ForegroundColor Cyan
$mainJsx = @'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
'@
Set-Content -Path "src\main.jsx" -Value $mainJsx -Encoding UTF8
Write-Host "      ✅ src/main.jsx criado" -ForegroundColor Green

# 3. Criar src/App.jsx
Write-Host "   3/5 Criando src/App.jsx..." -ForegroundColor Cyan
$appJsx = @'
import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        alert('Login realizado com sucesso! 🎉')
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'white',
            borderRadius: '20px',
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '40px' }}>🚀</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '36px', margin: '10px 0' }}>TudoGestão+</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>Sistema ERP Completo</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '30px', textAlign: 'center', color: '#333' }}>
            Entrar no Sistema
          </h2>

          {error && (
            <div style={{
              padding: '15px',
              background: '#fee',
              border: '1px solid #fcc',
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#c33'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@demostore.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border 0.3s'
                }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border 0.3s'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{
            marginTop: '25px',
            padding: '15px',
            background: '#f0f7ff',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '10px' }}>
              📧 Credenciais de Demonstração:
            </p>
            <div style={{ fontSize: '13px', color: '#1e40af' }}>
              <p style={{ margin: '5px 0' }}><strong>Admin:</strong> admin@demostore.com / admin123</p>
              <p style={{ margin: '5px 0' }}><strong>Gerente:</strong> gerente@demostore.com / gerente123</p>
              <p style={{ margin: '5px 0' }}><strong>Vendedor:</strong> vendedor@demostore.com / vendedor123</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', color: 'white', fontSize: '14px' }}>
          <p>© 2025 TudoGestão+ • Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  )
}

export default App
'@
Set-Content -Path "src\App.jsx" -Value $appJsx -Encoding UTF8
Write-Host "      ✅ src/App.jsx criado" -ForegroundColor Green

# 4. Criar src/index.css
Write-Host "   4/5 Criando src/index.css..." -ForegroundColor Cyan
$indexCss = @'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  min-height: 100vh;
}

input:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
'@
Set-Content -Path "src\index.css" -Value $indexCss -Encoding UTF8
Write-Host "      ✅ src/index.css criado" -ForegroundColor Green

# 5. Criar src/App.css
Write-Host "   5/5 Criando src/App.css..." -ForegroundColor Cyan
$appCss = @'
.App {
  width: 100%;
  min-height: 100vh;
}
'@
Set-Content -Path "src\App.css" -Value $appCss -Encoding UTF8
Write-Host "      ✅ src/App.css criado" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Frontend Criado com Sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Arquivos criados:" -ForegroundColor Cyan
Write-Host "   ✅ index.html" -ForegroundColor White
Write-Host "   ✅ src/main.jsx" -ForegroundColor White
Write-Host "   ✅ src/App.jsx" -ForegroundColor White
Write-Host "   ✅ src/index.css" -ForegroundColor White
Write-Host "   ✅ src/App.css" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Agora execute:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Depois acesse:" -ForegroundColor Cyan
Write-Host "   http://localhost:5173" -ForegroundColor Yellow
Write-Host ""