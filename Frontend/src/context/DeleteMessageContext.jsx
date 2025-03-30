import React from 'react'
import { createContext, useState } from 'react'

export const deleteMessageDataContext = createContext();

function DeleteMessageContext({ children }) {

    const [firstUser, setFirstUser] = useState("");
    const [secondUser, setSecondUser] = useState("");
    const [deletedMessages, setDeletedMessages] = useState([]);

    return (

        <deleteMessageDataContext.Provider value={{firstUser , secondUser , setFirstUser , setSecondUser}}>
            <div>{children}</div>
        </deleteMessageDataContext.Provider>
    )
}

export default DeleteMessageContext