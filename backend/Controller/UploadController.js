const { request, response } = require("express");
const dotenv = require('dotenv');
const path = require("path");
const fs = require('fs');
dotenv.config();
const Pool = require("pg").Pool;
const pool = new Pool({
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
})

// ADD NEW Upload
const AddUpload = async(request, response) => {
    if (!request.file) {
        return response.status(400).json({ error: 'File is required' });
    }

    try {        
        const result =  await pool.query(`INSERT INTO uploads(label, file_name) VALUES ('${request.body.label}', '${request.file.filename}') RETURNING *`);
        if (result.rows.length === 0) {
            return response.status(404).json({ error: 'Document not uploaded' });
        }
        return response.status(200).json(result.rows[0]);   
    } catch (error) {
        console.log(error);
        return response.status(500).json({message:error});   
    }
}

// GET ALL Uploads
const getUploads = async(request,response)=>{
    await pool.query("SELECT * FROM uploads",function(error,results){
        if(error){
            throw error
        }
        return response.status(200).json(results.rows);
    })
}

// GET Upload BY ID
const getUploadById = (request, response) => {
    let id = +(request.params.id);
    pool.query(`SELECT * FROM uploads where id = ${id}`, function (error, results) {
        if (error) {
            throw error
        }
        return response.status(200).send(results.rows);
    })
}

const getOneFile = async(id) =>{
    const result = await pool.query(`SELECT * FROM uploads where id = ${id}`);
    return result.rows[0];
}

// DELETE Uploads BY ID
const deleteUploadByID = async(request,response) =>{
    let id = +(request.params.id);
    const file = await getOneFile(id);
    if(!file){
        return response.status(401).json({message:`File not Found`})
    }
    
    if (fs.existsSync(`catalog/${file.file_name}`)) {
        fs.unlinkSync(`catalog/${file.file_name}`);
    }

    pool.query(`DELETE FROM uploads where id = ${id}`,function(error,results){
        if (error) {
            throw error
        }
        return response.status(200).json({message:`Deleted Upload ID:${id}`});
    })
}

// UPDATE EXISTING Uploads
const updateUpload = async(request, response) => {
    let id = +(request.params.id);
    let { label } = request.body;
    if (!label) {
        return response.status(400).json({ error: 'File label is required' });
    }

    try {
        const result = await pool.query(`UPDATE uploads SET label='${label}' where id = ${id} RETURNING *`);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        return response.status(200).json(result.rows[0]);
    } catch (error) {
        throw error
    }
}



module.exports = {
    getUploads,
    getUploadById,
    deleteUploadByID,
    AddUpload,
    updateUpload
}
