import { conversationModel } from "../models/conversation.model.js";

export const getMessages = async (req , res) => {

    const {receiver , sender} = req.params

    // console.log(`receiver : ${receiver} , sender : ${sender}`)

    if (!receiver || !sender) {
        return res.status(404).json({success : false , messages , message : "Please provide sender and receiver id's.."})
    }

    const messages = await conversationModel.find({
        $or : [
            {sender : sender , receiver : receiver},
            {sender : receiver , receiver : sender}
        ]
    })

    return res.status(200).json({success : true , messages : messages , message : "Message successfully fetched.."})

}