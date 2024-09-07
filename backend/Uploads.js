const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const { UploadRoute } = require('./Routes/UploadRoute.js');
const app = express();
app.use(cors());
dotenv.config();

app.use(express.json({limit: '5mb'})); 
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb',extended:true}));
//app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT_UPLOAD_API,(error)=>{
    if(error){
        console.log(error);
    }
    console.log(`Uploads Server is running on port:${process.env.PORT_UPLOAD_API}`);
});
app.use('/catalog', express.static(path.join(__dirname, 'catalog')));
app.use("/uploads",UploadRoute);