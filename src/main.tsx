import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { SudokuProvider } from './context/SudokuContext'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SudokuProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </SudokuProvider>
    </BrowserRouter>
  </StrictMode>,
)
