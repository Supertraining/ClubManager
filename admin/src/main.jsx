import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ReserveBoardProvider } from './components/context/ReserveBoardUpdate.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ReserveBoardProvider>
         <App />
      </ReserveBoardProvider>
  </React.StrictMode>,
)
