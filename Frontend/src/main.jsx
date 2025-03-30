import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext, { userDataContext } from './context/UserContext.jsx'
import MessageContext from './context/MessageContext.jsx'
import DeleteMessageContext from './context/DeleteMessageContext.jsx'

createRoot(document.getElementById('root')).render(

  <UserContext>
    <MessageContext>
      <DeleteMessageContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DeleteMessageContext>
    </MessageContext>
  </UserContext>
)
