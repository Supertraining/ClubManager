import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './components/context/AuthContext.jsx'
import { ReserveBoardProvider } from './components/context/ReserveBoardUpdate.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ReserveBoardProvider>
         <App />
      </ReserveBoardProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
