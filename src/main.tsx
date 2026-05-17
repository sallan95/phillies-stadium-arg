import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { App } from './App'
import { ProgressProvider } from './hooks/ProgressContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/phillies-stadium-arg">
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </BrowserRouter>
  </StrictMode>,
)
