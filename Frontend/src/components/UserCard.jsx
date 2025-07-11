import React from 'react'
import { useNavigate } from 'react-router-dom';

function UserCard({ prop }) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/chat-page/${prop.user._id}/${prop.sender}`)}
            className='
      w-full max-w-[18rem] 
      flex items-center 
      gap-4 
      px-5 py-3 
      border border-gray-200 
      rounded-xl 
      cursor-pointer 
      bg-white 
      shadow-sm 
      hover:shadow-md 
      transition-all
      duration-300
      ease-in-out
    '
        >
            <div className='w-12 h-12 overflow-hidden rounded-full flex-shrink-0'>
                <img
                    className='w-full h-full object-cover'
                    src={prop.user?.avatar || 'https://via.placeholder.com/150'}
                    alt={prop.user.name}
                />
            </div>

            <div className="min-w-0 flex-1">
                <p className='font-medium truncate'>{prop.user.name}</p>
                <p className="text-xs text-gray-500 truncate">Tap to start chatting</p>
            </div>

            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${prop.user.status === "online" ? "bg-green-500" : "bg-gray-400"}`}></div>
        </div>
    )
}

export default UserCard