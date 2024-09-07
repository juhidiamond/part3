const express = require("express");
const { getAllChats,AddChats } = require("../Controller/ChatController");
const ChatRoute = express.Router();

ChatRoute.get("/getall",getAllChats);
ChatRoute.post("/add",AddChats);

module.exports = {
    ChatRoute
}

