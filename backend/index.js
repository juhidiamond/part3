const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
app.use(cors());
dotenv.config();
//const USERPORT = process.env.PORT_USER_API || 3001;
const USERPORT=3001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.listen(USERPORT,(err)=>{
    console.log(`User Server is running on port:${USERPORT}`);
});
