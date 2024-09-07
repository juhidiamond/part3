const { request, response } = require("express");
const dotenv = require('dotenv');
dotenv.config();

const Pool = require("pg").Pool;
const pool = new Pool({
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
})

const ChatTable = process.env.TABLE_CHATS;
//console.log(UserTable);

// GET ALL Chats
exports.getAllChats = async(request,response)=>{
    await pool.query(`SELECT * FROM ${ChatTable}`,function(error,results){
        if(error){
            return response.status(403).json({message:error});
        }
        return response.status(200).json(results.rows);
    })
}

exports.AddChats = async(request,response) =>{
    const {userid,username,message} = request.body;
    await pool.query(`INSERT INTO ${ChatTable} (username, message,userid) VALUES ('${username}','${message}','${userid}')`,function(error,results){
        if(error){
            return response.status(403).json(error.message);
        }
        return response.status(200).json({message:`Message Send Sccessfully!`})
    })
}
