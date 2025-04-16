import dotenv from "dotenv"
dotenv.config()
import { app } from "./app.js";
import http from "http"
import { dbConnection } from "./db/dbConnection.js";
import { Server } from "socket.io";
import { userModel } from "./models/user.model.js";
import { conversationModel } from "./models/conversation.model.js";
import { createConversation } from "./utils/saveConversation.js";

const server = http.createServer(app)
const port = process.env.PORT || 5000

export const io = new Server(server , {
    cors : {
        origin : "http://localhost:5173",
        credentials : true
    }
})

let user = {}

io.on("connection" , (socket) => {
    // console.log('A user connected' , socket.id);

    socket.on("register" , async (userId) => {

        if (!userId) return; 

        try {
            await userModel.findByIdAndUpdate(userId , {socketId : socket.id} , {new : true});
            // console.log("socketId Updated");
            io.emit("updation" , socket.id , userId);
            // user[socket.id] = userId
            // console.log('userId : ' , user[socket.id]);
            
        } catch (error) {
            console.log(error)
        }
    })


    socket.on("message" , async({receiverS , message , receiver , sender}) => {
        // console.log(`message : ${message} , to receiver : ${receiver} , rs : ${receiverS}  ,  send by ${sender}`)
        const conversationCreated = await createConversation(message , receiver , sender);
        io.to(receiverS).emit("receivedMessage" , message)
    })

    // socket.on("disconnect", async () => {
    //     const userId = user[socket.id]; 

    //     if (!userId) {
    //         console.log("No userId found for socket:", socket.id);
    //         return;
    //     }

    //     try {
    //         await userModel.findByIdAndUpdate(userId, { status: "offline"}, { new: true });
    //         console.log(`User ${userId} is now offline.`);
    //     } catch (error) {
    //         console.log("Error updating user status:", error.message);
    //     } finally {
    //         delete user[socket.id]; 
    //     }
    // })

    


    
});

// console.log(" usersId : " , user)


dbConnection()
.then(() => {

    server.listen(port , (_ , res) => {
        console.log(`Server is running on port ${port}`)
    })

}).catch((error) => {
    console.log(error.message)
})
