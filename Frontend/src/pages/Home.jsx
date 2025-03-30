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

  // useEffect(() => {
  //   socket.on("connect", () => { // Ye actual userId backend se lo (login ke baad)
  //     socket.emit("user_connected", sender);
  //   });
  // })


  useEffect(() => {
    if (sender) {
      socket.emit("register", sender)
    }

  }, [sender])


  useEffect(() => {

    const fetchUsers = async () => {

      const response = await axios.get(`${import.meta.env.VITE_API_URI}/users/get-users`, { withCredentials: true });

      const data = response.data

      if (data.success === true) {
        setUsers(data.users)
      }

    }
    fetchUsers();

  }, [])

  return (
    <>

      <main className='w-full overflow-y-scroll overflow-x-hidden'>

        <NavBar />

        <section className='w-full h-[80%] flex flex-wrap justify-center py-6 gap-4'>
          <p className='w-full text-center font-semibold text-xl mb-4'>Let's Chat With Your Friends..</p>

          <div className='flex w-[90%] justify-center flex-wrap gap-4'>
            {
              users.map((user) => (
                <UserCard
                  key={user._id}
                  prop={{ user, sender }}
                />
              ))
            }
          </div>

        </section>

      </main>

    </>
  )
}

export default Home