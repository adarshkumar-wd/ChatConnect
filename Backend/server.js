import dotenv from "dotenv"
dotenv.config()
import { app } from "./app.js";
import http from "http"
import { dbConnection } from "./db/dbConnection.js";
import { Server } from "socket.io";
import { userModel } from "./models/user.model.js";
import { conversationModel } from "./models/conversation.model.js";
import { createConversation } from "./utils/saveConversation.js";
import mongoose from "mongoose";

const server = http.createServer(app)
const port = process.env.PORT || 5000

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})

let userSocketMap = {}

io.on("connection", (socket) => {
    // console.log('A user connected' , socket.id);

    socket.on("register", async (userId) => {

        if (!userId) return;

        try {
            userSocketMap[socket.id] = userId;
            await userModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
            // console.log("socketId Updated");
            io.emit("updation", socket.id, userId);
            // user[socket.id] = userId
            // console.log('userId : ' , user[socket.id]);

        } catch (error) {
            console.log(error)
        }
    })


    socket.on("message", async ({ receiverS, message, receiver, sender }) => {
        // console.log(`message : ${message} , to receiver : ${receiver} , rs : ${receiverS}  ,  send by ${sender}`)
        const newConversation = await createConversation(message, receiver, sender);
        io.to(receiverS).emit("receivedMessage", newConversation);
        socket.emit("updataionOnSender", newConversation);
    })

    socket.on("user:online", async (data) => {
        const { id } = data;
        const idObj = new mongoose.Types.ObjectId(id)

        const updateStatus = await userModel.findOneAndUpdate(idObj, { status: "online" }, { new: true });

        if (updateStatus) {
            io.emit("user:online")
        }

    })

    socket.on("disconnect", async () => {
        const userId = userSocketMap[socket.id];
        console.log("userId : " , userId)
        if (userId) {
            await userModel.findByIdAndUpdate(userId, {
                status: "offline",
                socketId: null
            });

            delete userSocketMap[socket.id]; // cleanup
            io.emit("user:online", { id: userId, status: "offline" });
        }
    });


});

// console.log(" usersId : " , user)


dbConnection()
    .then(() => {

        server.listen(port, (_, res) => {
            console.log(`Server is running on port ${port}`)
        })

    }).catch((error) => {
        console.log(error.message)
    })
