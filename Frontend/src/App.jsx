import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from "./pages/Register"
import ChatPage from './pages/ChatPage'
import ValidateHome from './pages/ValidateHome'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <ValidateHome>
          <Home />
        </ValidateHome>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat-page/:userId/:sender" element={<ChatPage />} />
    </Routes>
  )
}

export default App