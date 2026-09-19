import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// LanguageProvider lives in App.jsx — do NOT wrap here too
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)