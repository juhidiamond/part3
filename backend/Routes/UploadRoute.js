const express = require("express");
const { getUploads, updateUpload, deleteUploadByID, AddUpload } = require("../Controller/UploadController.js");
const { ServiceMiddleware } = require("../Middleware/ServiceMiddleware.js");
const UploadRoute = express.Router();
const multer = require('multer');

UploadRoute.get("/getall",ServiceMiddleware,getUploads);
UploadRoute.put("/:id",ServiceMiddleware,updateUpload);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'catalog/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+'-'+file.originalname);
    }
});

const upload = multer({ storage });
UploadRoute.post("/add",ServiceMiddleware,upload.single('file'),AddUpload);
UploadRoute.delete("/delete/:id",ServiceMiddleware,deleteUploadByID);


module.exports = {UploadRoute};