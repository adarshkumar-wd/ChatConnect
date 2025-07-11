import React, { useState, useEffect, useContext, useCallback } from 'react'
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
  const [updateDeleteMessageFlag, setUpdateDeleteMessageFlag] = useState(true);
  const [deleteMessageFromDbFlag, setDeleteMessageFromDbFlag] = useState(false);

  const [test, setTest] = useState(false);

  // console.log("sender : " , sender)

  // Delete message from Sender...

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

  // Delete message from both user

  const handleDeleteMessageFromBothUser = async () => {

    try {
      if (selectedMessage._id) {
        const response = await axios.put(`${import.meta.env.VITE_API_URI}/delete/message/${selectedMessage._id}/from-both-user`);
        setIsDeletePopUpOpen(false)
        setUpdateDeleteMessageFlag
      } else {
        console.log("Data not found properly..")
        setIsDeletePopUpOpen(false)
      }
    } catch (error) {
      console.log(error);
      setIsDeletePopUpOpen(false)

    }

  }

  // Sender delete the message from both - socket event (Signal)

  // HANDLE DELETE POPUP

  const handleMessageClick = (e, msg) => {

    e.preventDefault();
    console.log("msg : ", msg)
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

  const handleUpdation = useCallback((receiverSocket, receiverId) => {
    if (receiver === receiverId) {
      setReceiverSocket(receiverSocket)
    }
  }, [])

  const updationOnSender = useCallback((newMessage) => setConversation((prevMessages) => [...prevMessages, newMessage]), [])

  const handleReceiveMessage = useCallback((message) => {
    console.log("Received Socket runs....")
    setConversation((prevMessages) => [...prevMessages, message]);
  }, [conversation])

  const handleMessageDeleted = useCallback(() => {
    setDeleteMessageFromDbFlag(!deleteMessageFromDbFlag);
  }, [])

  useEffect(() => {
    socket.on("updation", handleUpdation);
    socket.on("updataionOnSender", updationOnSender);
    socket.on("receivedMessage", handleReceiveMessage);
    socket.on("messageDeleted", handleMessageDeleted);


    return () => {
      socket.off("updation", handleUpdation)
      socket.off("updataionOnSender", updationOnSender);
      socket.off("receivedMessage", handleReceiveMessage);
      socket.off("messageDeleted", handleMessageDeleted);

    }
  }, [])

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
  }, [updateDeleteMessageFlag, deleteMessageFromDbFlag])

  // SEND MESSAGE

  const sendMessage = async (e) => {

    e.preventDefault();
    // socket.connect()
    socket.emit("message", { receiverS, message, receiver, sender })

    setMessage("")
  }

  useEffect(() => {
    console.log("conversation : ", conversation)
  }, [conversation])

  // Close delete Popup...

  useEffect(() => {
    window.addEventListener("click", () => setIsDeletePopUpOpen(false));
  })

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <main className="flex-1 flex justify-center items-center py-6 px-4">
        <section className="w-full h-[90vh] max-w-2xl flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          {/* Chat Header */}
          <nav className="w-full flex items-center justify-between py-4 px-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200">
            <div className="flex items-center gap-4">
              <Link to={"/"} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                <IoMdArrowBack className="w-6 h-6" />
              </Link>

              <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-indigo-300">
                <img
                  className="w-full h-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
              </div>

              <div>
                <h3 className="font-semibold text-indigo-900">{user.name}</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
            </div>

            <button className="p-2 rounded-full hover:bg-indigo-100 transition-colors">
              <HiDotsVertical className="w-5 h-5 text-indigo-600" />
            </button>
          </nav>

          {/* Chat Messages */}
          <div className="relative flex-1 flex flex-col p-4 overflow-y-auto bg-gradient-to-b from-white to-indigo-50">
            {/* Delete Popup */}
            <div
              className={`${isDeletePopUpOpen ? "block" : "hidden"} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white rounded-xl shadow-2xl border border-indigo-200 w-72 overflow-hidden`}
            >
              <div className="p-4 border-b border-indigo-100">
                <h3 className="font-semibold text-indigo-900">Delete Message</h3>
              </div>

              <div className="py-2">
                <button
                  onClick={handleDeleteFromSender}
                  className="w-full py-3 px-4 text-left text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">🗑️</span>
                  Delete from me
                </button>

                <button
                  onClick={handleDeleteMessageFromBothUser}
                  className={`${selectedMessage.sender === sender ? "flex" : "hidden"} w-full py-3 px-4 text-left text-red-500 hover:bg-red-50 transition-colors items-center gap-2`}
                >
                  <span className="text-lg">❌</span>
                  Delete from both
                </button>
              </div>
            </div>

            {/* Messages Container */}
            {socket.connected ? (
              <div className="flex flex-col gap-4">
                {conversation.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === sender ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      onDoubleClick={(e) => handleMessageClick(e, msg)}
                      className={`${msg.sender === sender
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                        : 'bg-indigo-100 text-indigo-900 rounded-bl-none'} 
                      max-w-[80%] px-4 py-3 rounded-2xl shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full p-6 mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-900">You're Offline</h3>
                <p className="text-indigo-700 mt-2 max-w-md">
                  Your messages will be sent when you reconnect to the internet
                </p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <footer className="w-full p-4 bg-white border-t border-indigo-100">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-full border border-indigo-200 focus:border-indigo-400 outline-none py-3 px-5 text-indigo-900 placeholder-indigo-300"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full px-6 font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Send
              </button>
            </div>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default ChatPage