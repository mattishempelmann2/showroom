import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // Capital 'A' to match the filename
import './index.css'

const rootElement = document.getElementById('root') || document.getElementById('app')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

