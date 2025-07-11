import React, { useEffect, useState } from 'react'
import axios from 'axios';
import UserCard from '../components/UserCard';
import NavBar from '../components/NavBar';
import { io } from "socket.io-client"
import { useParams } from 'react-router-dom';


export const socket = io("http://localhost:5500");

function Home() {
  const [users, setUsers] = useState([]);
  // const { sender } = useParams();
  const user = JSON.parse(localStorage.getItem("user"))
  const sender = user._id


  useEffect(() => {

    const fetchUsers = async () => {

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}/users/get-users/sender/${sender}`, { withCredentials: true });

        const data = response.data

        if (data.success === true) {
          setUsers(data.users)
        }
      } catch (error) {
        console.log("fetchUsers error : ", error)
      }

    }
    fetchUsers();

  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <NavBar />

      <main className="flex-1 overflow-y-auto py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Let's Chat With Your Friends..
            </h1>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Connect with your favorite people and start meaningful conversations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 justify-items-center">
            {users.map((user) => (
              <UserCard
                key={user._id}
                prop={{ user, sender }}
              />
            ))}
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No friends yet</h3>
              <p className="text-gray-500 mt-2">
                Start adding friends to see them here
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home