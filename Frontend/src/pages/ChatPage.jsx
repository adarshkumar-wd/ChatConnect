import React, { useState, useEffect, useContext } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import axios from "axios"
import { useNavigate, useParams, Link } from 'react-router-dom';
import { socket } from './Home';
import { HiDotsVertical } from "react-icons/hi";
import DeletePopUp from '../components/DeletePopUp';
import { messageDataContext } from '../context/MessageContext';


export const fetchDeletedMessages = async (firstUser, secondUser) => {
  try {

    console.log("response : ", response)

  } catch (error) {
    console.log(error)
  }
}

function ChatPage() {

  const [user, setUser] = useState({});
  const nevigate = useNavigate();
  const { userId: receiver, sender } = useParams();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [receiverS, setReceiver] = useState()
  const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({});
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [deletedMessages, setDeletedMessages] = useState([]);
  const [updateDeleteMessageFlag, setUpdateDeleteMessageFlag] = useState(true);

// SAVE DELETED MESSAGE TO THE BACKEND...

  const handleDeleteFromSender = async () => {

    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}/delete/message/${selectedMessage._id}/sender/${selectedMessage.sender}/receiver/${selectedMessage.receiver}/deletedBy/${sender}` , {withCredentials : true});
        // console.log("response : " , response.data.deletedMessage.sender);

        if (!response.data.deletedMessage.success) {
            console.log(response.data.message || "Select valid message");
        }

        setUpdateDeleteMessageFlag(!updateDeleteMessageFlag);
        setIsDeletePopUpOpen(false)
    } catch (error) {
        console.log(error)
    }
}

// HANDLE DELETE POPUP

  const handleMessageClick = (e, msg) => {

    e.preventDefault();
    setIsDeletePopUpOpen(true);
    setSelectedMessage(msg)

  };

  // REGISTER USER....

  useEffect(() => {
    if (sender) {
      socket.emit("register", sender);
    }
  }, [sender]);

  // FETCH RECEIVER

  useEffect(() => {

    const fetchUser = async () => {

      const response = await axios.get(`${import.meta.env.VITE_API_URI}/users/get-user/${receiver}`, { withCredentials: true });
      const data = response.data;


      if (data.success === true) {
        setUser(data.user)
        setReceiver(data.user?.socketId)
      }

    };

    fetchUser()

  }, [receiver, receiverS])

//  FETCH MESSAGES FROM THE BACKEND....

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URI}/messages/get-msg/${receiver}/${sender}`, { withCredentials: true });
      const data = response.data

      if (data.success === true) {
        setConversation(data.messages)
      }
    }
    fetchMessage()
  }, [receiver, sender])

// SEND MESSAGE

  const sendMessage = async (e) => {

    e.preventDefault();
    // socket.connect()
    socket.emit("message", { receiverS, message, receiver, sender })

    setConversation((prevMessages) => [...prevMessages, { sender, receiver, message }]);

    setMessage("")
  }

// RECEIVE MESSAGE...

  useEffect(() => {

    socket.on("receivedMessage", (message) => {
      setConversation((prevMessages) => [...prevMessages, { sender: receiver, receiver: sender, message }])

    })

    return () => {
      socket.off("receivedMessage", () => {
        setConversation((prevMessages) => [...prevMessages, { sender: receiver, receiver: sender, message }])
      }); // Cleanup listener
    };


  }, [receiver, sender])

// FETCH DELETED MESSAGES...

  useEffect(() => {

    const fetchDeletedMessage = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URI}/delete/message/get/firstuser/${sender}/seconduser/${receiver}` , {withCredentials : true});
      setDeletedMessages((prev) => [...prev , ...response.data.messages]);
    }
    fetchDeletedMessage();

  } , [updateDeleteMessageFlag]);

//  UPDATE FILTERED MESSAGE....

  useEffect(() => {
    const deletedMessageSet = new Set(deletedMessages.map((msg) => {if (msg.deletedBy === sender) return msg.messageId}))
    setFilteredMessages(() => conversation.filter((msg) => !deletedMessageSet.has(msg._id)));
    
  }, [deletedMessages , conversation])

  return (

    <>

      <main className='w-screen h-screen flex justify-center bg-gray-400'>

        <section className='w-full h-full flex flex-col justify-between items-center bg-gray-400 xs:w-[90%] xs2:w-[70%] sm:w-[60%] md:w-[50%] custom1:w-[40%] lg:w-[35%] custom2:w-[32%] xl:w-[29%]'>

          <nav className='w-full flex gap-4 py-3 items-center px-3 justify-between border-b-[1px] border-b-black bg-white'>

            <div className='flex items-center gap-5'>
              <Link to={"/"} className='font-medium text-2xl mr-2'><IoMdArrowBack /></Link>

              <div className='w-12 h-12 overflow-hidden rounded-full'>
                <img className='w-full h-full object-cover' src="https://static.vecteezy.com/system/resources/previews/001/840/618/original/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg" alt="" />
              </div>

              <h3 className='font-medium text-xl'><p>{user.name}</p></h3>
            </div>

            <h3 className='mr-2 text-xl font-medium'><HiDotsVertical /></h3>

          </nav>

          <div className='relative w-full h-full bg-gray-200 py-3 px-3 flex flex-col gap-16 overflow-y-scroll' >

            <div className={`${isDeletePopUpOpen ? "" : "hidden"} bg-white absolute w-[60%] top-[50%] z-20 -translate-y-1/2 left-[50%] -translate-x-1/2 px-4 py-3 border-1 border-black text-red-400 text-2xl font-semibold rounded-lg`}>
              <p onClick={handleDeleteFromSender} className='cursor-pointer'>Delete from me</p>
              <p className='cursor-pointer'>Delete from both</p>
            </div>

            {socket.connected ?
              <div className='w-full h-full flex flex-col overflow-y-scroll' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {
                  filteredMessages.map((msg, index) => (
                    <div onContextMenu={(e) => handleMessageClick(e, msg)} key={index} className='relative mb-15 cursor-pointer'>
                      <h3 className={`absolute ${msg.sender === sender ? "right-3" : "left-3"} flex flex-wrap w-fit px-2 py-2 rounded-xl bg-white max-w-[50%] overflow-hidden`}>{msg.message}</h3>
                    </div>
                  ))
                }
              </div> :
              <div className='w-full h-full flex flex-col items-center justify-center text-red-500 gap-16 overflow-y-scroll'>
                {
                  <p className='text-2xl font-semibold'>You are Offline!</p>
                }
              </div>}

          </div>

          <footer className='bg-white w-full flex'>

            <input
              className='w-[80%] rounded-lg border-[1px] outline-none py-3 px-3 test-xl'
              type="text"
              placeholder='Enter Your Message...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={sendMessage}
              className='w-[20%] bg-black text-white py-3 font-semibold text-xl rounded-lg '>Send</button>

          </footer>

        </section>

      </main>

    </>

  )
}

export default ChatPage