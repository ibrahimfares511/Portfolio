import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import App from './App'
import { ThemeProvider } from '@/components/shared/ThemeContext'
import './lib/i18n'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <Analytics/>
          <SpeedInsights/>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
)
