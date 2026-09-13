import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/theme.css'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('#root não existe no index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
