import React , {useState} from 'react'
import { userDataContext } from '../context/UserContext'
import { IoIosOptions } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";

function NavBar() {

    const user = JSON.parse(localStorage.getItem("user"))
    const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  return (

    <nav className='relative h-[20%] w-full flex justify-between items-center px-4'>
    
              <div className=' w-24 h-24 '>
                <img className='w-full h-full' src="src/assets/chat_app.jpg" />
              </div>
    
              <button
              onClick={() => setIsSideBarOpen(true)}
              className='w-8'><IoIosOptions  className='w-full h-full sm:hidden'/></button>
    
              <div className={`absolute top-0 ${isSideBarOpen ? "right-0" : "right-[-100%]"} z-10 flex flex-col items-center bg-gray-100 gap-1 px-5 py-3 transition-all duration-500 ease-in-out sm:right-0 sm:flex-row sm:h-full sm:bg-white sm:gap-4`}>
    
                <div
                onClick={() => setIsSideBarOpen(false)} 
                className='w-full text-[25px] font-medium sm:hidden'><IoMdArrowBack /></div>
    
                <div className=' w-14 h-14 border-1 border-gray-500 rounded-full overflow-hidden '>
                  <img className='w-full h-full object-cover' src="src/assets/default_avatar.png" alt="" />
                </div>
    
                <p className='font-semibold text-xl tracking-tight'>{user.name}</p>
    
                <p className='flex text-[17px] items-center text-blue-500 gap-2'><span>Logout</span><CiLogout /></p>
    
              </div>
    
            </nav>

  )
}

export default NavBar