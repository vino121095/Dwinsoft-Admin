const express = require("express");
const { AddUser, GetUser, UpdateUser, DeleteUser } = require('../Controllers/user');

const router = express.Router();

// Login route
router.post("/user", AddUser);
router.get("/user", GetUser);
router.put('/user/update/:id', UpdateUser);
router.delete("/user/delete/:id",DeleteUser)

module.exports = router;
