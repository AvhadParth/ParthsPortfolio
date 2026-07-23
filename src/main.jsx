import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// No StrictMode — React.StrictMode double-renders break R3F/Rapier physics
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
