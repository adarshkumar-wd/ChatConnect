import React, { useState } from 'react'
import { createContext } from 'react'

export const userDataContext = createContext();

function UserContext({ children }) {

  const [user, setUser] = useState()

  return (
    <div>
      <userDataContext.Provider value={{ user, setUser }}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext