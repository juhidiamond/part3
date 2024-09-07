const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { UserRoute } = require('./Routes/UserRoute.js');
const app = express();
app.use(cors());
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.listen(process.env.PORT_USER_API,(error)=>{
    if(error){
        console.log(error);
    }
    console.log(`Users Server is running on port:${process.env.PORT_USER_API}`);
});

app.use('/users',UserRoute);