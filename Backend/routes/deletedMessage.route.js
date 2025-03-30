import { Router } from "express";
import { createmessage, getMessages } from "../controllers/deleteMessage.controller.js";

const router = Router();

router.get("/message/:messageId/sender/:senderId/receiver/:receiverId/deletedBy/:deletedBy" , createmessage);
router.get("/message/get/firstuser/:firstuser/seconduser/:seconduser" , getMessages);

export default router;