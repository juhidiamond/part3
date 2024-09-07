const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

const UserTable = process.env.TABLE_USERS;
//console.log(UserTable);

// GET ALL Users
const getAllUsers = (request,response)=>{
    pool.query(`SELECT * FROM ${UserTable}`,function(error,results){
        if(error){
            throw error
        }
        return response.status(200).json(results.rows);
    })
}

// DELETE User BY ID
const DeleteUserById = (request,response) =>{
    let id = +(request.params.id);
    pool.query(`DELETE FROM ${UserTable} where id = ${id}`,function(error,results){
        if (error) {
            throw error
        }
        return response.status(200).json({ message: `Deleted User Id: ${id}` });
    })
}

const getUserByEmail = async (email) => {
    let sqlQuery = `SELECT * FROM users WHERE email = '${email}'`;
    let result = await pool.query(sqlQuery);
    return result.rows[0];
}

const getUserById = async (request,response) => {
    let id = +(request.params.id);
    pool.query(`SELECT * FROM ${UserTable} where id = ${id}`,function(error,result){
        if(error){
            throw error
        }
        return response.status(200).json(result.rows[0]);
    })
}

const getLoggedInUser = async (request, response) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await getUserByEmail(decoded.email);
      return response.status(200).json({ user});
    } catch (error) {
        return response.status(401).json({ message: 'Invalid token' });
    }
  }

const LoginUser = async (request, response) => {
    const { email, password } = request.body;
  
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        return response.status(401).json({ message: 'Incorrect login details' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return response.status(400).json({ message: 'Incorrect login details' });
      }
  
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      response.json({ token });
  
    } catch (error) {
      response.status(500).json({ message: 'Server error' });
    }
  };

// ADD NEW User
const CreateUser = async(request, response) => {
    let { name,email,password } = request.body;
    const user = await getUserByEmail(email);
    if (user) {
        return response.status(400).json({ message: `Email :${email} already exists` });
    }
    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(password, salt);

    let sqlQuery = `INSERT INTO ${UserTable}(name, email, password) VALUES ('${name}', '${email}','${cryptedPassword}')`;
    pool.query(sqlQuery, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).json({message:`New User Added :${name}`});
    })
}

// UPDATE EXISTING User
const updateUser = async(request, response) => {
    let id = +(request.params.id);
    let { name, email } = request.body;
    try {
        const user = await pool.query(`SELECT * FROM ${UserTable} WHERE id = ${id}`);
        if (user.rows.length === 0) {
        return response.status(404).json({ message: 'User not found' });
        }
        await pool.query(`UPDATE ${UserTable} SET name='${name}', email='${email}' where id = ${id}`, function (error, results) {
            if(error){
                throw error
            }
            return response.status(200).json({message:`Updated User Id: ${id}`});
        })   
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAllUsers,
    LoginUser,
    getLoggedInUser,
    getUserById,
    DeleteUserById,
    CreateUser,
    updateUser
}
