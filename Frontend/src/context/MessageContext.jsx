import React from 'react'
import { createContext , useState } from 'react'

export const messageDataContext = createContext();

function MessageContext({ children }) {

    const [selectedMessage, setSelectedMessage] = useState();

    return (
        <messageDataContext.Provider value={{selectedMessage , setSelectedMessage}}>
            <div>{children}</div>
        </messageDataContext.Provider>
    )
}

export default MessageContext