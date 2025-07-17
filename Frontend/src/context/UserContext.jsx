import { createContext, useCallback, useEffect, useState } from "react"
import axios from "axios";

export const userContext = createContext();

function UserContext({ children }) {

  const [user, setUser] = useState()


  useEffect(() => {

    const getUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}/users/get-user`, {
          withCredentials: true
        });
        // console.log("data : " , response.data);
        setUser(response?.data?.user);

      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  } , [])


  return (
    <userContext.Provider value={user}>
      {children}
    </userContext.Provider>
  )
}

export default UserContext