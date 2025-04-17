import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Simulation } from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Simulation/>
  </StrictMode>,
)
