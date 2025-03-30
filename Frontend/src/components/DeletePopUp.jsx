import React from 'react'
import axios from 'axios'
import { deleteMessageDataContext } from '../context/DeleteMessageContext.jsx';
import { useContext } from 'react';

function DeletePopUp(props) {


    const handleDeleteFromSender = async () => {

        try {
            setDeleteStart(true)
            const response = await axios.get(`${import.meta.env.VITE_API_URI}/delete/message/${props.selectedMessage._id}/sender/${props.selectedMessage.sender}/receiver/${props.selectedMessage.receiver}` , {withCredentials : true});
    
            if (response.data.status !== 200) {
                console.log(response.data.message || "Select valid message");
            }
    
            const messages = await axios.get(`${import.meta.env.VITE_API_URI}/delete/message/get/firstuser/${response.data.sender}/seconduser/${response.data.receiver}` , {withCredentials : true});
    
            props.setIsDeletePopUpOpen(false)
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div className={`${props.isDeletePopUpOpen ? "" : "hidden"} bg-white absolute w-[60%] top-[50%] z-20 -translate-y-1/2 left-[50%] -translate-x-1/2 px-4 py-3 border-1 border-black text-red-400 text-2xl font-semibold rounded-lg`}>
            <p onClick={handleDeleteFromSender} className='cursor-pointer'>Delete from me</p>
            <p className='cursor-pointer'>Delete from both</p>
        </div>
    )
}

export default DeletePopUp