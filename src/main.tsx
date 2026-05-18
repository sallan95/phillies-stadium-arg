import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { App } from './App'
import { ProgressProvider } from './hooks/ProgressContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/phillies-stadium-arg/">
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
