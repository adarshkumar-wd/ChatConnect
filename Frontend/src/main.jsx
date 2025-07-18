import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import SocketContext from './context/SocketContext.jsx'
import UserContext from './context/userContext.jsx'

createRoot(document.getElementById('root')).render(
  <UserContext>
    <SocketContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketContext>
  </UserContext>
)
