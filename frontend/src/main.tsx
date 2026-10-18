import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AudioProvider } from './AudioContext.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <AudioProvider>
        <App />
      </AudioProvider>
    </BrowserRouter>
  </>
)