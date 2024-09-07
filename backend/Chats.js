const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { ChatRoute } = require('./Routes/ChatRoute.js');
const app = express();
app.use(cors());
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.listen(process.env.PORT_CHAT_API,(error)=>{
    if(error){
        console.log(error);
    }
    console.log(`Chats Server is running on port:${process.env.PORT_CHAT_API}`);
});

app.use('/chats',ChatRoute);