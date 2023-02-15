const router = require("express").Router();
const registerValidation = require("../vaildation").registerValidation;
const loginValidation = require("../vaildation").loginValidation;
const User = require("../models").userModel;
const { compare } = require("bcrypt");
const jwt = require("jsonwebtoken");


router.use((req, res, next) => {
    console.log("a request is coming in to auth.js");
    next();
});

router.get("/testAPI", (req, res) => {
    const msgObj = {
        message:"Text api is working"
    };
    return res.json(msgObj);
});

module.exports = router;
