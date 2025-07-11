import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { userDataContext } from '../context/UserContext';
import { HashLoader } from 'react-spinners';

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const { user, setUser } = useContext(userDataContext)
  const [avatar, setAvatar] = useState()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    console.log("user :", user)
  }, [user])


  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);

    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_API_URI}/users/register`, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data", } });
      const data = response.data;

      if (data.success === true) {
        setUser(data.user)
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate(`/`)
      }

      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      {/* Loader Overlay */}
      <div className={`${loading ? null : "hidden"} absolute border-1 border-pink-700 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10%] h-[20%] z-50 bg-pink-100 flex items-center justify-center`}>
        <HashLoader color="#f43f5e" /> {/* Tailwind pink/red theme color */}
      </div>

      <main className='w-screen h-screen flex items-center justify-center bg-pink-100'>
        <div className='relative w-full h-full flex items-center justify-center'>
          <div className='w-full sm:w-[80%] sm:border-[2px] sm:px-6 sm:rounded-lg sm:py-10 sm:border-pink-300 md:w-[75%] custom1:w-[70%] lg:w-[65%] custom2:w-[58%] xl:w-[50%] custom3:w-[40%] px-5 bg-pink-200'>

            <div className='absolute top-4 left-5 bg-red-200 w-30 h-30 rounded-lg overflow-hidden shadow-md'>
              <img className='w-full h-full object-cover' src="src/assets/chat_app.jpg" alt="" />
            </div>

            <form className='flex flex-col gap-5 w-full sm:gap-6 custom1:gap-7'>
              <h3 className='font-bold text-3xl text-center text-red-500'>Register Your Account</h3>

              <input
                type="text"
                placeholder='Enter Your Name...'
                className='rounded-lg border border-pink-300 outline-none w-full py-3 px-3 text-xl bg-pink-50'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder='Enter Your Email...'
                className='rounded-lg border border-pink-300 outline-none w-full py-3 px-3 text-xl bg-pink-50'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder='Enter Your Password...'
                className='rounded-lg border border-pink-300 outline-none w-full py-3 px-3 text-xl bg-pink-50'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="file"
                accept="image/*"
                className='rounded-lg border border-pink-300 outline-none w-full py-3 px-3 text-xl bg-pink-50 file:cursor-pointer'
                onChange={(e) => setAvatar(e.target.files[0])}
              />

              <button
                onClick={handleSubmit}
                className='w-full bg-yellow-400 text-black py-3 font-semibold text-xl rounded-lg shadow hover:bg-yellow-300 transition-all duration-200'
              >
                Register
              </button>

              <h3 className='text-center text-red-500'>
                Already have Account? <span className='text-blue-500'><Link to={"/login"}>Login Here</Link></span>
              </h3>
            </form>

          </div>
        </div>
      </main>
    </>
  )

}

export default Register