import { createContext, useEffect } from "react"

export const userContext = createContext();

function UserContext({children}) {

    useEffect(() => {})

  return (
    <userContext.Provider>
        {children}
    </userContext.Provider>
  )
}

export default UserContext