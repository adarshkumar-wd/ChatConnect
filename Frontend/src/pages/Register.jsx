import React, { useState , useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { userDataContext } from '../context/UserContext';

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const {user , setUser} = useContext(userDataContext)
  const navigate = useNavigate()

  useEffect(() => {
    console.log("user :" , user)
  } , [user])


  const handleSubmit = async (e) => {

    e.preventDefault();

    const userData = {
      name : name,
      email : email,
      password : password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URI}/users/register` , userData , {withCredentials : true});
      const data = response.data;
  
      if (data.success === true) {
        setUser(data.user)
        localStorage.setItem("user" , JSON.stringify(data.user))
        navigate(`/`)
      }
  
      setName("")
      setEmail("")
      setPassword("")
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>

      <main className='w-screen h-screen flex items-center justify-center'>
        <div className='relative w-full h-full flex items-center justify-center'>
          <div className='w-full sm:w-[80%] sm:border-[2px] sm:px-6 sm:rounded-lg sm:py-10 sm:border-black md:w-[75%] custom1:w-[70%] lg:w-[65%] custom2:w-[58%] xl:w-[50%] custom3:w-[40%] px-5'>

            <div className='absolute top-4 left-5 bg-black w-30 h-30 '>
              <img className='w-full h-full' src="src/assets/chat_app.jpg" alt="" />
            </div>

            <form className='flex flex-col gap-5 w-full sm:gap-6 custom1:gap-7'>
              <h3 className='font-bold text-3xl text-center'>Register Your Account</h3>

              <input
                type="text"
                placeholder='Enter Your Name...'
                className='rounded-lg border-[1px] outline-none w-full py-3 px-3 test-xl'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder='Enter Your Email...'
                className='rounded-lg border-[1px] outline-none w-full py-3 px-3 test-xl'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder='Enter Your Password...'
                className='rounded-lg border-[1px] outline-none w-full py-3 px-3 test-xl'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
              onClick={handleSubmit}
              className='w-full bg-black text-white py-3 font-semibold text-xl rounded-lg '>Register</button>

              <h3 className='text-center'>Already have Account? <span className='text-blue-500'><Link to={"/login"}>Login Here</Link></span></h3>
            </form>
          </div>
        </div>
      </main>

    </>
  )
}

export default Register