import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Error boundary for the root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    'Root element with id "root" not found. ' +
    'Please check your index.html file and ensure there is a div with id="root".'
  )
}

// Error handling for root creation
try {
  const root = createRoot(rootElement)

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  )
} catch (error) {
  console.error('Failed to render the React application:', error)

  // Fallback UI for rendering errors
  const fallbackUI = document.createElement('div')
  fallbackUI.style.cssText = `
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `
  fallbackUI.innerHTML = `
    <h1 style="color: #dc2626; font-size: 1.5rem; margin-bottom: 1rem;">
      Application Error
    </h1>
    <p style="color: #6b7280; margin-bottom: 1rem;">
      Sorry, something went wrong while loading the application.
    </p>
    <button 
      onclick="window.location.reload()" 
      style="
        background: #2563eb;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        cursor: pointer;
      "
    >
      Reload Application
    </button>
  `

  document.body.appendChild(fallbackUI)
}