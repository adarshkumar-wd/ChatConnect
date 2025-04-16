import React, { useState, useEffect, useContext } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import axios from "axios"
import { useNavigate, useParams, Link } from 'react-router-dom';
import { socket } from './Home';
import { HiDotsVertical } from "react-icons/hi";


function ChatPage() {

  const [user, setUser] = useState({});
  const nevigate = useNavigate();
  const { userId: receiver, sender } = useParams();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [receiverS, setReceiverSocket] = useState()
  const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({});
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [deletedMessages, setDeletedMessages] = useState([]);
  const [updateDeleteMessageFlag, setUpdateDeleteMessageFlag] = useState(true);
  const [deleteMessageFromDbFlag, setDeleteMessageFromDbFlag] = useState(false);

  // SAVE DELETED MESSAGE TO THE BACKEND...

  const handleDeleteFromSender = async () => {

    try {

      if (selectedMessage._id && selectedMessage.sender && selectedMessage.receiver) {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}/delete/message/${selectedMessage._id}/sender/${selectedMessage.sender}/receiver/${selectedMessage.receiver}/deletedBy/${sender}`, { withCredentials: true });
        // console.log("response : ", response.data.deletedMessage);

        if (!response.data.deletedMessage.success) {
          console.log(response.data.message || "Select valid message");
        }

        setUpdateDeleteMessageFlag(!updateDeleteMessageFlag);
        setIsDeletePopUpOpen(false)
      } else {
        console.log("data not found properly..");
        console.log(selectedMessage._id, selectedMessage.sender, selectedMessage.receiver);
        setIsDeletePopUpOpen(false)

      }

    } catch (error) {
      setIsDeletePopUpOpen(false);
      console.log("Delete message from sender error : ", error);
    }
  }

  //

  const handleDeleteMessageFromBothUser = async () => {

    try {
      if (selectedMessage._id) {
        const response = await axios.put(`${import.meta.env.VITE_API_URI}/delete/message/${selectedMessage._id}/from-both-user`);
        console.log("response : ", response);
        setIsDeletePopUpOpen(false)
      } else {
        console.log("Data not found properly..")
        setIsDeletePopUpOpen(false)
      }
    } catch (error) {
      console.log(error);
      setIsDeletePopUpOpen(false)

    }

  }

  useEffect(() => {
    socket.on("messageDeleted", () => {
      setDeleteMessageFromDbFlag(!deleteMessageFromDbFlag);
    })
  })


  // HANDLE DELETE POPUP

  const handleMessageClick = (e, msg) => {

    e.preventDefault();
    setIsDeletePopUpOpen(true);
    setSelectedMessage(msg)

  };

  // REGISTER USER....

  useEffect(() => {
    if (sender) {
      if (socket.connected) {
        // console.log("Registering with socket:", sender);
        socket.emit("register", sender);
      } else {
        socket.on("connect", () => {
          // console.log("Registering with socket:", sender);
          socket.emit("register", sender);
        });
      }
    }
  }, []);


  // FETCH RECEIVER

  useEffect(() => {

    const fetchUser = async () => {

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}/users/get-user/${receiver}`, { withCredentials: true });
        const data = response.data;


        if (data.success === true) {
          setUser(data.user)
          setReceiverSocket(data.user?.socketId)
          // console.log("Receiver socket Id : ", data.user?.socketId);

        }
      } catch (error) {
        console.log("fetching receiver error : ", error);
      }

    };

    fetchUser()

  }, [receiver, receiverS])

  // Handle Receiver Socket Updation

  useEffect(() => {
    socket.on("updation", (receiverSocket, receiverId) => {
      if (receiver === receiverId) {
        setReceiverSocket(receiverSocket)
      }
    })
  })

  //  FETCH MESSAGES FROM THE BACKEND....

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}/messages/get-msg/${receiver}/${sender}`, { withCredentials: true });
        const data = response.data

        if (data.success === true) {
          setConversation(data.messages)
        }
      } catch (error) {
        console.log("Fetching message from backend error : ", error);
      }
    }
    fetchMessage()
  }, [receiver, sender, deleteMessageFromDbFlag])

  // FETCH DELETED MESSAGES...

  useEffect(() => {

    const fetchDeletedMessage = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}/delete/message/get/firstuser/${sender}/seconduser/${receiver}`, { withCredentials: true });
        setDeletedMessages(() => [...response.data.messages]);
      } catch (error) {
        console.log("Deleted message fetching error : ", error);
      }
    }
    fetchDeletedMessage();

  }, [updateDeleteMessageFlag]);

  //  UPDATE FILTERED MESSAGE....

  useEffect(() => {
    const deletedMessageSet = new Set(deletedMessages.map((msg) => { if (msg.deletedBy === sender) return msg.messageId }))
    setFilteredMessages(() => conversation.filter((msg) => !deletedMessageSet.has(msg._id)));

  }, [deletedMessages, conversation])

  // SEND MESSAGE

  const sendMessage = async (e) => {

    e.preventDefault();
    // socket.connect()
    socket.emit("message", { receiverS, message, receiver, sender })

    setFilteredMessages((prevMessages) => [...prevMessages, { sender: sender, receiver: receiver, message }]);

    setMessage("")
  }

  // RECEIVE MESSAGE...

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      // console.log("message : " ,  message)
      setFilteredMessages((prevMessages) => [...prevMessages, {
        sender: receiver, receiver: sender, message
      }]);
    };

    socket.on("receivedMessage", handleReceiveMessage);

    return () => {
      socket.off("receivedMessage", handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("click" , () => setIsDeletePopUpOpen(false));
  })


  return (

    <>

      <main className='w-screen h-screen flex justify-center bg-pink-100'>

        <section className='w-full h-full  border-2 border-pink-300 flex flex-col justify-between items-center bg-pink-200 xs:w-[90%] xs2:w-[70%] sm:w-[60%] md:w-[50%] custom1:w-[40%] lg:w-[35%] custom2:w-[32%] xl:w-[29%]'>

          <nav className='w-full flex gap-4 py-3 items-center px-3 justify-between border-b-[1px] border-b-black bg-red-100'>

            <div className='flex items-center gap-5'>
              <Link to={"/"} className='font-medium text-2xl mr-2'><IoMdArrowBack /></Link>

              <div className='w-12 h-12 overflow-hidden rounded-full'>
                <img className='w-full h-full object-cover' src={user.avatar} alt="" />
              </div>

              <h3 className='font-medium text-xl'><p>{user.name}</p></h3>
            </div>

            <h3 className='mr-2 text-xl font-medium'><HiDotsVertical /></h3>

          </nav>

          <div className='relative w-full h-full bg-red-50 py-3 px-3 flex flex-col gap-16 overflow-y-scroll scrollbar-none' >

            <div className={`${isDeletePopUpOpen ? "" : "hidden"} bg-white absolute w-[60%] top-[50%] z-20 -translate-y-1/2 left-[50%] -translate-x-1/2 px-6 py-5 shadow-xl border border-gray-300 text-red-500 text-xl font-semibold rounded-2xl space-y-4`}>
              <p
                onClick={handleDeleteFromSender}
                className='cursor-pointer hover:bg-red-100 transition-all duration-200 px-4 py-2 rounded-md text-center'
              >
                🗑️ Delete from me
              </p>
              <p
                onClick={handleDeleteMessageFromBothUser}
                className='cursor-pointer hover:bg-red-100 transition-all duration-200 px-4 py-2 rounded-md text-center'
              >
                ❌ Delete from both
              </p>
            </div>


            {socket.connected ?
              <div className='w-full h-full flex flex-col overflow-y-scroll scrollbar-none'>
                {filteredMessages.map((msg, index) => (
                  <div
                    onContextMenu={(e) => handleMessageClick(e, msg)}
                    key={index}
                    className={`w-full flex ${msg.sender === sender ? 'justify-end' : 'justify-start'} px-2 mb-4`}
                  >
                    <div className={`${msg.sender === sender ? 'bg-yellow-50' : 'bg-orange-100'} cursor-pointer px-4 py-2 rounded-xl text-black max-w-[70%] break-words shadow`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
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