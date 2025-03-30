import React from 'react'
import { useNavigate } from 'react-router-dom';

function UserCard({prop}) {

    const navigate = useNavigate();

    return (

        <div 
        onClick={() => navigate(`/chat-page/${prop.user._id}/${prop.sender}`)}
        className='w-[18rem] flex items-center justify-around gap-2 px-7 py-4 border-1 border-black rounded-lg cursor-pointer'>

            <div className='w-10 h-10 overflow-hidden rounded-full'>
                <img className='w-full h-full object-cover' src="src/assets/default_avatar.png" alt="" />
            </div>

            <p className='font-medium'>{prop.user.name}</p>
            <div className={`w-2 h-2 rounded-full ${prop.user.status === "online" ? "bg-green-500" : "bg-red-500"}`}></div>

        </div>

    )
}

export default UserCard