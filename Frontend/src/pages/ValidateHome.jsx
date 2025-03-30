import React , {useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


function ValidateHome({children}) {

    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {

            try {
                const response = await axios.get(`http://localhost:5500/users/validate-token` , {withCredentials : true});
                if(!response.status === 200){
                    navigate("/login");
                }
            } catch (error) {
                navigate("/login")
            }
        }

        validateToken()
    } , [navigate])

  return (
    <div>{children}</div>
  )
}

export default ValidateHome