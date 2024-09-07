const express = require("express");
const { CreateUser, getAllUsers, LoginUser,getLoggedInUser,DeleteUserById,getUserById,updateUser } = require("../Controller/UserContoller.js");
const UserRoute = express.Router();
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

UserRoute.post("/add",CreateUser);
UserRoute.post("/login",LoginUser);
UserRoute.get("/get_login_user",getLoggedInUser);
UserRoute.get("/getAll",getAllUsers);
UserRoute.get("/getUser/:id",getUserById);
UserRoute.put("/:id",updateUser);
UserRoute.delete("/delete/:id",DeleteUserById);

module.exports = {
    UserRoute
}

