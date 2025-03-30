import { deletedMessageModdel } from "../models/deletedMessages.model.js";

export const createmessage = async (req , res) => {

    const {messageId , senderId , receiverId , deletedBy} = req.params;

    if (!messageId || !senderId || !receiverId) {
        return res.status(400).json({success : false , message : "Please provide all datas..."});
    }

    const existMessageId = await deletedMessageModdel.findOne({messageId : messageId , deletedBy : deletedBy});

    if (existMessageId) {
        return res.status(400).json({success : false , message : "Message already deleted..."});
    }

    const deletedMessage = await deletedMessageModdel.create({
        messageId : messageId,
        sender : senderId,
        receiver : receiverId,
        deletedBy : deletedBy
    })

    if (!deletedMessage) {
        return res.status(500).json({success : false , message : "Server error while deleting messages..."});
    }

   return res.status(200).json({success : true ,  deletedMessage , message : "Message deleted successfully..."});

}

export const getMessages = async (req , res) => {

    const {firstuser , seconduser} = req.params

    if (!firstuser , !seconduser) {
        return res.status(400).json({success : false , message : "User id's are required..."});
    }

    const getMessages = await deletedMessageModdel.find({
        $or : [
            {sender : firstuser , receiver : seconduser}, 
            {sender : seconduser , receiver : firstuser}
        ]
    })

    return res.status(200).json({success : true , messages : getMessages , message : "Messages fetched successfully..."});

}