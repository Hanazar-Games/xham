import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AudioProvider } from './audio/AudioProvider'
import './styles.css'
import './audio/audio.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AudioProvider>
      <App />
    </AudioProvider>
  </StrictMode>,
)
