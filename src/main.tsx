import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import { SudokuProvider } from './context/SudokuContext'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'

const basename =
  import.meta.env.BASE_URL === '/'
    ? undefined
    : import.meta.env.BASE_URL.replace(/\/$/, '')

if (import.meta.env.PROD) {
  registerSW({
    onRegisterError(error) {
      console.error('Service worker registration failed', error)
    },
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <SudokuProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </SudokuProvider>
    </BrowserRouter>
  </StrictMode>,
)
